import { useState } from 'react'

// Komponen form input terkontrol untuk membuat task baru atau mengedit task yang ada.
export default function TaskForm({
  onSubmit,
  initialData = null,
  isSubmitting = false,
  buttonText = 'Add Task',
  onCancel = null,
  idPrefix = 'task-form',
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState(initialData?.status || 'Todo')
  const [error, setError] = useState('')

  // Memvalidasi input form sebelum mengirim payload ke fungsi onSubmit.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Title cannot be empty.')
      return
    }

    if (trimmedTitle.length > 120) {
      setError('Title must not exceed 120 characters.')
      return
    }

    if (description.length > 2000) {
      setError('Description must not exceed 2000 characters.')
      return
    }

    setError('')
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        status,
      })

      // Kosongkan form jika berhasil membuat task baru.
      if (!initialData) {
        setTitle('')
        setDescription('')
        setStatus('Todo')
      }
    } catch (err) {
      setError(err.message || 'Failed to submit task.')
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-error-bg text-error-text border border-error-border rounded-[10px]"
          role="alert"
        >
          <span className="text-signal-orange text-lg leading-none" aria-hidden="true">•</span>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-title`} className="text-sm font-semibold text-charcoal flex items-center gap-1">
          Title <span className="text-signal-orange" aria-hidden="true">*</span>
        </label>
        <input
          id={`${idPrefix}-title`}
          type="text"
          className="w-full bg-white border border-taupe rounded-xl px-4 py-3 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-3 focus:ring-signal-orange/20 transition disabled:bg-canvas/50"
          placeholder="e.g. Design API specification"
          value={title}
          maxLength={120}
          disabled={isSubmitting}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          required
        />
        <span className="text-[11px] text-slate-custom self-end">{title.length}/120</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-description`} className="text-sm font-semibold text-charcoal flex items-center gap-1">
          Description <span className="text-xs font-normal text-slate-custom">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-description`}
          className="w-full bg-white border border-taupe rounded-xl px-4 py-3 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-3 focus:ring-signal-orange/20 transition resize-y min-h-[80px] disabled:bg-canvas/50"
          placeholder="Add any extra context or requirements..."
          value={description}
          maxLength={2000}
          rows={3}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
        <span className="text-[11px] text-slate-custom self-end">{description.length}/2000</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-status`} className="text-sm font-semibold text-charcoal">
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className="w-full bg-white border border-taupe rounded-xl px-4 py-3 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-3 focus:ring-signal-orange/20 transition disabled:bg-canvas/50 cursor-pointer"
          value={status}
          disabled={isSubmitting}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[15px] font-semibold bg-ink text-canvas border-[1.5px] border-ink hover:bg-charcoal hover:border-charcoal active:scale-[0.98] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[42px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[15px] font-semibold bg-white text-ink border-[1.5px] border-taupe hover:border-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60 min-h-[42px]"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
