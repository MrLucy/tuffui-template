import type { RequestOptions } from '@/lib/request'
import { request } from '@/lib/request'

import type { Health } from './types'

export function getHealth(options?: RequestOptions) {
  return request<Health>({ ...options, url: '/health', method: 'GET' })
}
