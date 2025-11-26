/**
 * 缓存工具类
 * 用于 sessionStorage 和 localStorage 操作
 */

const sessionCache = {
  set(key: string, value: string): void {
    if (value !== null && value !== undefined) {
      sessionStorage.setItem(key, value)
    }
  },
  get(key: string): string | null {
    return sessionStorage.getItem(key)
  },
  setJSON<T>(key: string, jsonValue: T): void {
    if (jsonValue !== null && jsonValue !== undefined) {
      sessionStorage.setItem(key, JSON.stringify(jsonValue))
    }
  },
  getJSON<T>(key: string): T | null {
    const value = sessionStorage.getItem(key)
    if (value !== null && value !== undefined) {
      try {
        return JSON.parse(value) as T
      } catch {
        return null
      }
    }
    return null
  },
  remove(key: string): void {
    sessionStorage.removeItem(key)
  },
  clear(): void {
    sessionStorage.clear()
  }
}

const localCache = {
  set(key: string, value: string): void {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, value)
    }
  },
  get(key: string): string | null {
    return localStorage.getItem(key)
  },
  setJSON<T>(key: string, jsonValue: T): void {
    if (jsonValue !== null && jsonValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(jsonValue))
    }
  },
  getJSON<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    if (value !== null && value !== undefined) {
      try {
        return JSON.parse(value) as T
      } catch {
        return null
      }
    }
    return null
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  }
}

export default {
  session: sessionCache,
  local: localCache
}
