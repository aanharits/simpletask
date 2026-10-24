import { useState } from 'react'
import TaskForm from './TaskForm'

const STATUS_BADGE_CONFIG = {
  'Todo': {
    badge: 'bg-status-todo-bg text-status-todo-text border border-status-todo-border',
    dot: 'bg-slate-custom',
  },
  'In Progress': {
    badge: 'bg-status-prog-bg text-status-prog-text border border-status-prog-border',
    dot: 'bg-light-orange',
  },
  'Done': {
    badge: 'bg-status-done-bg text-status-done-text border border-status-done-border',
    dot: 'bg-[#2E7D32]',
  },
}

// Komponen kartu task yang mendukung tampilan detail, quick selector status, dan inline edit.
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
      <li className="bg-lifted border-[1.5px] border-ink rounded-[18px] p-5 sm:p-6 flex flex-col gap-4 shadow-[0_4px_24px_rgba(20,20,19,0.04)]">
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

  const statusConfig = STATUS_BADGE_CONFIG[task.status] || STATUS_BADGE_CONFIG['Todo']

  return (
    <li
      className="bg-white border border-border-custom rounded-[18px] p-5 sm:p-6 flex flex-col gap-4 shadow-[0_4px_24px_rgba(20,20,19,0.04)] hover:border-taupe hover:shadow-[0_6px_20px_rgba(20,20,19,0.05)] transition-all"
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
        <div className="flex items-center justify-between mb-2.5">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full tracking-tight ${statusConfig.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
            {task.status}
          </span>

          <div className="flex items-center">
            <label htmlFor={`quick-status-${task.id}`} className="sr-only">
              Change status for task {task.title}
            </label>
            <select
              id={`quick-status-${task.id}`}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-border-custom text-granite hover:border-ink hover:text-ink focus:outline-none focus:border-ink transition cursor-pointer disabled:opacity-60"
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

        <h3 className="text-lg font-semibold text-ink tracking-tight break-words mb-1.5">
          {task.title}
        </h3>

        {task.description ? (
          <p className="text-sm text-granite leading-relaxed whitespace-pre-wrap break-words">
            {task.description}
          </p>
        ) : (
          <p className="text-sm italic text-slate-custom opacity-80">
            No description provided.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3.5 border-t border-border-custom flex-wrap gap-3">
        <span className="text-xs font-medium text-slate-custom">ID #{task.id}</span>

        <div className="flex items-center gap-2">
          {!showConfirmDelete ? (
            <>
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white text-ink border border-taupe hover:border-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white text-error-text border border-error-border hover:border-error-text hover:bg-error-bg active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Delete task ${task.title}`}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2" role="group" aria-label="Confirm deletion">
              <span className="text-xs font-semibold text-error-text">Delete?</span>
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs font-semibold bg-error-text text-white hover:opacity-90 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white text-ink border border-taupe hover:border-ink active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
