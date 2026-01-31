import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/Input'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'

const Profile = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, avatar: e.target.files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call to update profile
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar */}
        <Card className="text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold mb-4">{user?.firstName} {user?.lastName}</h2>
          <label className="btn-secondary btn-sm cursor-pointer inline-flex items-center gap-2">
            <FiUpload className="w-4 h-4" />
            Change Avatar
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-6">Personal Information</h3>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <Input
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />

              <Input
                name="phone"
                type="tel"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <TextArea
                name="bio"
                label="Bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Save Changes
            </Button>
          </Card>
        </form>
      </div>

      {/* Other Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Account Security</h3>
          <Button variant="secondary" className="w-full">
            Change Password
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Account Status</h3>
          <div className="space-y-2 text-sm mb-4">
            <p>Email Verified: <span className="text-green-600 font-medium">✓ Yes</span></p>
            <p>KYC Status: <span className="text-green-600 font-medium">✓ Verified</span></p>
            <p>Account Standing: <span className="text-green-600 font-medium">✓ Good</span></p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile
