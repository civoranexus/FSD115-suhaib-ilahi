import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerAsync } from '../../redux/slices/authSlice'
import { validateForm, registerSchema } from '../../utils/validators'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'buyer',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setError(null)

    const validation = await validateForm(registerSchema, formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(registerAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      }))

      if (result.type === 'auth/register/fulfilled') {
        toast.success('Registration successful! Welcome to LiveStockHub.')
        navigate('/dashboard')
      } else {
        const errMsg = result.payload || 'Registration failed'
        setError(errMsg)
        toast.error(errMsg)
      }
    } catch (err) {
      setError('Registration failed')
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
      <p className="text-gray-600 mb-6">Join LiveStockHub marketplace</p>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <Input
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

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
          name="phoneNumber"
          type="tel"
          label="Phone Number"
          placeholder="+919999999999"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          required
        />

        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Min 8 chars, uppercase, number"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" required />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Register
        </Button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Login here
        </Link>
      </p>
    </div>
  )
}

export default Register
