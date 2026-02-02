import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/api/authService'

const initialState = {
  user: null,
  token: localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY) || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY),
  kycVerified: false,
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password })
      localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY, response.data.token)
      localStorage.setItem(import.meta.env.VITE_USER_STORAGE_KEY, JSON.stringify(response.data.user))
      return response.data
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
      return response.data
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
      return response.data
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
      return response.data
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
      localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY)
      localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY)
      return null
    } catch (error) {
      return rejectWithValue('Logout failed')
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
        state.kycVerified = action.payload.user?.kycVerified || false
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
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyKYCAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyKYCAsync.fulfilled, (state, action) => {
        state.loading = false
        state.kycVerified = true
        if (state.user) {
          state.user.kycVerified = true
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
      })
      .addCase(getUserAsync.rejected, (state, action) => {
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
