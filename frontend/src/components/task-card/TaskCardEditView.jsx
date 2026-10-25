import TaskForm from '../TaskForm'

// Komponen tampilan inline edit saat task sedang disunting.
export default function TaskCardEditView({
  task,
  onSubmit,
  onCancel,
  isUpdating = false,
}) {
  return (
    <li className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-sm animate-pop-in">
      <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" aria-hidden="true" />
        <span>Editing Task #{task.id}</span>
      </div>
      <TaskForm
        initialData={task}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isUpdating}
        buttonText="Save Changes"
        idPrefix={`task-${task.id}-edit`}
      />
    </li>
  )
}
