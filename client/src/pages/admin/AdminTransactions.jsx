import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const AdminTransactions = () => {
  const transactions = [
    { _id: '1', user: 'John Doe', amount: 1500, status: 'completed', date: new Date() },
    { _id: '2', user: 'Jane Smith', amount: 2500, status: 'pending', date: new Date() },
    { _id: '3', user: 'Bob Wilson', amount: 800, status: 'failed', date: new Date() },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

      <div className="space-y-4">
        {transactions.map(tx => (
          <Card key={tx._id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{tx.user}</h3>
                <p className="text-gray-600 text-sm">{formatDateTime(tx.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(tx.amount)}</p>
                <Badge variant={
                  tx.status === 'completed' ? 'success' :
                  tx.status === 'pending' ? 'warning' : 'danger'
                }>
                  {tx.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminTransactions
