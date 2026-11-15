const TOKEN_KEY = 'tuffui.access-token'
const AUTH_CHANGE_EVENT = 'tuffui:auth-change'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)?.trim() || null
}

export function setAccessToken(token: string) {
  const value = token.trim()
  if (!value) throw new Error('登录 Token 不能为空')
  window.localStorage.setItem(TOKEN_KEY, value)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function subscribeAuth(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY || event.key === null) onChange()
  }
  window.addEventListener(AUTH_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}
