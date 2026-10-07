import './btn-main.css'

export function BtnMain({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      className={`btn-main ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}