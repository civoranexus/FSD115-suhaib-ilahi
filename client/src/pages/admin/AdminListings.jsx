import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi'

const AdminListings = () => {
  const listings = [
    { _id: '1', title: 'Vintage Camera', status: 'pending', seller: 'John Doe' },
    { _id: '2', title: 'Old Map', status: 'approved', seller: 'Jane Smith' },
    { _id: '3', title: 'Antique Clock', status: 'pending', seller: 'Bob Wilson' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Listings Moderation</h1>

      <div className="space-y-4">
        {listings.map(listing => (
          <Card key={listing._id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Seller: {listing.seller}</p>
                <Badge variant={listing.status === 'approved' ? 'success' : 'warning'}>
                  {listing.status}
                </Badge>
              </div>
              {listing.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="success" size="sm">
                    <FiCheck className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm">
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <Button variant="danger" size="sm">
                <FiTrash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminListings
