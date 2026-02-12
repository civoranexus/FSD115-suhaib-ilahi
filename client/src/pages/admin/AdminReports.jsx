import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { FiCheck, FiX } from 'react-icons/fi'

const AdminReports = () => {
  const reports = [
    { _id: '1', reason: 'Suspicious Activity', reported: 'John Doe', status: 'open' },
    { _id: '2', reason: 'Inappropriate Content', reported: 'Jane Smith', status: 'resolved' },
    { _id: '3', reason: 'Fraud Attempt', reported: 'Bob Wilson', status: 'open' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports Management</h1>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report._id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{report.reason}</h3>
                <p className="text-gray-600 text-sm">Reported by: {report.reported}</p>
              </div>
              <Badge variant={report.status === 'open' ? 'danger' : 'success'}>
                {report.status}
              </Badge>
              {report.status === 'open' && (
                <div className="flex gap-2">
                  <Button variant="success" size="sm">
                    <FiCheck className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminReports
