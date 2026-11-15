import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import type { ApiResponse } from '@/api/types'

import { clearAccessToken, getAccessToken } from './auth'

export type RequestOptions = Omit<
  AxiosRequestConfig,
  'url' | 'method' | 'data' | 'params'
>

export class ApiError extends Error {
  readonly code: number
  readonly status: number

  constructor(message: string, code: number, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// 只清除本次请求使用的登录状态，避免旧请求的 401 清掉新登录的 Token。
function clearUnauthorizedToken(authorization: unknown) {
  const token = getAccessToken()
  if (token && authorization === `Bearer ${token}`) clearAccessToken()
}

client.interceptors.response.use(
  (response) => {
    const body: unknown = response.data
    if (
      typeof body !== 'object' ||
      body === null ||
      !('code' in body) ||
      typeof body.code !== 'number' ||
      !('message' in body) ||
      typeof body.message !== 'string'
    ) {
      throw new ApiError('接口响应格式错误', -1, response.status)
    }

    if (body.code !== 0) {
      if (body.code === 401) {
        clearUnauthorizedToken(response.config.headers.get('Authorization'))
      }
      throw new ApiError(body.message || '请求失败', body.code, response.status)
    }

    if (!('data' in body)) {
      throw new ApiError('接口响应缺少 data 字段', -1, response.status)
    }

    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearUnauthorizedToken(error.config?.headers.get('Authorization'))
    }
    return Promise.reject(error)
  },
)

/** 统一解包业务响应；HTTP、网络、超时和取消错误保留为 Axios 错误。 */
export async function request<T, D = unknown>(
  config: AxiosRequestConfig<D>,
): Promise<T> {
  const response = await client.request<
    ApiResponse<T>,
    AxiosResponse<ApiResponse<T>>,
    D
  >(config)
  return response.data.data
}
