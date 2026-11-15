import { defineMock } from 'vite-plugin-mock-dev-server'

import type { ApiResponse, User } from '../src/api/types.js'

const users: User[] = [
  { id: 1, name: '张三', role: 'admin' },
  { id: 2, name: '李四', role: 'member' },
]

export default defineMock([
  {
    url: '/api/users',
    method: 'GET',
    body: ({ query }): ApiResponse<User[]> => {
      const keyword = String(query.keyword ?? '').trim()
      return {
        code: 0,
        message: 'ok',
        data: users.filter((user) => user.name.includes(keyword)),
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'GET',
    response(req, res) {
      const user = users.find((item) => String(item.id) === req.params.id)
      const body: ApiResponse<User | null> = user
        ? { code: 0, message: 'ok', data: user }
        : { code: 404, message: '用户不存在', data: null }

      res.statusCode = user ? 200 : 404
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(body))
    },
  },
])
