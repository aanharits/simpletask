import { useState } from 'react'
import TaskForm from './TaskForm'

const CARD_STYLES = {
  'Todo': {
    container: 'bg-[#F5F2ED] border-[#E3DED7] hover:border-[#D0CAC0]',
    badge: 'bg-status-todo-bg text-status-todo-text border-status-todo-border',
    iconBox: 'border-slate-custom/40 bg-white/80 text-slate-custom',
    checkIcon: null,
  },
  'In Progress': {
    container: 'bg-[#FFF2EA] border-[#FCD7C0] hover:border-[#F5BCA0]',
    badge: 'bg-status-prog-bg text-status-prog-text border-status-prog-border',
    iconBox: 'border-light-orange bg-white/80 text-light-orange',
    checkIcon: '⚡',
  },
  'Done': {
    container: 'bg-[#EEF7F0] border-[#CDE5D2] hover:border-[#B4D7BC]',
    badge: 'bg-status-done-bg text-status-done-text border-status-done-border',
    iconBox: 'border-[#2E7D32] bg-[#2E7D32] text-white',
    checkIcon: '✓',
  },
}

// Komponen kartu task dengan modern minimalist card layout terinspirasi dari referensi desain.
export default function TaskItem({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [itemError, setItemError] = useState('')

  // Memperbarui status task saat dropdown status diubah pengguna.
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    if (newStatus === task.status) return

    setItemError('')
    try {
      await onUpdate(task.id, { status: newStatus })
    } catch (err) {
      setItemError(err.message || 'Failed to update status.')
    }
  }

  // Menyimpan perubahan title, description, atau status dari form edit inline.
  const handleEditSubmit = async (formData) => {
    setItemError('')
    try {
      await onUpdate(task.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      })
      setIsEditing(false)
    } catch (err) {
      setItemError(err.message || 'Failed to update task.')
      throw err
    }
  }

  // Mengeksekusi penghapusan task dengan konfirmasi keamanan dua langkah.
  const handleDelete = async () => {
    setItemError('')
    try {
      await onDelete(task.id)
    } catch (err) {
      setItemError(err.message || 'Failed to delete task.')
      setShowConfirmDelete(false)
    }
  }

  if (isEditing) {
    return (
      <li className="bg-lifted border-[1.5px] border-ink rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-[0_4px_24px_rgba(20,20,19,0.04)]">
        <div className="pb-3 border-b border-border-custom">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-granite">
            <span className="text-light-orange text-base leading-none" aria-hidden="true">•</span> EDITING TASK #{task.id}
          </span>
        </div>
        <TaskForm
          initialData={task}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditing(false)
            setItemError('')
          }}
          isSubmitting={isUpdating}
          buttonText="Save Changes"
          idPrefix={`task-${task.id}-edit`}
        />
      </li>
    )
  }

  const cardConfig = CARD_STYLES[task.status] || CARD_STYLES['Todo']

  return (
    <li
      className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-[0_2px_8px_rgba(20,20,19,0.03)] hover:shadow-md ${cardConfig.container}`}
      data-task-id={task.id}
    >
      {itemError && (
        <div className="flex items-center justify-between px-3 py-2 text-xs font-medium bg-error-bg text-error-text border border-error-border rounded-lg" role="alert">
          <span>{itemError}</span>
          <button
            type="button"
            className="text-lg leading-none cursor-pointer opacity-70 hover:opacity-100 ml-2"
            onClick={() => setItemError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div>
        {/* Card Header: Checkbox indicator, Title, and Actions */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Soft Checkbox Icon */}
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${cardConfig.iconBox}`}
              aria-hidden="true"
            >
              {cardConfig.checkIcon}
            </div>

            <h3
              className={`text-base font-bold tracking-tight break-words ${
                task.status === 'Done' ? 'text-slate-custom line-through' : 'text-ink'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!showConfirmDelete ? (
              <>
                <button
                  type="button"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-ink border border-taupe hover:border-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdating || isDeleting}
                  aria-label={`Edit task ${task.title}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-error-text border border-error-border hover:border-error-text hover:bg-error-bg active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isUpdating || isDeleting}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5" role="group" aria-label="Confirm deletion">
                <span className="text-xs font-semibold text-error-text">Delete?</span>
                <button
                  type="button"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-text text-white hover:opacity-90 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-ink border border-taupe hover:border-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Description */}
        {task.description ? (
          <p className="text-xs sm:text-sm text-granite leading-relaxed whitespace-pre-wrap break-words pl-[30px] line-clamp-3">
            {task.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-custom opacity-70 pl-[30px]">
            No description provided.
          </p>
        )}
      </div>

      {/* Card Footer: Task ID and Quick Status Selector */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5 flex-wrap gap-2 text-xs">
        <span className="font-mono text-slate-custom text-[11px]">ID #{task.id}</span>

        <div className="flex items-center gap-2">
          <label htmlFor={`quick-status-${task.id}`} className="sr-only">
            Change status for task {task.title}
          </label>
          <select
            id={`quick-status-${task.id}`}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 hover:bg-white border border-border-custom text-charcoal hover:border-ink hover:text-ink focus:outline-none focus:border-ink transition cursor-pointer disabled:opacity-60 shadow-2xs"
            value={task.status}
            disabled={isUpdating || isDeleting}
            onChange={handleStatusChange}
            title="Quickly change task status"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
    </li>
  )
}
