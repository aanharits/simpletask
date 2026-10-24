import TaskForm from './TaskForm'

// Komponen panel pembuatan task dengan wrapper accordion transisi gulir (roll-down & roll-up).
export default function TaskCreatePanel({
  isOpen = true,
  canClose = false,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  return (
    <div className={`form-accordion ${isOpen ? 'is-open' : ''}`}>
      <div className="form-accordion-inner">
        <section
          className="bg-[#FAF9F7] border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs"
          aria-labelledby="create-task-heading"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/60">
            <div>
              <h2 id="create-task-heading" className="text-sm font-bold text-neutral-900">
                Create a Task
              </h2>
              <p className="text-xs text-neutral-500">
                Add a new task item with title, optional description, and status.
              </p>
            </div>
            {/* Tombol Close hanya muncul jika sudah ada data task */}
            {canClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-medium hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Close
              </button>
            )}
          </div>

          <TaskForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            buttonText="Create Task"
            idPrefix="create-task"
          />
        </section>
      </div>
    </div>
  )
}
