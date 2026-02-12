import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useListings } from '../../hooks/useListings'
import { formatCurrency, formatAuctionTime } from '../../utils/formatters'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import { FiArrowRight, FiShoppingCart, FiAward, FiTrendingUp } from 'react-icons/fi'

const Home = () => {
  const { fetchListings, items, loading } = useListings()

  useEffect(() => {
    fetchListings(1, 6, { status: 'active', sortBy: 'newest' })
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
        <div className="container-section text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to AuctionHub</h1>
          <p className="text-xl mb-8 opacity-90">
            Discover, bid, and win exclusive items through transparent auctions
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/listings">
              <Button variant="primary" size="lg">
                Browse Auctions <FiArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-section">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AuctionHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShoppingCart className="w-8 h-8" />,
                title: 'Easy Bidding',
                desc: 'Place bids on thousands of items with just a few clicks'
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: 'Verified Sellers',
                desc: 'All sellers are verified to ensure safe transactions'
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: 'Real-Time Updates',
                desc: 'Get instant notifications on your watched items'
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 bg-gray-50">
        <div className="container-section">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Auctions</h2>
            <Link to="/listings" className="text-blue-600 hover:text-blue-700 font-medium">
              View All <FiArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loading message="Loading auctions..." />
          ) : (
            <div className="grid-responsive">
              {items.map(item => (
                <Link key={item._id} to={`/listings/${item._id}`}>
                  <Card hover>
                    <div className="mb-4 bg-gray-200 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
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
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container-section text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users enjoying transparent auctions
          </p>
          <Link to="/auth/register">
            <Button variant="primary" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
