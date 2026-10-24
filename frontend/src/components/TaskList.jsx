import { useState } from 'react'
import TaskItem from './TaskItem'

const KANBAN_COLUMNS = [
  {
    id: 'Todo',
    title: 'Todo',
    accentDot: 'bg-slate-400',
    headerBadge: 'bg-slate-200/70 text-slate-700',
    topBorder: 'border-t-slate-400',
    emptyText: 'No tasks to do',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    accentDot: 'bg-blue-500 animate-pulse',
    headerBadge: 'bg-blue-100 text-blue-700',
    topBorder: 'border-t-blue-500',
    emptyText: 'Nothing in progress',
  },
  {
    id: 'Done',
    title: 'Done',
    accentDot: 'bg-emerald-500',
    headerBadge: 'bg-emerald-100 text-emerald-700',
    topBorder: 'border-t-emerald-500',
    emptyText: 'No completed tasks yet',
  },
]

// Komponen Kanban Board responsif dengan drag-and-drop dan filter status.
export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  activeFilter = 'All',
  onFilterChange,
}) {
  const [dragOverCol, setDragOverCol] = useState(null)
  const filterOptions = ['All', 'Todo', 'In Progress', 'Done']

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'All') return true
    return task.status === activeFilter
  })

  // Tampilkan empty state global jika belum ada task sama sekali.
  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-10 bg-slate-50/70 border border-slate-200/80 rounded-2xl"
        role="region"
        aria-label="No tasks"
      >
        <div
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 mb-3 shadow-2xs"
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="11" y2="17" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No tasks recorded yet</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Get started by filling out the form above to add your first task.
          Your tasks are stored persistently in PostgreSQL.
        </p>
      </div>
    )
  }

  // Tentukan kolom yang akan ditampilkan berdasarkan filter yang dipilih.
  const visibleColumns = activeFilter === 'All'
    ? KANBAN_COLUMNS
    : KANBAN_COLUMNS.filter((col) => col.id === activeFilter)

  return (
    <div className="space-y-5">
      {/* Top Filter & Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" aria-hidden="true" />
            Kanban Board
          </span>
          <span className="text-xs font-medium text-slate-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Filter Pill Group */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter tasks by status">
          {filterOptions.map((filter) => {
            const count = filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length
            const isSelected = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                }`}
                onClick={() => onFilterChange(filter)}
                aria-pressed={isSelected}
              >
                <span>{filter}</span>
                <span className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tampilan jika tidak ada task yang cocok dengan filter spesifik */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
          <p className="text-sm text-slate-600 mb-3">
            No tasks match the filter &ldquo;{activeFilter}&rdquo;.
          </p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition cursor-pointer"
            onClick={() => onFilterChange('All')}
          >
            Show all tasks
          </button>
        </div>
      ) : (
        /* Kanban Columns Grid / Responsive Columns */
        <div
          className={`grid gap-5 items-start ${
            visibleColumns.length === 1
              ? 'grid-cols-1 max-w-xl mx-auto'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {visibleColumns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id)
            const isOver = dragOverCol === col.id

            return (
              <div
                key={col.id}
                className={`flex flex-col bg-slate-50/80 border rounded-2xl p-3.5 transition-all duration-200 border-t-4 ${col.topBorder} ${
                  isOver
                    ? 'border-indigo-400 bg-indigo-50/30 ring-2 ring-indigo-400/40'
                    : 'border-slate-200/80 shadow-2xs'
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  if (dragOverCol !== col.id) setDragOverCol(col.id)
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setDragOverCol(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOverCol(null)
                  const idStr = e.dataTransfer.getData('text/plain')
                  const taskId = Number(idStr)
                  if (taskId && !isNaN(taskId)) {
                    onUpdate(taskId, { status: col.id })
                  }
                }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.accentDot}`} aria-hidden="true" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.headerBadge}`}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Tasks List / Dropzone */}
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-3 border-2 border-dashed border-slate-200/90 rounded-xl text-center">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">{col.emptyText}</p>
                    <span className="text-[10px] text-slate-400">Drag a task here</span>
                  </div>
                ) : (
                  <ul className="space-y-3" aria-label={`${col.title} tasks`}>
                    {columnTasks.map((task) => (
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
          })}
        </div>
      )}
    </div>
  )
}
