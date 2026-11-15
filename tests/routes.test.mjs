import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { createServer } from 'vite'

let server
let routes
let browserRouter
const originalWindow = globalThis.window
const originalDocument = globalThis.document

before(async () => {
  server = await createServer({ server: { middlewareMode: true } })
  globalThis.window = Object.assign(new EventTarget(), {
    location: new URL('http://localhost/'),
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
  browserRouter = routerModule.router
})

after(async () => {
  browserRouter?.dispose()
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
  if (originalDocument === undefined) delete globalThis.document
  else globalThis.document = originalDocument
  await server?.close()
})

test('全部工作台页面与关于页无需登录即可直接访问', () => {
  for (const [path, heading] of [
    ['/', '让好想法，开始工作。'],
    ['/agents', '智能体中心'],
    ['/chat', '智能对话'],
    ['/evaluations', '模型评测'],
    ['/writer', '内容工作室'],
    ['/approvals', '工具审批'],
    ['/analytics', '数据洞察'],
    ['/projects', '项目与订阅'],
    ['/creative', '创意交互'],
    ['/components', '组件实验室'],
    ['/settings', '工作空间设置'],
    ['/about?tab=info', '关于项目'],
    ['/missing', '页面不存在'],
  ]) {
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    try {
      const expected = new URL(path, 'http://localhost')
      assert.equal(router.state.initialized, true)
      assert.equal(router.state.location.pathname, expected.pathname)
      assert.equal(router.state.location.search, expected.search)
      assert.equal(router.state.errors, null)
      const markup = renderToString(createElement(RouterProvider, { router }))
      assert.ok(
        markup.includes(`<h1>${heading}</h1>`) ||
          new RegExp(`<h1[^>]*>${heading}</h1>`).test(markup),
        `${path} 未显示对应页面内容`,
      )
      assert.ok(!markup.includes('Invalid Date'), `${path} 包含无效日期`)
    } finally {
      router.dispose()
    }
  }
})
