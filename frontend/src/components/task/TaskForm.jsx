import { useState, useRef, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { DEFAULT_TASK_STATUS, DESCRIPTION_MAX_LENGTH, TASK_STATUSES, TITLE_MAX_LENGTH } from '@/constants/task'

const LABEL_CLASS = 'text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600'
const COUNTER_CLASS = 'text-[10px] sm:text-[11px] font-mono text-neutral-400'
const FIELD_CLASS =
  'w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl shadow-2xs placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-200 ease-out disabled:bg-neutral-50 disabled:text-neutral-400'

// Komponen form input terkontrol untuk membuat task baru atau mengedit task yang ada.
export default function TaskForm({
  onSubmit,
  focusRequest = 0,
  initialData = null,
  isSubmitting = false,
  buttonText = 'Add Task',
  onCancel = null,
  idPrefix = 'task-form',
}) {
  const titleRef = useRef(null)
  useEffect(() => {
    if (focusRequest > 0) {
      titleRef.current?.focus()
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusRequest])

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState(initialData?.status || DEFAULT_TASK_STATUS)
  const [error, setError] = useState('')

  // Memvalidasi input form sebelum mengirim payload ke fungsi onSubmit.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Title cannot be empty.')
      return
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must not exceed ${TITLE_MAX_LENGTH} characters.`)
      return
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setError(`Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`)
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
        setStatus(DEFAULT_TASK_STATUS)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit task.')
    }
  }

  return (
    <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="flex items-center gap-2 p-2.5 sm:p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl animate-slide-down"
          role="alert"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <label htmlFor={`${idPrefix}-title`} className={LABEL_CLASS}>
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <span className={COUNTER_CLASS}>{title.length}/{TITLE_MAX_LENGTH}</span>
        </div>
        <input
          ref={titleRef}
          id={`${idPrefix}-title`}
          type="text"
          className={FIELD_CLASS}
          placeholder="e.g. Design API specification"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          disabled={isSubmitting}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <label htmlFor={`${idPrefix}-description`} className={LABEL_CLASS}>
            Description <span className="text-neutral-400 font-normal lowercase tracking-normal">(optional)</span>
          </label>
          <span className={COUNTER_CLASS}>{description.length}/{DESCRIPTION_MAX_LENGTH}</span>
        </div>
        <textarea
          id={`${idPrefix}-description`}
          className={`${FIELD_CLASS} resize-y min-h-14.5 sm:min-h-18`}
          placeholder="Add any extra context or requirements..."
          value={description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={2}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className={`block mb-1 sm:mb-1.5 ${LABEL_CLASS}`}>
          Status
        </label>
        <select
          id={`${idPrefix}-status`}
          className={`${FIELD_CLASS} font-medium cursor-pointer`}
          value={status}
          disabled={isSubmitting}
          onChange={(e) => setStatus(e.target.value)}
        >
          {TASK_STATUSES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : buttonText}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
