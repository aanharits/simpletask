import useTaskCard from '../hooks/useTaskCard'
import TaskCardBody from './task-card/TaskCardBody'
import TaskCardFooter from './task-card/TaskCardFooter'
import TaskCardEditView from './task-card/TaskCardEditView'
import TaskCardError from './task-card/TaskCardError'

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  isDraggable = true,
}) {
  const {
    isEditing,
    showConfirmDelete,
    itemError,
    selectedStatus,
    handleStatusChange,
    handleEditSubmit,
    handleDelete,
    handleDragStart,
    startEditing,
    cancelEditing,
    promptDelete,
    cancelDelete,
    clearError,
  } = useTaskCard({ task, onUpdate, onDelete, isUpdating, isDraggable })

  if (isEditing) {
    return (
      <TaskCardEditView
        task={task}
        onSubmit={handleEditSubmit}
        onCancel={cancelEditing}
        isUpdating={isUpdating}
      />
    )
  }

  return (
    <li
      className={`bg-white rounded-2xl p-4 shadow-2xs border border-neutral-200/80 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between animate-fade-in ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      data-task-id={task.id}
      draggable={isDraggable && !showConfirmDelete}
      onDragStart={isDraggable ? handleDragStart : undefined}
    >
      <TaskCardError error={itemError} onDismiss={clearError} />

      <TaskCardBody task={task} />

      <TaskCardFooter
        task={task}
        selectedStatus={selectedStatus}
        showConfirmDelete={showConfirmDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onStatusChange={handleStatusChange}
        onStartEdit={startEditing}
        onPromptDelete={promptDelete}
        onConfirmDelete={handleDelete}
        onCancelDelete={cancelDelete}
      />
    </li>
  )
}
