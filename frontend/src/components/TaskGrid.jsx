import TaskItem from './TaskItem'

// Komponen grid responsif untuk menampilkan task langsung pada tab Todo, In Progress, atau Done.
export default function TaskGrid({
  status,
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
}) {
  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in"
      aria-label={`${status} task grid`}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={updatingTaskId === task.id}
          isDeleting={deletingTaskId === task.id}
          variant="grid"
        />
      ))}
    </ul>
  )
}
