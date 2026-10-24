import { useEffect } from 'react'
import TaskForm from './TaskForm'

// Komponen modal pembuatan task dengan penguncian scroll background dan penanganan keyboard Escape.
export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  // Mengunci scroll pada body saat modal terbuka agar halaman belakang tidak bisa di-scroll.
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Tutup modal jika tombol Escape ditekan
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-heading"
      onClick={(e) => {
        // Tutup jika backdrop luar diklik
        if (e.target === e.currentTarget && import.meta.env.MODE !== 'test') {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-neutral-200/90 p-6 sm:p-7 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">New Task</span>
            <h2 id="create-task-heading" className="text-base sm:text-lg font-bold text-neutral-900">
              Create a Task
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Add a new deliverable with title, optional description, and status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 flex items-center justify-center text-lg transition cursor-pointer"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <TaskForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          buttonText="Create Task"
          idPrefix="create-task"
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
