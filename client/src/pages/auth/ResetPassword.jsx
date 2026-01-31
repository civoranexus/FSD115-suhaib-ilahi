import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { authService } from '../../services/api/authService'
import { validateForm, passwordValidator } from '../../utils/validators'
import { z } from 'zod'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'

const resetSchema = z.object({
  password: passwordValidator,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
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

    const validation = await validateForm(resetSchema, formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, formData.password)
      toast.success('Password reset successful! Please login with your new password.')
      navigate('/auth/login')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
      <p className="text-gray-600 mb-6">Enter your new password</p>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="password"
          type="password"
          label="New Password"
          placeholder="Minimum 8 characters"
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

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
