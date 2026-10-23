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
      <div className="empty-state-card" role="region" aria-label="No tasks">
        <div className="empty-state-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="11" y2="17"></line>
          </svg>
        </div>
        <h3 className="empty-state-title">No tasks recorded yet</h3>
        <p className="empty-state-description">
          Get started by filling out the form above to add your first task.
          Your tasks are stored persistently in PostgreSQL.
        </p>
      </div>
    )
  }

  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <div className="task-count-info">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot" aria-hidden="true">•</span> ALL TASKS
          </span>
          <span className="tasks-badge">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </div>

        <div className="filter-pill-group" role="group" aria-label="Filter tasks by status">
          {filterOptions.map((filter) => {
            const count = filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length
            const isSelected = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                className={`filter-pill ${isSelected ? 'active' : ''}`}
                onClick={() => onFilterChange(filter)}
                aria-pressed={isSelected}
              >
                <span>{filter}</span>
                <span className="filter-count">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-filter-state">
          <p>No tasks match the filter &ldquo;{activeFilter}&rdquo;.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onFilterChange('All')}
          >
            Show all tasks
          </button>
        </div>
      ) : (
        <ul className="task-grid" aria-label="Task list">
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
