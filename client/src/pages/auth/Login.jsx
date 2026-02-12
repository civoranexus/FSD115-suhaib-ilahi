import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { validateForm, loginSchema } from '../../utils/validators'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleQuickLogin = (role) => {
    const credentials = {
      buyer: { email: 'john@example.com', password: 'password123' },
      seller: { email: 'seller@livestockhub.com', password: 'password123' },
      admin: { email: 'admin@livestockhub.com', password: 'password123' }
    }

    setFormData(credentials[role])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const validation = await validateForm(loginSchema, formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    try {
      const result = await login(formData.email, formData.password)
      if (result.type === 'auth/login/fulfilled') {
        const user = result.payload.user || result.payload.data.user;
        toast.success(`Welcome back, ${user.firstName}!`)

        if (user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        toast.error(result.payload || 'Login failed')
      }
    } catch (err) {
      toast.error('Login failed')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
      <p className="text-gray-600 mb-6">Login to your account</p>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Login
        </Button>
      </form>

      {/* Quick Login Options for Demo */}
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-500 mb-3 text-center">Quick Login (Demo Mode)</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('buyer')}
            className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('seller')}
            className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      <p className="text-center text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Register here
        </Link>
      </p>
    </div>
  )
}

export default Login
