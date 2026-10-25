// Komponen footer kartu task: status selector dropdown, edit/delete actions, dan 2-step delete confirmation.
export default function TaskCardFooter({
  task,
  selectedStatus,
  showConfirmDelete,
  isUpdating = false,
  isDeleting = false,
  onStatusChange,
  onStartEdit,
  onPromptDelete,
  onConfirmDelete,
  onCancelDelete,
}) {
  const isBusy = isUpdating || isDeleting

  return (
    <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 gap-2">
      {!showConfirmDelete ? (
        <>
          <div>
            <label htmlFor={`quick-status-${task.id}`} className="sr-only">
              Change status for task {task.title}
            </label>
            <select
              id={`quick-status-${task.id}`}
              className="text-[11px] font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all duration-150 cursor-pointer disabled:opacity-50"
              value={selectedStatus}
              disabled={isBusy}
              onChange={onStatusChange}
              title="Quickly change task status"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              className="px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 active:scale-95 border border-neutral-200 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
              onClick={onStartEdit}
              disabled={isBusy}
              aria-label={`Edit task ${task.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-[11px] font-medium text-red-600 hover:text-red-700 bg-red-50/60 hover:bg-red-50 active:scale-95 border border-red-200 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
              onClick={onPromptDelete}
              disabled={isBusy}
              aria-label={`Delete task ${task.title}`}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div
          className="flex items-center justify-end w-full gap-2 animate-pop-in"
          role="group"
          aria-label="Confirm deletion"
        >
          <span className="text-[11px] font-semibold text-red-600">Delete?</span>
          <button
            type="button"
            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-2xs transition-all duration-150 cursor-pointer disabled:opacity-50"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            type="button"
            className="px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-200 active:scale-95 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
            onClick={onCancelDelete}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
