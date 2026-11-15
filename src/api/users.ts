import type { RequestOptions } from '@/lib/request'
import { request } from '@/lib/request'

import type { User } from './types'

export interface GetUsersParams {
  keyword?: string
}

export function getUsers(params?: GetUsersParams, options?: RequestOptions) {
  return request<User[]>({ ...options, url: '/users', method: 'GET', params })
}

export function getUser(id: number, options?: RequestOptions) {
  return request<User>({ ...options, url: `/users/${id}`, method: 'GET' })
}
