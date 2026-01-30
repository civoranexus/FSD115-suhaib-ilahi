import clsx from 'clsx'

const Badge = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }

  return (
    <span className={clsx(variants[variant], className)}>
      {children}
    </span>
  )
}

export default Badge
