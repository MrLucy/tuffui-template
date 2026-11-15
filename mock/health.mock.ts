import { defineMock } from 'vite-plugin-mock-dev-server'

import type { ApiResponse, Health } from '../src/api/types.js'

export default defineMock({
  url: '/api/health',
  method: 'GET',
  body: {
    code: 0,
    message: 'ok',
    data: { status: 'ok', source: 'mock' },
  } satisfies ApiResponse<Health>,
})
