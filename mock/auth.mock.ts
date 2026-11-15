import { randomUUID } from 'node:crypto'

import { defineMock } from 'vite-plugin-mock-dev-server'

import type { ApiResponse, LoginResult } from '../src/api/types.js'

export default defineMock({
  url: '/api/auth/login',
  method: 'POST',
  delay: 400,
  body: ({ body }): ApiResponse<LoginResult | null> => {
    if (
      typeof body?.email !== 'string' ||
      typeof body?.password !== 'string' ||
      !body.email.trim() ||
      !body.password
    ) {
      return { code: 400, message: '请输入邮箱和密码', data: null }
    }

    if (body.email !== 'admin@example.com' || body.password !== '123456') {
      return { code: 1001, message: '邮箱或密码错误，请重新输入', data: null }
    }

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: `mock-${randomUUID()}`,
        user: { id: 1, name: '管理员', role: 'admin' },
      },
    }
  },
})
