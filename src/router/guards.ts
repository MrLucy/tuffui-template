import type { LoaderFunctionArgs } from 'react-router'
import { replace } from 'react-router'

import { getAccessToken } from '@/lib/auth'

/** 登录页保持公开，其他页面统一通过父路由守卫。 */
export function requireAuth({ request }: LoaderFunctionArgs) {
  if (getAccessToken()) return null

  const url = new URL(request.url)
  const redirect = `${url.pathname}${url.search}${url.hash}`
  return replace(`/login?${new URLSearchParams({ redirect })}`)
}
