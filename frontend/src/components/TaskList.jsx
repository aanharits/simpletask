import TaskItem from './TaskItem'

// Komponen daftar tugas dalam bentuk modern grid dengan filter segmented tabs.
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
        className="text-center p-10 sm:p-14 bg-white border border-dashed border-taupe rounded-2xl"
        role="region"
        aria-label="No tasks"
      >
        <div className="mx-auto mb-4 text-slate-custom flex justify-center" aria-hidden="true">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="11" y2="17" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-ink mb-1.5">No tasks recorded yet</h3>
        <p className="text-sm text-granite max-w-[420px] mx-auto leading-relaxed">
          Get started by filling out the form above to add your first task.
          Your tasks are stored persistently in PostgreSQL.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Segmented Filter Bar matching the reference tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="inline-flex p-1 bg-[#EBE7E3] rounded-xl gap-1 overflow-x-auto self-start" role="group" aria-label="Filter tasks by status">
          {filterOptions.map((filter) => {
            const count = filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length
            const isSelected = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-ink shadow-[0_2px_8px_rgba(20,20,19,0.06)]'
                    : 'text-granite hover:text-ink hover:bg-white/40'
                }`}
                onClick={() => onFilterChange(filter)}
                aria-pressed={isSelected}
              >
                <span>{filter}</span>
                <span className={`text-[11px] ${isSelected ? 'text-slate-custom' : 'text-taupe'}`}>({count})</span>
              </button>
            )
          })}
        </div>

        <span className="text-xs font-semibold text-slate-custom self-end sm:self-center">
          Showing {filteredTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Empty filter state or 3-column modern cards grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-2xl border border-border-custom flex flex-col items-center gap-3 text-granite text-sm">
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
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0" aria-label="Task list">
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
