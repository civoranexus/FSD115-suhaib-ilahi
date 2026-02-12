import Cookies from 'js-cookie'

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY, token)
    Cookies.set('auth_token', token, {
      expires: 7,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
    })
  }
}

export const getAuthToken = () => {
  return localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY) || Cookies.get('auth_token')
}

export const removeAuthToken = () => {
  localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY)
  Cookies.remove('auth_token')
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const getObjectFromFormData = (formData) => {
  const obj = {}
  formData.forEach((value, key) => {
    if (obj[key]) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]]
      }
      obj[key].push(value)
    } else {
      obj[key] = value
    }
  })
  return obj
}

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    return false
  }
}

export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.error) return error.response.data.error
  return 'An unexpected error occurred'
}

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

export const isTokenExpired = (token) => {
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}
