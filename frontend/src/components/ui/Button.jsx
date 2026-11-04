// Tombol dasar reusable: satu tempat untuk gaya, ukuran, dan state disabled agar konsisten di seluruh aplikasi.
const BASE =
  'inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

const VARIANTS = {
  primary: 'text-white bg-neutral-900 hover:bg-black shadow-xs',
  secondary: 'text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 shadow-2xs',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-4 py-2 text-xs rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
