// Blok informasi terpusat untuk kondisi kosong maupun error (ikon, judul, deskripsi, dan aksi opsional).
const TONES = {
  neutral: {
    title: 'text-base font-bold text-neutral-900',
    description: 'text-xs text-neutral-500',
  },
  danger: {
    title: 'text-sm font-bold text-red-900',
    description: 'text-xs text-red-600',
  },
}

export default function EmptyState({
  icon = null,
  title,
  description,
  action = null,
  tone = 'neutral',
  className = '',
  ...props
}) {
  const styles = TONES[tone]

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`.trim()} {...props}>
      {icon}
      {title && <h3 className={`${styles.title} mb-1`}>{title}</h3>}
      {description && (
        <p className={`${styles.description} max-w-md leading-relaxed`}>{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
