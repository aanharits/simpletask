// Komponen UI Toaster mengambang untuk menampilkan feedback sukses maupun error.
export function ToastItem({ toast, onDismiss }) {
  const isSuccess = toast.type === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-[0_16px_40px_rgba(0,0,0,0.28)] animate-slide-down transition-all duration-200 ease-out"
      data-toast-id={toast.id}
    >
      {/* Content Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSuccess
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
            }`}
            aria-hidden="true"
          />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 leading-none">
            {isSuccess ? 'Success' : 'Notice'}
          </h4>
        </div>
        <p className="text-xs font-medium text-neutral-100 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
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
