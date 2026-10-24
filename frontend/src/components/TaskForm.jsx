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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 text-sm bg-error-bg text-error-text border border-error-border rounded-lg"
          role="alert"
        >
          <span className="text-signal-orange" aria-hidden="true">•</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={`${idPrefix}-title`} className="text-xs font-semibold uppercase tracking-wider text-granite">
            Title <span className="text-signal-orange" aria-hidden="true">*</span>
          </label>
          <span className="text-[10px] font-mono text-taupe">{title.length}/120</span>
        </div>
        <input
          id={`${idPrefix}-title`}
          type="text"
          className="w-full bg-white border border-taupe rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-taupe focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition disabled:bg-canvas/50"
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
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={`${idPrefix}-description`} className="text-xs font-semibold uppercase tracking-wider text-granite">
            Description <span className="text-xs font-normal normal-case tracking-normal text-taupe">(optional)</span>
          </label>
          <span className="text-[10px] font-mono text-taupe">{description.length}/2000</span>
        </div>
        <textarea
          id={`${idPrefix}-description`}
          className="w-full bg-white border border-taupe rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-taupe focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition resize-y min-h-[72px] disabled:bg-canvas/50"
          placeholder="Add any extra context or requirements..."
          value={description}
          maxLength={2000}
          rows={2}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-status`} className="text-xs font-semibold uppercase tracking-wider text-granite">
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className="w-full bg-white border border-taupe rounded-lg px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition disabled:bg-canvas/50 cursor-pointer"
          value={status}
          disabled={isSubmitting}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="submit"
          className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold bg-ink text-canvas border border-ink hover:bg-charcoal active:scale-[0.98] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-granite bg-white border border-taupe hover:border-ink hover:text-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
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
