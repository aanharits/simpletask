import { useState } from 'react'
import TaskCard from './TaskCard'

// Komponen kolom Kanban pada tab Board dengan batasan maksimal 3 data dan kemampuan expand/collapse.
export default function KanbanColumn({
  col,
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  isOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  initialLimit = 3,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Batasi data yang tampil maksimal 3 jika belum di-expand
  const hasMore = tasks.length > initialLimit
  const displayedTasks = hasMore && !isExpanded ? tasks.slice(0, initialLimit) : tasks
  const hiddenCount = tasks.length - initialLimit

  return (
    <div
      className={`flex flex-col bg-[#EBE9E6] border rounded-2xl p-3 transition-all duration-200 ease-out ${
        isOver
          ? 'border-neutral-900 bg-neutral-200/80 ring-2 ring-neutral-900/15 scale-[1.01]'
          : 'border-neutral-200/70 hover:border-neutral-300'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Column Header: Icon + Title + Count */}
      <div className="flex items-center px-1 pb-3 mb-2 border-b border-neutral-200/60">
        <div className="flex items-center gap-2">
          {col.icon}
          <h3 className="text-xs font-bold text-neutral-800">
            {col.title}
          </h3>
          <span className="text-[11px] font-semibold text-neutral-400">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task Cards List / Empty State */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-neutral-300 rounded-xl text-center">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">{col.emptyText}</p>
          <span className="text-[10px] text-neutral-400">Drag a task here</span>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-3" aria-label={`${col.title} tasks`}>
            {displayedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isUpdating={updatingTaskId === task.id}
                isDeleting={deletingTaskId === task.id}
                isDraggable={true}
              />
            ))}
          </ul>

          {/* Expand / Collapse Button jika data melebihi 3 */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 active:scale-[0.98] border border-neutral-200/90 hover:border-neutral-300 rounded-xl shadow-2xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isExpanded ? '− Show less' : `+ Show ${hiddenCount} more`}</span>
              <span className="text-[10px] text-neutral-400">({tasks.length} total)</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
