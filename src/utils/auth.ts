const TokenKey = 'xztimes_token'
const RefreshTokenKey = 'xztimes_refresh_token'

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TokenKey)
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TokenKey, token)
}

/**
 * 移除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(TokenKey)
}

/**
 * 获取 Refresh Token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(RefreshTokenKey)
}

/**
 * 设置 Refresh Token
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(RefreshTokenKey, token)
}

/**
 * 移除 Refresh Token
 */
export function removeRefreshToken(): void {
  localStorage.removeItem(RefreshTokenKey)
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  removeToken()
  removeRefreshToken()
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken()
}
