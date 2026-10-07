import './btn-secondary.css'

export function BtnSecondary({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      className={`btn-secondary ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}