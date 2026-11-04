export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
      <div
        className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-xs font-medium text-neutral-500">{message}</p>
    </div>
  )
}
