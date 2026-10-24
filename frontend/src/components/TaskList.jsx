import TaskItem from './TaskItem'

// Komponen daftar task dengan tampilan baris horizontal minimalist dan empty state.
export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  activeFilter = 'All',
  onFilterChange,
}) {

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'All') return true
    return task.status === activeFilter
  })

  // Empty state global: belum ada task apapun.
  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full min-h-[260px] text-center"
        role="region"
        aria-label="No tasks"
      >
        <div className="mb-3 text-taupe" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="11" y2="17" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-ink mb-1">No tasks recorded yet</h3>
        <p className="text-sm text-granite max-w-[320px] leading-relaxed">
          Click <strong>New Task</strong> in the sidebar to add your first task.
          Tasks are stored persistently in PostgreSQL.
        </p>
      </div>
    )
  }

  // Empty state untuk filter spesifik.
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center gap-3">
        <p className="text-sm text-granite">
          No tasks match the filter &ldquo;{activeFilter}&rdquo;.
        </p>
        <button
          type="button"
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-ink bg-white border border-taupe hover:border-ink transition cursor-pointer"
          onClick={() => onFilterChange('All')}
        >
          Show all tasks
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Task list rows */}
      <ul className="space-y-0" aria-label="Task list">
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isUpdating={updatingTaskId === task.id}
            isDeleting={deletingTaskId === task.id}
            isFirst={index === 0}
            isLast={index === filteredTasks.length - 1}
          />
        ))}
      </ul>
    </div>
  )
}
