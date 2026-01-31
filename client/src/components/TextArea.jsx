import clsx from 'clsx'

const TextArea = ({
  label,
  error,
  helperText,
  className,
  rows = 4,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        disabled={disabled}
        className={clsx(
          'input-field resize-none',
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'bg-gray-100 cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  )
}

export default TextArea
