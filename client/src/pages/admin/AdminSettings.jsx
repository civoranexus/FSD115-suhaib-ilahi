import { useState } from 'react'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformFee: '2.5',
    minListingPrice: '10',
    maxListingPrice: '1000000',
    auctionDuration: '7',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      <Card className="max-w-2xl">
        <h2 className="text-xl font-bold mb-6">Platform Configuration</h2>

        <div className="space-y-4 mb-6">
          <Input
            name="platformFee"
            label="Platform Fee (%)"
            type="number"
            step="0.1"
            value={settings.platformFee}
            onChange={handleChange}
          />

          <Input
            name="minListingPrice"
            label="Minimum Listing Price ($)"
            type="number"
            value={settings.minListingPrice}
            onChange={handleChange}
          />

          <Input
            name="maxListingPrice"
            label="Maximum Listing Price ($)"
            type="number"
            value={settings.maxListingPrice}
            onChange={handleChange}
          />

          <Input
            name="auctionDuration"
            label="Default Auction Duration (days)"
            type="number"
            value={settings.auctionDuration}
            onChange={handleChange}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={loading}
        >
          Save Settings
        </Button>
      </Card>
    </div>
  )
}

export default AdminSettings
