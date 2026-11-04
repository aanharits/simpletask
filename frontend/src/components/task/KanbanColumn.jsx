import { useState } from 'react'
import StatusColumnHeader from './StatusColumnHeader'
import TaskCard from './task-card/TaskCard'
import Button from '@/components/ui/Button'
import { KANBAN_INITIAL_LIMIT, STATUS_META } from '@/constants/task'

// Kolom Kanban pada tab Board: drop target drag-and-drop, dengan batas jumlah kartu dan tombol expand/collapse.
export default function KanbanColumn({
  status,
  tasks,
  onUpdate,
  onDelete,
  updatingTaskIds = new Set(),
  deletingTaskIds = new Set(),
  isOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  initialLimit = KANBAN_INITIAL_LIMIT,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { title, emptyText } = STATUS_META[status]

  const hasMore = tasks.length > initialLimit
  const visibleTasks = hasMore && !isExpanded ? tasks.slice(0, initialLimit) : tasks
  const hiddenCount = tasks.length - initialLimit

  return (
    <div
      className={`flex flex-col bg-column-bg border rounded-2xl p-3 transition-all duration-200 ease-out ${
        isOver
          ? 'border-neutral-900 bg-neutral-200/80 ring-2 ring-neutral-900/15 scale-[1.01]'
          : 'border-neutral-200/70 hover:border-neutral-300'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <StatusColumnHeader status={status} count={tasks.length} className="mb-2" />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-neutral-300 rounded-xl text-center">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">{emptyText}</p>
          <span className="text-[10px] text-neutral-400">Drag a task here</span>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-3" aria-label={`${title} tasks`}>
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isUpdating={updatingTaskIds.has(task.id)}
                isDeleting={deletingTaskIds.has(task.id)}
                isDraggable={true}
              />
            ))}
          </ul>

          {hasMore && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <span>{isExpanded ? '− Show less' : `+ Show ${hiddenCount} more`}</span>
              <span className="text-[10px] text-neutral-400">({tasks.length} total)</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
