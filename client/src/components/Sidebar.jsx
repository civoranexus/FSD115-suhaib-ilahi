import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarOpen } from '../redux/slices/uiSlice'
import { FiHome, FiList, FiBook, FiHeart, FiMessageSquare, FiUser, FiLogOut, FiX } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen)
  const { user, logout } = useAuth()

  const dashboardLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'My Listings', path: '/dashboard/listings', icon: FiList, roles: ['seller', 'admin'] },
    { name: 'My Bids', path: '/dashboard/bids', icon: FiBook, roles: ['buyer', 'seller', 'admin'] },
    { name: 'Watchlist', path: '/dashboard/watchlist', icon: FiHeart },
    { name: 'Messages', path: '/dashboard/messages', icon: FiMessageSquare },
    { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 md:z-auto
        transform transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 md:hidden">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button onClick={() => dispatch(setSidebarOpen(false))}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {dashboardLinks.filter(link => !link.roles || (user && link.roles.includes(user.role))).map(link => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
