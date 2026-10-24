import { useState } from 'react'
import TaskItem from './TaskItem'

const KANBAN_COLUMNS = [
  {
    id: 'Todo',
    title: 'Todo',
    badgeText: 'Todo',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    emptyText: 'No tasks to do',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    badgeText: 'In Progress',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
    emptyText: 'Nothing in progress',
  },
  {
    id: 'Done',
    title: 'Done',
    badgeText: 'Done',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    emptyText: 'No completed tasks',
  },
]

// Komponen board layout yang terinspirasi dari Codomo: columns, dropzones, view tabs, dan empty states.
export default function TaskList({
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  activeFilter = 'All',
  onFilterChange,
  onOpenCreate = null,
}) {
  const [dragOverCol, setDragOverCol] = useState(null)
  const filterOptions = ['All', 'Todo', 'In Progress', 'Done']

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'All') return true
    return task.status === activeFilter
  })

  // Tampilkan empty state global jika belum ada data task (centered, modern, dan eye-catching)
  if (tasks.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[460px] w-full py-12 px-4"
        role="region"
        aria-label="No tasks"
      >
        <div className="max-w-md w-full bg-[#FAF9F7] border border-neutral-200/90 rounded-[28px] p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
          {/* Eye-catching icon badge */}
          <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center text-neutral-800 mb-4" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M9 16l2 2 4-4" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2">No tasks recorded yet</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed mb-6">
            Stay organized and keep deliverables on track. Create your first task to start managing your workflow.
          </p>

          {onOpenCreate && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
              onClick={onOpenCreate}
            >
              <span className="text-base leading-none">+</span>
              <span>Add First Task</span>
            </button>
          )}

          {/* Workflow preview pills (fulfills visual hierarchy) */}
          <div className="flex items-center gap-2 pt-6 mt-6 border-t border-neutral-200/60 text-[11px] font-medium text-neutral-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Todo</span>
            <span className="text-neutral-300">→</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> In Progress</span>
            <span className="text-neutral-300">→</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Done</span>
          </div>
        </div>
      </div>
    )
  }

  // Menentukan kolom yang tampil berdasarkan filter yang aktif
  const visibleColumns = activeFilter === 'All'
    ? KANBAN_COLUMNS
    : KANBAN_COLUMNS.filter((col) => col.id === activeFilter)

  return (
    <div className="space-y-5">
      {/* View Switcher Tabs & Filter Buttons (matching Codomo Board tab bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div
          className="inline-flex items-center p-1 bg-[#EBE9E6] rounded-xl border border-neutral-200/60 shadow-2xs overflow-x-auto"
          role="group"
          aria-label="Filter tasks by status"
        >
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter
            const count = filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length
            const label = filter === 'All' ? 'Board' : filter

            return (
              <button
                key={filter}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                }`}
                onClick={() => onFilterChange(filter)}
                aria-pressed={isSelected}
                aria-label={filter}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-neutral-100 text-neutral-700' : 'text-neutral-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</span>
        </div>
      </div>

      {/* Filter Empty State jika filter spesifik tidak memiliki task */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-14 px-4 bg-[#FAF9F7] border border-neutral-200/70 rounded-3xl">
          <p className="text-sm text-neutral-600 mb-3">
            No tasks match the filter &ldquo;{activeFilter}&rdquo;.
          </p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl shadow-2xs transition cursor-pointer"
            onClick={() => onFilterChange('All')}
          >
            Show all tasks
          </button>
        </div>
      ) : (
        /* Board Columns matching Codomo columns in screenshot */
        <div
          className={`grid gap-4 items-start ${
            visibleColumns.length === 1
              ? 'grid-cols-1 max-w-md'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {visibleColumns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id)
            const isOver = dragOverCol === col.id

            return (
              <div
                key={col.id}
                className={`flex flex-col bg-[#F3F2F0] border rounded-2xl p-3 transition-all duration-150 ${
                  isOver
                    ? 'border-neutral-400 bg-neutral-200/60 ring-2 ring-neutral-900/10'
                    : 'border-neutral-200/70'
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
                {/* Column Header: Icon + Title + (+) quick add button */}
                <div className="flex items-center justify-between px-1 pb-3 mb-2 border-b border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <h3 className="text-xs font-bold text-neutral-800">
                      {col.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-neutral-400">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-5 h-5 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-xs text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                    onClick={onOpenCreate}
                    title={`Add new task to ${col.title}`}
                  >
                    +
                  </button>
                </div>

                {/* Column Task Cards */}
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-neutral-300 rounded-xl text-center">
                    <p className="text-xs font-medium text-neutral-400 mb-0.5">{col.emptyText}</p>
                    <span className="text-[10px] text-neutral-400">Drag a task here</span>
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
