import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const JWT_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(JWT_KEY)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh and errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and not already retrying, attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                if (!refreshToken) {
                    throw new Error('No refresh token')
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken,
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data.data
                localStorage.setItem(JWT_KEY, accessToken)
                localStorage.setItem('refresh_token', newRefreshToken)

                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return apiClient(originalRequest)
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem(JWT_KEY)
                localStorage.removeItem('refresh_token')
                localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY || 'user_data')

                // Only redirect if not already on auth pages
                if (!window.location.pathname.startsWith('/auth/login') &&
                    !window.location.pathname.startsWith('/auth/register')) {
                    window.location.href = '/auth/login'
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
