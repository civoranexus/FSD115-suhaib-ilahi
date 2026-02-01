import Card from '../../components/Card'
import { FiTarget, FiShield, FiHeart } from 'react-icons/fi'

const About = () => {
  return (
    <div className="container-section">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About AuctionHub</h1>
          <p className="text-xl text-gray-600">
            Your trusted platform for transparent and secure online auctions
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <FiTarget className="w-8 h-8" />,
              title: 'Our Mission',
              desc: 'To provide a transparent, secure, and accessible auction platform where buyers and sellers can connect globally.'
            },
            {
              icon: <FiShield className="w-8 h-8" />,
              title: 'Our Values',
              desc: 'Trust, transparency, and security are at the core of everything we do. We protect both buyers and sellers.'
            },
            {
              icon: <FiHeart className="w-8 h-8" />,
              title: 'Our Commitment',
              desc: 'We are committed to building a community where everyone can bid with confidence and pride.'
            },
          ].map((item, idx) => (
            <Card key={idx}>
              <div className="text-blue-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Story */}
        <Card className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            AuctionHub was founded in 2024 with a simple mission: to revolutionize online auctions by making them transparent, secure, and accessible to everyone.
          </p>
          <p className="text-gray-700">
            Today, we connect thousands of buyers and sellers across the globe, providing a trusted platform for buying and selling rare items, collectibles, and more.
          </p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Listings', value: '50K+' },
            { label: 'Users', value: '100K+' },
            { label: 'Auctions Completed', value: '500K+' },
            { label: 'Trust Score', value: '4.9/5' },
          ].map((stat, idx) => (
            <Card key={idx} className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
