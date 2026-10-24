import { useState } from 'react'
import TaskForm from './TaskForm'

const STATUS_CLASS_MAP = {
  'In Progress': 'status-in-progress',
  'Done': 'status-done',
  'Todo': 'status-todo',
}

// Mengonversi status task menjadi nama class CSS untuk styling warna badge.
function getStatusClass(status) {
  return STATUS_CLASS_MAP[status] || 'status-todo'
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

  // Mengeksekusi penghapusan task 
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
      <li className="task-item task-item-editing">
        <div className="task-item-edit-header">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot" aria-hidden="true">•</span> EDITING TASK #{task.id}
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

  return (
    <li className={`task-item ${getStatusClass(task.status)}`} data-task-id={task.id}>
      {itemError && (
        <div className="item-error-banner" role="alert">
          <span>{itemError}</span>
          <button
            type="button"
            className="btn-dismiss"
            onClick={() => setItemError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="task-item-top">
        <div className="task-status-row">
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            <span className="status-indicator-dot" aria-hidden="true"></span>
            {task.status}
          </span>

          <div className="quick-status-wrapper">
            <label htmlFor={`quick-status-${task.id}`} className="sr-only">
              Change status for task {task.title}
            </label>
            <select
              id={`quick-status-${task.id}`}
              className="quick-status-select"
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

        <h3 className="task-title">{task.title}</h3>

        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : (
          <p className="task-description empty-description">No description provided.</p>
        )}
      </div>

      <div className="task-item-bottom">
        <span className="task-id-tag">ID #{task.id}</span>

        <div className="task-actions">
          {!showConfirmDelete ? (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isUpdating || isDeleting}
                aria-label={`Delete task ${task.title}`}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="delete-confirm-group" role="group" aria-label="Confirm deletion">
              <span className="delete-prompt">Delete?</span>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
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
