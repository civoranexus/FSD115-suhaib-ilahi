import apiClient from '../../utils/apiClient'
import { dummyUsers } from './dummyData'

// Mock JWT with future expiration (exp: 9999999999)
const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMTIzIiwiZXhwIjo5OTk5OTk5OTk5fQ.dummy_signature"

const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for login')

      let user = dummyUsers.currentUser;
      const email = credentials.email.toLowerCase();

      if (email.includes('admin')) {
        user = dummyUsers.adminUser;
      } else if (email.includes('seller')) {
        user = dummyUsers.sellerUser;
      }

      return {
        data: {
          success: true,
          data: {
            token: MOCK_JWT,
            accessToken: MOCK_JWT,
            refreshToken: 'dummy_refresh_token',
            user: user
          }
        }
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for register')
      return {
        data: {
          success: true,
          message: 'Registration successful (Dummy)',
          data: {
            token: MOCK_JWT,
            accessToken: MOCK_JWT,
            refreshToken: 'dummy_refresh_token',
            user: dummyUsers.currentUser
          }
        }
      }
    }
  },

  logout: async () => {
    // Clear local storage on logout (backend has no logout endpoint)
    localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY)
    localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY)
    localStorage.removeItem('refresh_token')
    return { data: { success: true } }
  },

  verifyKYC: async (kycData) => {
    try {
      const formData = new FormData()
      Object.keys(kycData).forEach(key => {
        if (Array.isArray(kycData[key])) {
          kycData[key].forEach((file, index) => {
            formData.append(`${key}[${index}]`, file)
          })
        } else {
          formData.append(key, kycData[key])
        }
      })
      const response = await apiClient.post('/users/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for KYC')
      return { data: { success: true, message: 'KYC submitted successfully (Dummy)' } }
    }
  },

  getUser: async () => {
    try {
      const response = await apiClient.get('/users/profile')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getUser')
      return { data: { success: true, data: { user: dummyUsers.currentUser } } }
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for forgotPassword')
      return { data: { success: true, message: 'Password reset email sent (Dummy)' } }
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post(`/auth/reset-password/${token}`, { password })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for resetPassword')
      return { data: { success: true, message: 'Password reset successful (Dummy)' } }
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for updateProfile')
      return { data: { success: true, data: { user: { ...dummyUsers.currentUser, ...userData } } } }
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for changePassword')
      return { data: { success: true, message: 'Password changed successfully (Dummy)' } }
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken,
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for refreshToken')
      return { data: { success: true, token: MOCK_JWT } }
    }
  },
}

export { authService }
