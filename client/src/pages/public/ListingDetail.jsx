import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useListings } from '../../hooks/useListings'
import { useBids } from '../../hooks/useBids'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatDateTime, formatAuctionTime } from '../../utils/formatters'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { FiHeart, FiShare2, FiUser, FiCalendar, FiBox } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { selectedListing, loading, fetchListingById } = useListings()
  const { placeBid, myBids, loading: bidLoading } = useBids()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [bidAmount, setBidAmount] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchListingById(id)
  }, [id])

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place a bid')
      navigate('/auth/login')
      return
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount')
      return
    }

    try {
      const result = await placeBid(id, Number(bidAmount))
      if (!result.payload?.error) {
        toast.success('Bid placed successfully!')
        setBidAmount('')
      } else {
        toast.error(result.payload)
      }
    } catch (err) {
      toast.error('Failed to place bid')
    }
  }

  const handleWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to watchlist')
      navigate('/auth/login')
      return
    }

    try {
      if (isInWatchlist(id)) {
        await removeFromWatchlist(id)
        toast.success('Removed from watchlist')
      } else {
        await addToWatchlist(id)
        toast.success('Added to watchlist')
      }
    } catch (err) {
      toast.error('Failed to update watchlist')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!selectedListing) return <Error message="Listing not found" />

  const images = selectedListing.images || []
  const currentImage = images[currentImageIndex]

  return (
    <div className="container-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-2">
          <Card>
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
              <img
                src={currentImage?.url || 'https://via.placeholder.com/600x400'}
                alt={selectedListing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      idx === currentImageIndex ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Details & Bid */}
        <div>
          {/* Status */}
          <Badge variant={selectedListing.status === 'active' ? 'success' : 'warning'} className="mb-4">
            {selectedListing.status === 'active' ? 'Active' : 'Ended'}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{selectedListing.title}</h1>

          {/* Pricing */}
          <Card className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Starting Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedListing.startingPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(selectedListing.currentBid)}
                </p>
              </div>
            </div>
          </Card>

          {/* Time Left */}
          <Card className="mb-6 bg-orange-50 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatAuctionTime(selectedListing.endDate)}
            </p>
          </Card>

          {/* Bid Input */}
          {selectedListing.status === 'active' && (
            <Card className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Minimum Bid: {formatCurrency(selectedListing.currentBid + 100)}</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`${selectedListing.currentBid + 100}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={handlePlaceBid}
                  loading={bidLoading}
                >
                  Bid
                </Button>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={isInWatchlist(id) ? 'danger' : 'outline'}
              className="flex-1"
              onClick={handleWatchlist}
            >
              <FiHeart className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="flex-1">
              <FiShare2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Seller Info */}
          <Card className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {selectedListing.seller?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{selectedListing.seller?.name}</p>
                <p className="text-sm text-gray-600">⭐ 4.8 (320 reviews)</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Contact Seller
            </Button>
          </Card>

          {/* Info */}
          <Card>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FiBox className="w-4 h-4" />
                <span>Condition: <strong>{selectedListing.condition}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="w-4 h-4" />
                <span>Ends: <strong>{formatDateTime(selectedListing.endDate)}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiUser className="w-4 h-4" />
                <span>Total Bids: <strong>{selectedListing.totalBids || 0}</strong></span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {selectedListing.description}
          </p>
        </Card>
      </div>
    </div>
  )
}

export default ListingDetail
