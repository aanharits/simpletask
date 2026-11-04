import KanbanColumn from './KanbanColumn'
import TaskGrid from './TaskGrid'
import StatusFilterTabs from './StatusFilterTabs'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import useBoardDragDrop from '@/hooks/useBoardDragDrop'
import { FILTER_ALL, KANBAN_INITIAL_LIMIT, TASK_STATUSES } from '@/constants/task'

const CalendarIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 text-neutral-400 flex items-center justify-center mb-3 shadow-2xs">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  </div>
)

// Komponen board utama: memilih tampilan (empty state, Kanban 3 kolom, atau grid per status) berdasarkan filter aktif.
export default function TaskBoard({
  tasks,
  totalTaskCount = tasks.length,
  onClearSearch,
  onUpdate,
  onDelete,
  updatingTaskIds = new Set(),
  deletingTaskIds = new Set(),
  activeFilter = FILTER_ALL,
  onFilterChange,
  onOpenCreate = null,
}) {
  const isTaskBusy = (id) => updatingTaskIds.has(id) || deletingTaskIds.has(id)
  const { dragOverStatus, getDropHandlers } = useBoardDragDrop({ onUpdate, isTaskBusy })

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status)
  const filteredTasks = activeFilter === FILTER_ALL ? tasks : tasksByStatus(activeFilter)
  const cardProps = { onUpdate, onDelete, updatingTaskIds, deletingTaskIds }

  // Belum ada data sama sekali di database.
  if (totalTaskCount === 0) {
    return (
      <EmptyState
        className="p-12 bg-[#F7F6F4] border border-dashed border-neutral-300 rounded-3xl"
        role="region"
        aria-label="No tasks"
        icon={<CalendarIcon />}
        title="No tasks recorded yet"
        description="Get started by filling out the form to add your first task. Your tasks are stored persistently in PostgreSQL."
        action={
          onOpenCreate && (
            <Button onClick={onOpenCreate}>+ Add First Task</Button>
          )
        }
      />
    )
  }

  const renderContent = () => {
    // Ada data, tetapi tidak ada yang cocok dengan kata kunci pencarian.
    if (tasks.length === 0) {
      return (
        <EmptyState
          className="py-12"
          role="status"
          title="No matching tasks"
          description="Try another search or clear your search."
          action={<Button variant="secondary" onClick={onClearSearch}>Clear search</Button>}
        />
      )
    }

    // Tidak ada task pada status yang sedang difilter.
    if (filteredTasks.length === 0) {
      return (
        <EmptyState
          className="py-14 px-4 bg-sidebar-bg border border-neutral-200/70 rounded-3xl animate-fade-in"
          description={<>No tasks match the filter &ldquo;{activeFilter}&rdquo;.</>}
          action={
            <Button variant="secondary" onClick={() => onFilterChange(FILTER_ALL)}>
              Show all tasks
            </Button>
          }
        />
      )
    }

    // Tab Board: snap-scroll horizontal di mobile, grid 3 kolom di desktop.
    if (activeFilter === FILTER_ALL) {
      return (
        <div
          key="board-view"
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible items-start animate-fade-in no-scrollbar"
        >
          {TASK_STATUSES.map((status) => (
            <div key={status} className="w-[85vw] max-w-85 sm:w-auto sm:max-w-none shrink-0 sm:shrink snap-center">
              <KanbanColumn
                status={status}
                tasks={tasksByStatus(status)}
                isOver={dragOverStatus === status}
                initialLimit={KANBAN_INITIAL_LIMIT}
                {...cardProps}
                {...getDropHandlers(status)}
              />
            </div>
          ))}
        </div>
      )
    }

    // Tab status tunggal (Todo / In Progress / Done): grid multi-kolom.
    return (
      <div key={`grid-view-${activeFilter}`} className="animate-fade-in">
        <TaskGrid status={activeFilter} tasks={filteredTasks} {...cardProps} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <StatusFilterTabs tasks={tasks} activeFilter={activeFilter} onFilterChange={onFilterChange} />
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</span>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}
