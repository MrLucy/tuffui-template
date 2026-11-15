import axios from 'axios'
import type { ActionFunctionArgs } from 'react-router'
import { replace } from 'react-router'

import { login } from '@/api'
import { setAccessToken } from '@/lib/auth'
import { ApiError } from '@/lib/request'

interface LoginErrors {
  email?: string
  password?: string
  form?: string
}

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const errors: LoginErrors = {}

  if (!email) errors.email = '请输入邮箱地址'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '请输入有效的邮箱地址'
  }
  if (!password.trim()) errors.password = '请输入密码'
  if (Object.keys(errors).length) return { errors }

  try {
    const result = await login({ email, password }, { signal: request.signal })
    request.signal.throwIfAborted()
    setAccessToken(result.token)
    return replace('/')
  } catch (error) {
    if (request.signal.aborted) throw error
    if (error instanceof ApiError) errors.form = error.message
    else if (axios.isAxiosError(error)) {
      errors.form = ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code ?? '')
        ? '登录请求超时，请重试'
        : '暂时无法登录，请检查网络后重试'
    } else errors.form = '登录未完成，请重试'
    return { errors }
  }
}
