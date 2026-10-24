import { useState } from 'react'
import TaskForm from './TaskForm'

const STATUS_BADGE_STYLES = {
  'Todo': 'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Done': 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const STATUS_DOT_STYLES = {
  'Todo': 'bg-slate-400',
  'In Progress': 'bg-blue-500 animate-pulse',
  'Done': 'bg-emerald-500',
}

// Komponen kartu task yang mendukung drag-and-drop, quick status selector, dan inline edit.
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

  // Sinkronkan status lokal saat task.status diperbarui oleh server.
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

  // Menangani drag start untuk kanban board drag-and-drop.
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', String(task.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  if (isEditing) {
    return (
      <li className="bg-white rounded-xl border-2 border-indigo-500/30 p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
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

  const badgeStyle = STATUS_BADGE_STYLES[task.status] || STATUS_BADGE_STYLES['Todo']
  const dotStyle = STATUS_DOT_STYLES[task.status] || STATUS_DOT_STYLES['Todo']

  return (
    <li
      className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-4 flex flex-col justify-between group cursor-grab active:cursor-grabbing"
      data-task-id={task.id}
      draggable={!showConfirmDelete}
      onDragStart={handleDragStart}
    >
      {itemError && (
        <div className="flex items-center justify-between p-2 mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
          <span>{itemError}</span>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
            onClick={() => setItemError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div>
        {/* Status header & quick selector */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${badgeStyle}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} aria-hidden="true" />
            {task.status}
          </span>

          <div>
            <label htmlFor={`quick-status-${task.id}`} className="sr-only">
              Change status for task {task.title}
            </label>
            <select
              id={`quick-status-${task.id}`}
              className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-50"
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
        </div>

        {/* Task Title */}
        <h3 className={`text-sm font-semibold leading-snug break-words ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description ? (
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-4">
            {task.description}
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-400 italic">No description provided.</p>
        )}
      </div>

      {/* Card Footer: Task ID and Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <span className="text-[11px] font-mono text-slate-400">ID #{task.id}</span>

        <div className="flex items-center gap-1.5">
          {!showConfirmDelete ? (
            <>
              <button
                type="button"
                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer disabled:opacity-50"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-200 rounded-md transition cursor-pointer disabled:opacity-50"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Delete task ${task.title}`}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5" role="group" aria-label="Confirm deletion">
              <span className="text-xs font-medium text-red-600">Delete?</span>
              <button
                type="button"
                className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-2xs transition cursor-pointer disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md transition cursor-pointer disabled:opacity-50"
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
