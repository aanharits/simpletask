import TaskCard from './TaskCard'

// Komponen grid responsif untuk menampilkan task langsung pada tab Todo, In Progress, atau Done
// Dilengkapi container berlatar bg-[#EBE9E6] serta header status konsisten seperti kolom pada Board ('All').
export default function TaskGrid({
  status,
  col = null,
  tasks,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
}) {
  return (
    <div className="flex flex-col bg-[#EBE9E6] border border-neutral-200/70 rounded-2xl p-3 sm:p-4 transition-all duration-200 ease-out">
      {/* Header Kolom: Icon + Title + Count */}
      <div className="flex items-center px-1 pb-3 mb-3.5 border-b border-neutral-200/60">
        <div className="flex items-center gap-2">
          {col?.icon}
          <h3 className="text-xs font-bold text-neutral-800">
            {col?.title || status}
          </h3>
          <span className="text-[11px] font-semibold text-neutral-400">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task Cards Grid atau Empty State */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-neutral-300 rounded-xl text-center">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">{col?.emptyText || 'No tasks found'}</p>
        </div>
      ) : (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          aria-label={`${status} task grid`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={updatingTaskId === task.id}
              isDeleting={deletingTaskId === task.id}
              isDraggable={false}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
