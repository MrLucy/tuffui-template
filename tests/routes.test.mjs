import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import { createMemoryRouter } from 'react-router'
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
  for (const path of [
    '/',
    '/agents',
    '/chat',
    '/evaluations',
    '/writer',
    '/approvals',
    '/analytics',
    '/projects',
    '/creative',
    '/components',
    '/settings',
    '/about?tab=info',
    '/missing',
  ]) {
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    try {
      const expected = new URL(path, 'http://localhost')
      assert.equal(router.state.initialized, true)
      assert.equal(router.state.location.pathname, expected.pathname)
      assert.equal(router.state.location.search, expected.search)
      assert.equal(router.state.errors, null)
    } finally {
      router.dispose()
    }
  }
})
