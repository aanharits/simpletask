// Kartu task: menghubungkan controller useTaskCard dengan sub-komponen tampilan (body, footer, edit, error).
import useTaskCard from '@/hooks/useTaskCard'
import TaskCardBody from './TaskCardBody'
import TaskCardFooter from './TaskCardFooter'
import TaskCardEditView from './TaskCardEditView'
import TaskCardError from './TaskCardError'

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  isDraggable = true,
}) {
  const canDrag = isDraggable && !isUpdating && !isDeleting
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
  } = useTaskCard({ task, onUpdate, onDelete, isUpdating, isDraggable: canDrag })

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
        canDrag ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      data-task-id={task.id}
      draggable={canDrag && !showConfirmDelete}
      onDragStart={canDrag ? handleDragStart : undefined}
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
