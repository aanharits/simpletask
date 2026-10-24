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
          className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg animate-in fade-in"
          role="alert"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={`${idPrefix}-title`} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">{title.length}/120</span>
        </div>
        <input
          id={`${idPrefix}-title`}
          type="text"
          className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:bg-slate-50 disabled:text-slate-400"
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
          <label htmlFor={`${idPrefix}-description`} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Description <span className="text-slate-400 font-normal lowercase tracking-normal">(optional)</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">{description.length}/2000</span>
        </div>
        <textarea
          id={`${idPrefix}-description`}
          className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-y min-h-[88px] disabled:bg-slate-50 disabled:text-slate-400"
          placeholder="Add any extra context, acceptance criteria, or requirements..."
          value={description}
          maxLength={2000}
          rows={3}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className="w-full px-3.5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          value={status}
          disabled={isSubmitting}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            buttonText
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
