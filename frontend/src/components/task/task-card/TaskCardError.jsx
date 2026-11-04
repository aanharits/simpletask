// Komponen banner error lokal pada kartu task jika operasi gagal.
export default function TaskCardError({ error, onDismiss }) {
  if (!error) return null

  return (
    <div
      className="flex items-center justify-between p-2 mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl animate-slide-down"
      role="alert"
    >
      <span>{error}</span>
      <button
        type="button"
        className="text-red-500 hover:text-red-700 font-bold ml-2 hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  )
}
