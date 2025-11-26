import service from '@/utils/request'
import { setToken, setRefreshToken, clearAuth } from '@/utils/auth'

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

// 登录响应数据
export interface LoginResult {
  code: number
  msg: string
  token: string
  refreshToken?: string
}

// 用户信息
export interface UserInfo {
  userId: number | string
  userName: string
  nickName: string
  avatar: string
  email?: string
  phonenumber?: string
  sex?: string
  roles?: string[]
  permissions?: string[]
}

// 获取用户信息响应
export interface UserInfoResult {
  code: number
  msg: string
  user: UserInfo
  roles: string[]
  permissions: string[]
}

// 验证码响应
export interface CaptchaResult {
  code: number
  msg: string
  captchaEnabled: boolean
  uuid: string
  img: string
}

/**
 * 登录方法
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param uuid 验证码唯一标识
 */
export function login(username: string, password: string, code?: string, uuid?: string) {
  const referer = window.location.host
  const data = {
    username,
    password,
    code,
    uuid,
    referer
  }
  return service<LoginResult>({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

/**
 * 登录并保存 Token
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param uuid 验证码唯一标识
 */
export async function loginAndSaveToken(
  username: string,
  password: string,
  code?: string,
  uuid?: string
): Promise<LoginResult> {
  const res = await login(username, password, code, uuid)
  if (res.code === 200 && res.token) {
    setToken(res.token)
    if (res.refreshToken) {
      setRefreshToken(res.refreshToken)
    }
  }
  return res
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return service<UserInfoResult>({
    url: '/getInfo',
    method: 'get'
  })
}

/**
 * 获取验证码
 */
export function getCaptcha() {
  return service<CaptchaResult>({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/**
 * 退出登录
 */
export function logout() {
  return service({
    url: '/logout',
    method: 'post'
  })
}

/**
 * 退出登录并清除认证信息
 */
export async function logoutAndClear(): Promise<void> {
  try {
    await logout()
  } finally {
    clearAuth()
  }
}

/**
 * 注册方法
 * @param data 注册数据
 */
export function register(data: {
  username: string
  password: string
  confirmPassword: string
  code?: string
  uuid?: string
}) {
  return service({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
