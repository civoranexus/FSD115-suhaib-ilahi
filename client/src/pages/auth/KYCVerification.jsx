import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyKYCAsync } from '../../redux/slices/authSlice'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'

const KYCVerification = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, kycVerified } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    documentPhoto: null,
    selfiePhoto: null,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files?.[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!formData.documentPhoto || !formData.selfiePhoto) {
      toast.error('Please upload both document and selfie photos')
      return
    }

    try {
      const result = await dispatch(verifyKYCAsync(formData))
      if (!result.payload?.error) {
        toast.success('KYC verification submitted successfully!')
        navigate('/dashboard')
      } else {
        toast.error(result.payload)
      }
    } catch (err) {
      toast.error('KYC verification failed')
    }
  }

  if (kycVerified) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">KYC Already Verified</h1>
        <p className="text-gray-600 mb-6">Your account has already been verified.</p>
        <Button onClick={() => navigate('/dashboard')} variant="primary">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
      <p className="text-gray-600 mb-6">Complete your identity verification</p>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="documentType"
            label="Document Type"
            as="select"
            value={formData.documentType}
            onChange={handleChange}
            required
          />
          <Input
            name="documentNumber"
            label="Document Number"
            placeholder="Enter document number"
            value={formData.documentNumber}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          name="fullName"
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <Input
          name="dateOfBirth"
          type="date"
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <Input
          name="address"
          label="Address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="city"
            label="City"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <Input
            name="state"
            label="State"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="zipCode"
            label="Zip Code"
            placeholder="Zip code"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
          <Input
            name="country"
            label="Country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">Document Photo</span>
            <input
              type="file"
              name="documentPhoto"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Upload clear photo of your ID/Passport</p>
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">Selfie Photo</span>
            <input
              type="file"
              name="selfiePhoto"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Upload selfie with document in hand</p>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Verify Account
        </Button>
      </form>
    </div>
  )
}

export default KYCVerification
