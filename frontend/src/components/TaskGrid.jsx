import TaskItem from './TaskItem'

// Komponen grid responsif untuk menampilkan task pada tab Todo, In Progress, atau Done tanpa space kosong di sisi kanan.
export default function TaskGrid({
  status,
  tasks,
  columnConfig,
  onUpdate,
  onDelete,
  updatingTaskId = null,
  deletingTaskId = null,
  onOpenCreate = null,
}) {
  return (
    <div className="space-y-4">
      {/* Header Status Bar untuk Tab Aktif */}
      <div className="flex items-center justify-between p-3.5 bg-[#F3F2F0] border border-neutral-200/70 rounded-2xl">
        <div className="flex items-center gap-2.5">
          {columnConfig?.icon}
          <h3 className="text-sm font-bold text-neutral-900">
            {columnConfig?.title || status}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600 shadow-2xs">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {onOpenCreate && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 rounded-xl shadow-2xs transition cursor-pointer"
            onClick={onOpenCreate}
          >
            <span>+ Add Task</span>
          </button>
        )}
      </div>

      {/* Grid Responsif Multi-Kolom Mengisi Seluruh Lebar Kontainer */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-label={`${status} task grid`}
      >
        {tasks.map((task) => (
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
    </div>
  )
}
