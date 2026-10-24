import TaskItem from './TaskItem'

// Komponen daftar tugas yang menampilkan filter pills, grid kartu task, dan empty state.
export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  activeFilter = 'All',
  onFilterChange,
}) {
  const filterOptions = ['All', 'Todo', 'In Progress', 'Done']

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'All') return true
    return task.status === activeFilter
  })

  if (tasks.length === 0) {
    return (
      <div
        className="text-center p-10 sm:p-12 bg-white border border-dashed border-taupe rounded-[18px]"
        role="region"
        aria-label="No tasks"
      >
        <div className="mx-auto mb-4 text-slate-custom flex justify-center" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="11" y2="17"></line>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">No tasks recorded yet</h3>
        <p className="text-sm text-granite max-w-[440px] mx-auto leading-relaxed">
          Get started by filling out the form above to add your first task.
          Your tasks are stored persistently in PostgreSQL.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar with total tasks and filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-custom">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-granite">
            <span className="text-light-orange text-base leading-none" aria-hidden="true">•</span> ALL TASKS
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-canvas text-slate-custom border border-border-custom">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter tasks by status">
          {filterOptions.map((filter) => {
            const count = filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length
            const isSelected = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                className={`inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-canvas border border-ink shadow-xs'
                    : 'bg-white text-granite border border-taupe hover:border-ink hover:text-ink'
                }`}
                onClick={() => onFilterChange(filter)}
                aria-pressed={isSelected}
              >
                <span>{filter}</span>
                <span className={`text-[11px] ${isSelected ? 'text-taupe' : 'opacity-80'}`}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Empty filter state or list of tasks */}
      {filteredTasks.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-[14px] border border-border-custom flex flex-col items-center gap-3 text-granite text-sm">
          <p>No tasks match the filter &ldquo;{activeFilter}&rdquo;.</p>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold bg-white text-ink border border-taupe hover:border-ink transition cursor-pointer"
            onClick={() => onFilterChange('All')}
          >
            Show all tasks
          </button>
        </div>
      ) : (
        <ul className="list-none flex flex-col gap-4" aria-label="Task list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={updatingTaskId === task.id}
              isDeleting={deletingTaskId === task.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
