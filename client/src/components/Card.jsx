import clsx from 'clsx'

const Card = ({ children, className, hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        hover ? 'card-hover' : 'card',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
