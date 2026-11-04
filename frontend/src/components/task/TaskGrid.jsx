import StatusColumnHeader from './StatusColumnHeader'
import TaskCard from './task-card/TaskCard'
import { STATUS_META } from '@/constants/task'

// Grid responsif untuk tab status tunggal (Todo / In Progress / Done), dengan header konsisten seperti kolom Board.
export default function TaskGrid({ status, tasks, onUpdate, onDelete, updatingTaskIds = new Set(), deletingTaskIds = new Set() }) {
  return (
    <div className="flex flex-col bg-column-bg border border-neutral-200/70 rounded-2xl p-3 sm:p-4 transition-all duration-200 ease-out">
      <StatusColumnHeader status={status} count={tasks.length} className="mb-3.5" />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-neutral-300 rounded-xl text-center">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">
            {STATUS_META[status]?.emptyText ?? 'No tasks found'}
          </p>
        </div>
      ) : (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          aria-label={`${status} task grid`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={updatingTaskIds.has(task.id)}
              isDeleting={deletingTaskIds.has(task.id)}
              isDraggable={false}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
