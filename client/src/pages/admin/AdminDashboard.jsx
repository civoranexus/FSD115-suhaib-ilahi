import Card from '../../components/Card'
import { FiUsers, FiShoppingCart, FiDollarSign, FiAlertCircle } from 'react-icons/fi'

const AdminDashboard = () => {
  const stats = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Total Users',
      value: '12,543',
      change: '+2.5%',
    },
    {
      icon: <FiShoppingCart className="w-8 h-8" />,
      title: 'Active Listings',
      value: '8,234',
      change: '+1.2%',
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: 'Total Revenue',
      value: '$524,230',
      change: '+5.4%',
    },
    {
      icon: <FiAlertCircle className="w-8 h-8" />,
      title: 'Pending Reports',
      value: '24',
      change: '-3.2%',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className="text-blue-600 mb-4">{stat.icon}</div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">New user registration from John Doe</p>
            <p className="text-gray-600">Payment of $5000 processed</p>
            <p className="text-gray-600">New report filed for suspicious activity</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">System Health</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Server Status</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">95% uptime</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
