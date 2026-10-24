import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import TaskGrid from './TaskGrid'

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

// Komponen board layout utama: Board view dengan batasan 3 data & expand, serta status view dengan responsif grid.
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

  // Tampilkan empty state global jika belum ada data task
  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-12 bg-[#F7F6F4] border border-dashed border-neutral-300 rounded-3xl"
        role="region"
        aria-label="No tasks"
      >
        <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 text-neutral-400 flex items-center justify-center mb-3 shadow-2xs">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1">No tasks recorded yet</h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-4 leading-relaxed">
          Get started by filling out the form to add your first task.
          Your tasks are stored persistently in PostgreSQL.
        </p>
        {onOpenCreate && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl shadow-xs transition cursor-pointer"
            onClick={onOpenCreate}
          >
            <span>+ Add First Task</span>
          </button>
        )}
      </div>
    )
  }

  const selectedColConfig = KANBAN_COLUMNS.find((col) => col.id === activeFilter)

  return (
    <div className="space-y-5">
      {/* View Switcher Tabs & Filter Buttons */}
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

      {/* Tampilan jika filter spesifik tidak memiliki task yang cocok */}
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
      ) : activeFilter === 'All' ? (
        /* ── Tab Board: 3 Kolom dengan batasan 3 data per kolom + Expand toggle ── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id)
            const isOver = dragOverCol === col.id

            return (
              <KanbanColumn
                key={col.id}
                col={col}
                tasks={columnTasks}
                onUpdate={onUpdate}
                onDelete={onDelete}
                updatingTaskId={updatingTaskId}
                deletingTaskId={deletingTaskId}
                isOver={isOver}
                initialLimit={3}
                onOpenCreate={onOpenCreate}
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
              />
            )
          })}
        </div>
      ) : (
        /* ── Tab Status (Todo / In Progress / Done): Tampilan GRID Multi-Kolom ── */
        <TaskGrid
          status={activeFilter}
          tasks={filteredTasks}
          columnConfig={selectedColConfig}
          onUpdate={onUpdate}
          onDelete={onDelete}
          updatingTaskId={updatingTaskId}
          deletingTaskId={deletingTaskId}
          onOpenCreate={onOpenCreate}
        />
      )}
    </div>
  )
}
