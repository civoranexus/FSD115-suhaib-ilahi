import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/api/authService'

const JWT_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token'
const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'user_data'

const initialState = {
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  token: localStorage.getItem(JWT_KEY) || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem(JWT_KEY),
  kycVerified: false,
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password })
      // Backend response: { success, data: { user, accessToken, refreshToken } }
      const { user, accessToken, refreshToken } = response.data.data
      localStorage.setItem(JWT_KEY, accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return { user, token: accessToken }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      // Backend response: { success, data: { user, accessToken, refreshToken } }
      const { user, accessToken, refreshToken } = response.data.data
      localStorage.setItem(JWT_KEY, accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return { user, token: accessToken }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const verifyKYCAsync = createAsyncThunk(
  'auth/verifyKYC',
  async (kycData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyKYC(kycData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'KYC verification failed')
    }
  }
)

export const getUserAsync = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUser()
      // Backend response: { success, data: { user } }
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem(JWT_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('refresh_token')
      return rejectWithValue('Logout failed')
    }
  }
)

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userData)
      // Return updated user object
      return response.data.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.kycVerified = action.payload.user?.kycStatus === 'verified'
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyKYCAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyKYCAsync.fulfilled, (state) => {
        state.loading = false
        state.kycVerified = true
        if (state.user) {
          state.user.kycStatus = 'verified'
        }
      })
      .addCase(verifyKYCAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getUserAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getUserAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem(USER_KEY, JSON.stringify(state.user))
        alert('Profile Updated Successfully')
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.kycVerified = false
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
