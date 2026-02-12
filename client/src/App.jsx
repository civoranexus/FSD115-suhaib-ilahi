import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './redux/store'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import KYCVerification from './pages/auth/KYCVerification'

// Public Pages
import Home from './pages/public/Home'
import Listings from './pages/public/Listings'
import ListingDetail from './pages/public/ListingDetail'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard'
import MyListings from './pages/dashboard/MyListings'
import MyBids from './pages/dashboard/MyBids'
import Watchlist from './pages/dashboard/Watchlist'
import Messages from './pages/dashboard/Messages'
import Profile from './pages/dashboard/Profile'
import Payments from './pages/dashboard/Payments'
import CreateListing from './pages/dashboard/CreateListing'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminListings from './pages/admin/AdminListings'
import AdminReports from './pages/admin/AdminReports'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminSettings from './pages/admin/AdminSettings'

// Error Pages
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            <Route path="/auth/kyc" element={<KYCVerification />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Dashboard Routes - Private */}
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/listings" element={<MyListings />} />
            <Route path="/dashboard/bids" element={<MyBids />} />
            <Route path="/dashboard/watchlist" element={<Watchlist />} />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/create-listing" element={<CreateListing />} />
            <Route path="/dashboard/edit-listing/:id" element={<CreateListing />} />
          </Route>

          {/* Admin Routes - Private & Admin Only */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
