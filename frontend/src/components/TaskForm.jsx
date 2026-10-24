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
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="flex items-center gap-2 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl animate-slide-down"
          role="alert"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={`${idPrefix}-title`} className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <span className="text-[11px] font-mono text-neutral-400">{title.length}/120</span>
        </div>
        <input
          id={`${idPrefix}-title`}
          type="text"
          className="w-full px-3.5 py-2 text-sm text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl shadow-2xs placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-200 ease-out disabled:bg-neutral-50 disabled:text-neutral-400"
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

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={`${idPrefix}-description`} className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Description <span className="text-neutral-400 font-normal lowercase tracking-normal">(optional)</span>
          </label>
          <span className="text-[11px] font-mono text-neutral-400">{description.length}/2000</span>
        </div>
        <textarea
          id={`${idPrefix}-description`}
          className="w-full px-3.5 py-2 text-sm text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl shadow-2xs placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-200 ease-out resize-y min-h-[72px] disabled:bg-neutral-50 disabled:text-neutral-400"
          placeholder="Add any extra context or requirements..."
          value={description}
          maxLength={2000}
          rows={2}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className="w-full px-3.5 py-2 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-200 ease-out disabled:bg-neutral-50 cursor-pointer"
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
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-black active:scale-95 rounded-xl shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200 rounded-xl shadow-2xs transition-all duration-150 cursor-pointer disabled:opacity-50"
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
