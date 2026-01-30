import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { getAuthToken, isTokenExpired } from '../utils/helpers'
import { useAuth } from '../hooks/useAuth'

const DashboardLayout = () => {
  const { logout } = useAuth()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = getAuthToken()
    if (token && isTokenExpired(token)) {
      logout()
    }
  }, [logout])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="container-section">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
