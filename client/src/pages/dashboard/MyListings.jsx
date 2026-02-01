import { useEffect, useState } from 'react'
import { useListings } from '../../hooks/useListings'
import { formatCurrency, formatAuctionTime } from '../../utils/formatters'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Pagination from '../../components/Pagination'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const MyListings = () => {
  const { items, loading, fetchMyListings, deleteListings } = useListings()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchMyListings(currentPage, 10)
  }, [currentPage])

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link to="/dashboard/create-listing">
          <Button variant="primary">
            <FiPlus className="w-5 h-5 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any listings yet</p>
          <Link to="/dashboard/create-listing">
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map(listing => (
              <Card key={listing._id}>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={listing.images?.[0]?.url || 'https://via.placeholder.com/80'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{listing.description.substring(0, 100)}...</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600 font-medium">Current: {formatCurrency(listing.currentBid)}</span>
                      <span className="text-orange-600">Ends: {formatAuctionTime(listing.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm">
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(items.length / 10)}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default MyListings
