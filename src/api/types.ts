export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface User {
  id: number
  name: string
  role: 'admin' | 'member'
}

export interface Health {
  status: 'ok'
  source: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}
