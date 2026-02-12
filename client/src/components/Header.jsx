import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import { useMessages } from '../hooks/useMessages'
import { FiMenu, FiX, FiBell, FiMessageSquare, FiUser, FiLogOut } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMobileMenu } from '../redux/slices/uiSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user, logout } = useAuth()
  const { unreadCount: notificationCount, items, markAsRead, markAllAsRead } = useNotifications()
  const { unreadCount: messageCount } = useMessages()
  const mobileMenuOpen = useSelector(state => state.ui.mobileMenuOpen)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="container-section flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          AuctionHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/listings" className="text-gray-600 hover:text-gray-900 transition-colors">
            Listings
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setProfileMenuOpen(false)
                  }}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiBell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-100 max-h-[400px] overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-semibold text-gray-700">Notifications</h3>
                      {notificationCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div>
                      {items.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        items.map(item => (
                          <div
                            key={item._id || item.id}
                            onClick={() => {
                              markAsRead(item._id || item.id)
                              if (item.link) {
                                navigate(item.link)
                                setNotificationsOpen(false)
                              }
                            }}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!item.read ? 'bg-blue-50/50' : ''
                              }`}
                          >
                            <p className="text-sm font-medium text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(item.createdAt || item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <Link to="/dashboard/messages" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FiMessageSquare className="w-5 h-5" />
                {messageCount > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg transition-colors flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/auth/login" className="btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/auth/register" className="btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4">
          <Link to="/listings" className="block py-2 text-gray-600 hover:text-gray-900">
            Listings
          </Link>
          <Link to="/about" className="block py-2 text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link to="/contact" className="block py-2 text-gray-600 hover:text-gray-900">
            Contact
          </Link>
          {!isAuthenticated && (
            <div className="mt-4 flex gap-2">
              <Link to="/auth/login" className="flex-1 btn-secondary btn-sm text-center">
                Login
              </Link>
              <Link to="/auth/register" className="flex-1 btn-primary btn-sm text-center">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
