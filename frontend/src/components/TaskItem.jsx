import { useState } from 'react'
import TaskForm from './TaskForm'

const STATUS_DOT = {
  'Todo':        'bg-taupe',
  'In Progress': 'bg-light-orange',
  'Done':        'bg-[#2E7D32]',
}

const STATUS_BADGE = {
  'Todo':        'bg-status-todo-bg text-status-todo-text border border-status-todo-border',
  'In Progress': 'bg-status-prog-bg text-status-prog-text border border-status-prog-border',
  'Done':        'bg-status-done-bg text-status-done-text border border-status-done-border',
}

// Komponen baris task minimalist dengan inline edit dan konfirmasi hapus dua langkah.
export default function TaskItem({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  isFirst = false,
  isLast = false,
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

  // Menyimpan perubahan dari form edit inline.
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

  // Mengeksekusi penghapusan task setelah konfirmasi.
  const handleDelete = async () => {
    setItemError('')
    try {
      await onDelete(task.id)
    } catch (err) {
      setItemError(err.message || 'Failed to delete task.')
      setShowConfirmDelete(false)
    }
  }

  // Mode edit — tampilkan form inline dalam baris.
  if (isEditing) {
    return (
      <li
        className={`bg-canvas/60 border border-border-custom px-5 py-5 ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}
        data-task-id={task.id}
      >
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-granite">
          <span className="text-light-orange text-sm leading-none" aria-hidden="true">•</span>
          Editing Task #{task.id}
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

  const dotStyle = STATUS_DOT[task.status] || STATUS_DOT['Todo']
  const badgeStyle = STATUS_BADGE[task.status] || STATUS_BADGE['Todo']

  return (
    <li
      className={`
        group relative flex items-start gap-4 px-5 py-4 bg-lifted
        border-b border-border-custom/60 last:border-b-0
        hover:bg-canvas/70 transition-colors
        ${isFirst ? 'rounded-t-xl border-t border-border-custom/60' : ''}
        ${isLast ? 'rounded-b-xl' : ''}
      `}
      data-task-id={task.id}
    >
      {/* Status indicator circle */}
      <div className="flex items-center pt-0.5 shrink-0">
        <label htmlFor={`quick-status-${task.id}`} className="sr-only">
          Change status for task {task.title}
        </label>
        <div className="relative">
          <div
            className={`w-4 h-4 rounded-full border-2 border-border-custom flex items-center justify-center cursor-pointer transition-all ${
              task.status === 'Done' ? 'bg-status-done-bg border-[#2E7D32]' : 'bg-white hover:border-taupe'
            }`}
            aria-hidden="true"
          >
            {task.status === 'Done' && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <select
            id={`quick-status-${task.id}`}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        {itemError && (
          <div className="flex items-center justify-between mb-2 px-2.5 py-1.5 rounded-lg text-xs bg-error-bg text-error-text border border-error-border" role="alert">
            <span>{itemError}</span>
            <button
              type="button"
              className="ml-2 opacity-70 hover:opacity-100 cursor-pointer"
              onClick={() => setItemError('')}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold leading-snug tracking-tight break-words ${
                task.status === 'Done' ? 'text-slate-custom line-through' : 'text-ink'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-0.5 text-xs text-granite leading-relaxed line-clamp-2 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions — revealed on hover, always visible on mobile */}
          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {/* Status badge */}
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}>
              <span className={`w-1 h-1 rounded-full ${dotStyle}`} aria-hidden="true" />
              {task.status}
            </span>

            <span className="text-border-custom text-xs hidden sm:block">|</span>

            {!showConfirmDelete ? (
              <>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-granite hover:text-ink hover:bg-canvas transition cursor-pointer disabled:opacity-50"
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdating || isDeleting}
                  aria-label={`Edit task ${task.title}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-error-text/70 hover:text-error-text hover:bg-error-bg transition cursor-pointer disabled:opacity-50"
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isUpdating || isDeleting}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1" role="group" aria-label="Confirm deletion">
                <span className="text-[11px] font-semibold text-error-text">Delete?</span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-error-text text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-granite hover:text-ink hover:bg-canvas transition cursor-pointer disabled:opacity-50"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-1.5">
          {/* Status badge — mobile (always visible) */}
          <span className={`sm:hidden inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}>
            <span className={`w-1 h-1 rounded-full ${dotStyle}`} aria-hidden="true" />
            {task.status}
          </span>
          <span className="text-[11px] text-taupe font-mono">#{task.id}</span>
        </div>
      </div>
    </li>
  )
}
