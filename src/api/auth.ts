import type { RequestOptions } from '@/lib/request'
import { request } from '@/lib/request'

import type { LoginParams, LoginResult } from './types'

export function login(data: LoginParams, options?: RequestOptions) {
  return request<LoginResult, LoginParams>({
    ...options,
    url: '/auth/login',
    method: 'POST',
    data,
  })
}
