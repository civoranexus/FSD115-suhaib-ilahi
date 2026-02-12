import { useEffect } from 'react'
import { useWatchlist } from '../../hooks/useWatchlist'
import { formatCurrency, formatAuctionTime } from '../../utils/formatters'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom'
import { FiTrash2, FiBook } from 'react-icons/fi'

const Watchlist = () => {
  const { items, loading, fetchWatchlist, removeFromWatchlist } = useWatchlist()

  useEffect(() => {
    fetchWatchlist()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Watchlist</h1>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">Your watchlist is empty</p>
          <Link to="/listings" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse auctions and add items to your watchlist
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item._id} to={`/listings/${item._id}`}>
              <Card hover>
                <div className="mb-4 bg-gray-200 rounded-lg h-40 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/300x200'}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-lg font-semibold text-truncate mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm text-truncate-2 mb-4">{item.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Bid</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(item.currentBid)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Time Left</p>
                    <p className="text-sm font-medium text-orange-600">{formatAuctionTime(item.endDate)}</p>
                  </div>
                </div>
                <div className="flex gap-2" onClick={e => e.preventDefault()}>
                  <Button variant="primary" size="sm" className="flex-1">
                    <FiBid className="w-4 h-4 mr-1" />
                    Bid
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromWatchlist(item._id)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
