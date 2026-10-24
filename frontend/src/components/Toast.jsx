// Komponen UI Toaster mengambang untuk menampilkan feedback sukses maupun error.
export function ToastItem({ toast, onDismiss }) {
  const isSuccess = toast.type === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.08)] animate-slide-down transition-all duration-200 ease-out"
      data-toast-id={toast.id}
    >
      {/* Icon Badge - selaras dengan logo Simple Task */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
          isSuccess
            ? 'bg-neutral-900 text-white'
            : 'bg-red-600 text-white'
        }`}
        aria-hidden="true"
      >
        {isSuccess ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="text-xs font-bold leading-none">!</span>
        )}
      </div>

      {/* Content Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSuccess ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            aria-hidden="true"
          />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-none">
            {isSuccess ? 'Success' : 'Notice'}
          </h4>
        </div>
        <p className="text-xs font-semibold text-neutral-900 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 active:scale-95 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
        aria-label="Dismiss notification"
      >
        <span className="text-base leading-none">×</span>
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
