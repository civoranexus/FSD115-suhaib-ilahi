import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loginAsync, registerAsync, logoutAsync, getUserAsync, updateProfileAsync } from '../redux/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY)
    if (token && !auth.user) {
      dispatch(getUserAsync())
    }
  }, [])

  const login = (email, password) => {
    return dispatch(loginAsync({ email, password }))
  }

  const register = (userData) => {
    return dispatch(registerAsync(userData))
  }

  const logout = () => {
    return dispatch(logoutAsync())
  }

  const updateProfile = (userData) => {
    return dispatch(updateProfileAsync(userData))
  }

  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    kycVerified: auth.kycVerified,
    login,
    register,
    logout,
    updateProfile,
  }
}
