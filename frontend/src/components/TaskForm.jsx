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

  // Memvalidasi batas input form sebelum mengirim payload ke fungsi onSubmit.
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
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-alert" role="alert">
          <span className="error-dot" aria-hidden="true">•</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor={`${idPrefix}-title`} className="form-label">
          Title <span className="required-star" aria-hidden="true">*</span>
        </label>
        <input
          id={`${idPrefix}-title`}
          type="text"
          className="form-input"
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
        <span className="char-count">{title.length}/120</span>
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-description`} className="form-label">
          Description <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-description`}
          className="form-textarea"
          placeholder="Add any extra context or requirements..."
          value={description}
          maxLength={2000}
          rows={3}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
        <span className="char-count">{description.length}/2000</span>
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-status`} className="form-label">
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className="form-select"
          value={status}
          disabled={isSubmitting}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
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
