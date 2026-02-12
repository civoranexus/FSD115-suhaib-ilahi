import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useListings } from '../../hooks/useListings'
import { useBids } from '../../hooks/useBids'
import { formatCurrency } from '../../utils/formatters'
import Card from '../../components/Card'
import { FiTrendingUp, FiShoppingCart, FiBook, FiHeart, FiDollarSign } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const { items: listings } = useListings()
  const { myBids } = useBids()

  useEffect(() => {
    // Fetch user stats
  }, [])

  const stats = [
    {
      icon: <FiShoppingCart className="w-6 h-6" />,
      title: 'Active Listings',
      value: '12',
      color: 'text-blue-600',
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: 'Active Bids',
      value: '8',
      color: 'text-green-600',
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: 'Watchlist',
      value: '24',
      color: 'text-red-600',
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Total Spent',
      value: formatCurrency(5240),
      color: 'text-purple-600',
    },
  ]

  return (
    <div>
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.firstName}! 👋</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">You placed a bid on "Vintage Camera"</p>
            <p className="text-gray-600 text-sm">Your auction "Old Map" ended</p>
            <p className="text-gray-600 text-sm">You received a message from John Doe</p>
          </div>
          <Link to="/dashboard/bids" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 block">
            View All →
          </Link>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/dashboard/listings" className="block btn-primary text-center py-2 text-sm">
              Create New Listing
            </Link>
            <Link to="/listings" className="block btn-secondary text-center py-2 text-sm">
              Browse Auctions
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
