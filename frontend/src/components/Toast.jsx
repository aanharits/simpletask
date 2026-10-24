// Komponen UI Toaster mengambang untuk menampilkan feedback sukses maupun error.
export function ToastItem({ toast, onDismiss }) {
  const isSuccess = toast.type === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-[0_12px_32px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md animate-slide-down transition-all duration-200 ${
        isSuccess
          ? 'border-emerald-200/90 text-neutral-800'
          : 'border-red-200/90 text-neutral-800'
      }`}
      data-toast-id={toast.id}
    >
      {/* Icon Badge */}
      <div
        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
          isSuccess
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}
        aria-hidden="true"
      >
        {isSuccess ? '✓' : '!'}
      </div>

      {/* Content Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4
          className={`text-xs font-bold leading-none mb-1 ${
            isSuccess ? 'text-emerald-900' : 'text-red-900'
          }`}
        >
          {isSuccess ? 'Success' : 'Notice'}
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed break-words font-medium">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-neutral-700 hover:scale-110 active:scale-95 text-base leading-none p-1 rounded-lg transition-all duration-150 cursor-pointer shrink-0"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

// Container mengambang yang menampung daftar toaster di sudut kanan atas layar.
export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null

  return (
    <div
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
