import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken, clearAuth } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import cache from '@/utils/cache'

// 下载 loading 实例
let downloadLoadingInstance: ReturnType<typeof ElLoading.service> | null = null

// 是否显示重新登录弹窗
export const isRelogin = { show: false }

// 请求对象接口
interface RequestObj {
  url: string
  data: string
  time: number
}

// 扩展 AxiosRequestConfig 以支持自定义 headers
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers?: AxiosRequestConfig['headers'] & {
    isToken?: boolean
    repeatSubmit?: boolean
  }
}

// 自定义请求函数类型，返回解包后的数据
interface RequestInstance extends AxiosInstance {
  <T = unknown>(config: CustomAxiosRequestConfig): Promise<T>
  <T = unknown>(url: string, config?: CustomAxiosRequestConfig): Promise<T>
}

// 参数转换函数
export function tansParams(params: Record<string, unknown>): string {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value as Record<string, unknown>)) {
          if ((value as Record<string, unknown>)[key] !== null && (value as Record<string, unknown>)[key] !== undefined && (value as Record<string, unknown>)[key] !== '') {
            const subPart = encodeURIComponent(propName + '[' + key + ']') + '='
            result += subPart + encodeURIComponent(String((value as Record<string, unknown>)[key])) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(String(value)) + '&'
      }
    }
  }
  return result
}

// blob 数据验证
export function blobValidate(data: Blob): boolean {
  return data.type !== 'application/json'
}

// 设置默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建 axios 实例
const service = axios.create({
  // baseURL 从环境变量获取，Vite 使用 import.meta.env
  baseURL: import.meta.env.VITE_APP_BASE_API as string || '/api',
  // 超时时间
  timeout: 150000
}) as RequestInstance

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false

    // 添加 token
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    // GET 请求映射 params 参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    // 防止重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj: RequestObj = {
        url: config.url || '',
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const requestSize = Object.keys(JSON.stringify(requestObj)).length
      const limitSize = 5 * 1024 * 1024 // 限制存放数据 5M

      if (requestSize >= limitSize) {
        console.warn(`[${config.url}]: 请求数据大小超出允许的5M限制，无法进行防重复提交验证。`)
        return config
      }

      const sessionObj = cache.session.getJSON<RequestObj>('sessionObj')
      if (sessionObj === null) {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url
        const s_data = sessionObj.data
        const s_time = sessionObj.time
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交

        if (
          s_data &&
          s_data.length > 2 &&
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }

    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']

    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    // 401: 登录过期
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            isRelogin.show = false
            clearAuth()
            location.href = '/login'
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    }

    // 500: 服务器错误
    if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    }

    // 601: 警告信息
    if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error('error'))
    }

    // 其他错误
    if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject(new Error('error'))
    }

    return res.data
  },
  (error) => {
    console.log('err' + error)
    let { message } = error

    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }

    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

/**
 * 通用下载方法
 * @param url 下载地址
 * @param params 请求参数
 * @param filename 文件名
 * @param config 额外配置
 */
export async function download(
  url: string,
  params: Record<string, unknown>,
  filename: string,
  config?: AxiosRequestConfig
): Promise<void> {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const data = await service.post<Blob>(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })

    const blobData = data as unknown as Blob
    const isBlob = blobValidate(blobData)
    if (isBlob) {
      const blob = new Blob([blobData])
      // 使用原生方式下载
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } else {
      const resText = await blobData.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg)
    }
  } catch (r) {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
  } finally {
    downloadLoadingInstance?.close()
  }
}

/**
 * 上传并下载方法（用于上传文件后返回处理结果）
 * @param url 下载地址
 * @param params 请求参数（FormData）
 * @param filename 文件名
 */
export async function uploadInDownload(
  url: string,
  params: FormData,
  filename: string
): Promise<void> {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const data = await service.post<Blob>(url, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    })

    const blobData = data as unknown as Blob
    const isBlob = blobValidate(blobData)
    if (isBlob) {
      const blob = new Blob([blobData])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } else {
      const resText = await blobData.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg)
    }
  } catch (r) {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
  } finally {
    downloadLoadingInstance?.close()
  }
}

// 导出封装的请求方法
export const request = {
  get<T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config })
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
  delete<T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config })
  },
  upload<T = unknown>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return service.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    })
  }
}

export default service
