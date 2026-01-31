import { FiLoader } from 'react-icons/fi'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex-center min-h-screen">
      <div className="text-center">
        <FiLoader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

export default Loading
