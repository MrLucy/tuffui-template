import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'

import { AxiosError } from 'axios'
import { createMemoryRouter } from 'react-router'
import { createServer } from 'vite'

let server
let auth
let routes
let request
const routers = []
const storage = new Map()
const originalWindow = globalThis.window
const originalDocument = globalThis.document

before(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  await server.listen()
  const { port } = server.httpServer.address()
  server.config.env.VITE_API_BASE_URL = `http://127.0.0.1:${port}/api`
  auth = await server.ssrLoadModule('/src/lib/auth.ts')
  ;({ request } = await server.ssrLoadModule('/src/lib/request.ts'))
  globalThis.window = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    location: new URL('http://localhost/login'),
    history: {
      state: { idx: 0 },
      replaceState(state) {
        this.state = state
      },
    },
  })
  globalThis.document = { defaultView: globalThis.window }
  const routerModule = await server.ssrLoadModule('/src/router/index.tsx')
  routes = routerModule.routes
  routers.push(routerModule.router)
})

beforeEach(() => storage.clear())

after(async () => {
  for (const router of routers) router.dispose()
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
  if (originalDocument === undefined) delete globalThis.document
  else globalThis.document = originalDocument
  await server?.close()
})

async function open(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  routers.push(router)
  if (!router.state.initialized) {
    await new Promise((resolve) => {
      const unsubscribe = router.subscribe((state) => {
        if (state.initialized && state.navigation.state === 'idle') {
          unsubscribe()
          resolve()
        }
      })
    })
  }
  return router
}

test('静态工作台页面公开访问，不依赖登录', async () => {
  for (const path of [
    '/',
    '/agents',
    '/chat',
    '/evaluations',
    '/writer',
    '/approvals',
    '/analytics',
    '/projects',
    '/components',
    '/settings',
    '/missing',
  ]) {
    const router = await open(path)
    assert.equal(router.state.location.pathname, path)
    assert.equal(router.state.errors, null)
  }
})

test('保留的关于页继续使用登录守卫', async () => {
  const router = await open('/about?tab=info')
  assert.equal(router.state.location.pathname, '/login')
  assert.equal(
    new URLSearchParams(router.state.location.search).get('redirect'),
    '/about?tab=info',
  )
  assert.equal(router.state.historyAction, 'REPLACE')
})

test('登录页公开访问，没有重定向循环', async () => {
  const router = await open('/login')
  assert.equal(router.state.location.pathname, '/login')
  assert.equal(router.state.errors, null)
})

test('Token 持久保存后可访问页面，退出后在页面切换时拦截', async () => {
  auth.setAccessToken('test-token')
  assert.equal(auth.getAccessToken(), 'test-token')
  const router = await open('/about')
  assert.equal(router.state.location.pathname, '/about')
  auth.clearAccessToken()
  await router.navigate('/about?tab=details')
  assert.equal(router.state.location.pathname, '/login')
})

test('清除 Token 会通知应用重新执行当前路由守卫', async () => {
  auth.setAccessToken('test-token')
  const router = await open('/about')
  let revalidation
  const unsubscribe = auth.subscribeAuth(() => {
    revalidation = router.revalidate()
  })
  try {
    auth.clearAccessToken()
    await revalidation
    assert.equal(router.state.location.pathname, '/login')
  } finally {
    unsubscribe()
  }
})

test('空 Token 不被视为已登录', () => {
  assert.throws(() => auth.setAccessToken('   '))
  assert.equal(auth.getAccessToken(), null)
})

test('Axios 携带 Token，HTTP 401 清除登录状态并保留原始错误', async () => {
  auth.setAccessToken('expired-token')
  await assert.rejects(
    request({
      url: '/test',
      adapter: async (config) => {
        assert.equal(
          config.headers.get('Authorization'),
          'Bearer expired-token',
        )
        throw new AxiosError('未登录', 'ERR_BAD_REQUEST', config, null, {
          status: 401,
          data: {},
          config,
          headers: {},
          statusText: 'Unauthorized',
        })
      },
    }),
    (error) => error.response?.status === 401,
  )
  assert.equal(auth.getAccessToken(), null)
})

test('旧请求业务 401 不会清除新登录状态', async () => {
  auth.setAccessToken('old-token')
  await assert.rejects(
    request({
      url: '/test',
      adapter: async (config) => {
        auth.setAccessToken('new-token')
        return {
          status: 200,
          data: { code: 401, message: '已过期', data: null },
          config,
          headers: {},
          statusText: 'OK',
        }
      },
    }),
    (error) => error.code === 401,
  )
  assert.equal(auth.getAccessToken(), 'new-token')
})

async function submitLogin(router, email, password) {
  const formData = new FormData()
  formData.set('email', email)
  formData.set('password', password)
  await router.navigate('/login', { formMethod: 'post', formData })
}

test('登录 Action 经 API 和 Mock 保存 Token 并跳转首页', async () => {
  const router = await open('/login?redirect=/about')
  const unsubscribe = auth.subscribeAuth(() => void router.revalidate())
  try {
    await submitLogin(router, 'admin@example.com', '123456')
    assert.equal(router.state.errors, null)
    assert.equal(router.state.location.pathname, '/')
    assert.match(auth.getAccessToken(), /^mock-/)
    assert.equal(router.state.historyAction, 'REPLACE')
  } finally {
    unsubscribe()
  }
})

test('密码错误时停留登录页，显示中文错误且不保存 Token', async () => {
  const router = await open('/login')
  await submitLogin(router, 'admin@example.com', 'wrong-password')
  assert.equal(router.state.location.pathname, '/login')
  assert.equal(auth.getAccessToken(), null)
  assert.equal(
    Object.values(router.state.actionData)[0].errors.form,
    '邮箱或密码错误，请重新输入',
  )
})

test('空字段及错误邮箱返回中文字段校验结果', async () => {
  const router = await open('/login')
  await submitLogin(router, '', '')
  assert.deepEqual(Object.values(router.state.actionData)[0].errors, {
    email: '请输入邮箱地址',
    password: '请输入密码',
  })
  await submitLogin(router, 'invalid-email', '123456')
  assert.equal(
    Object.values(router.state.actionData)[0].errors.email,
    '请输入有效的邮箱地址',
  )
  assert.equal(auth.getAccessToken(), null)
})
