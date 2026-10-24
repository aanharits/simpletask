import { useState } from 'react'
import TaskForm from './TaskForm'

const STATUS_PROGRESS = {
  'Todo': {
    label: '0%',
    badge: 'text-neutral-500 bg-neutral-100 border-neutral-200',
    icon: '○',
  },
  'In Progress': {
    label: '50%',
    badge: 'text-amber-700 bg-amber-50 border-amber-200',
    icon: '◑',
  },
  'Done': {
    label: '100%',
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: '●',
  },
}

// Komponen kartu task dengan gaya Codomo board: title, description, progress ring, avatars, dan actions.
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

  const [selectedStatus, setSelectedStatus] = useState(task.status)

  // Sinkronkan status lokal saat status diubah server atau prop diperbarui.
  if (selectedStatus !== task.status && !isUpdating) {
    setSelectedStatus(task.status)
  }

  // Memperbarui status task saat dropdown status diubah pengguna.
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    if (newStatus === selectedStatus) return

    setSelectedStatus(newStatus)
    setItemError('')
    try {
      await onUpdate(task.id, { status: newStatus })
    } catch (err) {
      setSelectedStatus(task.status)
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

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', String(task.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  if (isEditing) {
    return (
      <li className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-sm animate-pop-in">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" aria-hidden="true" />
          <span>Editing Task #{task.id}</span>
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

  const prog = STATUS_PROGRESS[task.status] || STATUS_PROGRESS['Todo']

  return (
    <li
      className="bg-white rounded-2xl p-4 shadow-2xs border border-neutral-200/80 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-grab active:cursor-grabbing flex flex-col justify-between animate-fade-in"
      data-task-id={task.id}
      draggable={!showConfirmDelete}
      onDragStart={handleDragStart}
    >
      {itemError && (
        <div className="flex items-center justify-between p-2 mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl animate-slide-down" role="alert">
          <span>{itemError}</span>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 font-bold ml-2 hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
            onClick={() => setItemError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div>
        {/* Task Title */}
        <h3 className={`text-sm font-bold leading-snug break-words mb-1 ${task.status === 'Done' ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description ? (
          <p className="text-xs text-neutral-500 leading-relaxed whitespace-pre-wrap break-words line-clamp-2 mb-3">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-neutral-400 italic mb-3">
            No description provided.
          </p>
        )}

        {/* Meta / Date & Status Progress Row (matching reference image) */}
        <div className="flex items-center justify-between gap-2 pt-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>ID #{task.id}</span>
          </div>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border transition-colors duration-150 ${prog.badge}`}>
            <span aria-hidden="true">{prog.icon}</span>
            <span>{prog.label}</span>
          </span>
        </div>
      </div>

      {/* Card Footer: Status selector & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 flex-wrap gap-2">
        <span className="text-[11px] font-mono text-neutral-400">ID #{task.id}</span>

        {/* Actions & Status selector */}
        <div className="flex items-center gap-1.5 ml-auto">
          <div>
            <label htmlFor={`quick-status-${task.id}`} className="sr-only">
              Change status for task {task.title}
            </label>
            <select
              id={`quick-status-${task.id}`}
              className="text-[11px] font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-150 cursor-pointer disabled:opacity-50"
              value={selectedStatus}
              disabled={isUpdating || isDeleting}
              onChange={handleStatusChange}
              title="Quickly change task status"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {!showConfirmDelete ? (
            <>
              <button
                type="button"
                className="px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 active:scale-95 border border-neutral-200 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="px-2 py-1 text-[11px] font-medium text-red-600 hover:text-red-700 bg-red-50/60 hover:bg-red-50 active:scale-95 border border-red-200 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Delete task ${task.title}`}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 animate-pop-in" role="group" aria-label="Confirm deletion">
              <span className="text-[11px] font-semibold text-red-600">Delete?</span>
              <button
                type="button"
                className="px-2 py-0.5 text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-2xs transition-all duration-150 cursor-pointer disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                className="px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-200 active:scale-95 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
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
