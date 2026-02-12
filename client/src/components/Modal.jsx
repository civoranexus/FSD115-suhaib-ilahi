import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../redux/slices/uiSlice'
import { FiX } from 'react-icons/fi'

const Modal = ({ children, title, onClose }) => {
  const dispatch = useDispatch()
  const modal = useSelector(state => state.ui.modal)

  if (!modal.isOpen) return null

  const handleClose = () => {
    dispatch(closeModal())
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="backdrop" onClick={handleClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
