import { FiAlertCircle } from 'react-icons/fi'
import Button from './Button'

const Error = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div className="flex-center min-h-screen">
      <div className="text-center">
        <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default Error
