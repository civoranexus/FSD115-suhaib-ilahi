import { useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import { FiEdit2, FiTrash2, FiBold } from 'react-icons/fi'

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const users = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', joined: '2024-01-15' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', joined: '2024-02-20' },
    { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'suspended', joined: '2024-03-10' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <Card className="mb-6">
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      <div className="space-y-4">
        {users.map(user => (
          <Card key={user._id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Joined: {user.joined}</span>
                  <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <FiEdit2 className="w-4 h-4" />
                </Button>
                <Button variant="warning" size="sm">
                  <FiBlock className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm">
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminUsers
