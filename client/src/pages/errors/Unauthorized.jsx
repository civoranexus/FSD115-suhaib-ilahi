import { Link } from 'react-router-dom'
import Button from '../../components/Button'

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">401</h1>
        <p className="text-2xl font-semibold text-gray-900 mb-2">Unauthorized Access</p>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Go Home
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="secondary" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
