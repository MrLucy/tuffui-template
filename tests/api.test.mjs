import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import axios from 'axios'
import { createServer } from 'vite'

let server
let api
let request
let ApiError
let options
const previousMockEnabled = process.env.MOCK_ENABLED

before(async () => {
  process.env.MOCK_ENABLED = 'true'
  server = await createServer({
    server: { host: '127.0.0.1', port: 0 },
    plugins: [
      {
        name: 'api-test-fixtures',
        configureServer(vite) {
          vite.middlewares.use('/api/test/slow', (_req, res) => {
            const timer = setTimeout(() => {
              res.end(JSON.stringify({ code: 0, message: 'ok', data: null }))
            }, 200)
            res.on('close', () => clearTimeout(timer))
          })
        },
      },
    ],
  })
  await server.listen()
  const { port } = server.httpServer.address()
  options = { baseURL: `http://127.0.0.1:${port}/api` }
  api = await server.ssrLoadModule('/src/api/index.ts')
  ;({ request, ApiError } = await server.ssrLoadModule('/src/lib/request.ts'))
})

after(async () => {
  await server?.close()
  if (previousMockEnabled === undefined) delete process.env.MOCK_ENABLED
  else process.env.MOCK_ENABLED = previousMockEnabled
})

test('接口层经 Axios 请求 Mock，并解包业务数据', async () => {
  assert.deepEqual(await api.getHealth(options), {
    status: 'ok',
    source: 'mock',
  })
  const users = await api.getUsers(undefined, options)
  assert.equal(users.length, 2)
  assert.deepEqual(await api.getUser(1, options), users[0])
})

test('列表支持查询参数及空结果', async () => {
  const users = await api.getUsers({ keyword: '张' }, options)
  assert.equal(users.length, 1)
  assert.equal(users[0].name, '张三')
  assert.deepEqual(await api.getUsers({ keyword: '不存在' }, options), [])
})

test('HTTP 错误保留 Axios 状态码及服务端错误信息', async () => {
  await assert.rejects(api.getUser(999, options), (error) => {
    assert.ok(axios.isAxiosError(error))
    assert.equal(error.response.status, 404)
    assert.equal(error.response.data.message, '用户不存在')
    return true
  })
})

function responseAdapter(data) {
  return async (config) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  })
}

test('HTTP 成功但业务失败时抛出 ApiError', async () => {
  await assert.rejects(
    request({
      url: '/test',
      adapter: responseAdapter({ code: 1001, message: '操作失败', data: null }),
    }),
    (error) => {
      assert.ok(error instanceof ApiError)
      assert.equal(error.code, 1001)
      assert.equal(error.status, 200)
      assert.equal(error.message, '操作失败')
      return true
    },
  )
})

test('不符合约定的响应不会被静默解包为 undefined', async () => {
  for (const data of ['<html></html>', null, { code: 0, message: 'ok' }]) {
    await assert.rejects(
      request({ url: '/test', adapter: responseAdapter(data) }),
      (error) => error instanceof ApiError && error.code === -1,
    )
  }
})

test('支持 AbortSignal 取消请求', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(
    api.getUsers(undefined, { ...options, signal: controller.signal }),
    (error) => axios.isCancel(error),
  )
})

test('超时请求保留 Axios 超时错误', async () => {
  await assert.rejects(
    request({ ...options, url: '/test/slow', timeout: 30 }),
    (error) => axios.isAxiosError(error) && error.code === 'ECONNABORTED',
  )
})

test('登录接口返回 Token 和用户信息', async () => {
  const result = await api.login(
    { email: 'admin@example.com', password: '123456' },
    options,
  )
  assert.match(result.token, /^mock-/)
  assert.equal(result.user.role, 'admin')
  assert.equal('password' in result.user, false)
})

test('登录接口拒绝错误凭据和缺失参数', async () => {
  await assert.rejects(
    api.login({ email: 'admin@example.com', password: 'wrong' }, options),
    (error) => error instanceof ApiError && error.code === 1001,
  )
  await assert.rejects(
    api.login({ email: '', password: '' }, options),
    (error) => error instanceof ApiError && error.code === 400,
  )
})
