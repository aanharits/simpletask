// Komponen navbar header: breadcrumb, task counter badge, search input, dan tombol toggle form.
export default function Header({
  taskCount = 0,
  searchQuery = '',
  onSearchChange,
  canHideForm = false,
  isFormOpen = true,
  onToggleForm,
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200/70 mb-6">
      {/* Breadcrumb Title & Task Count Badge */}
      <div className="flex items-center gap-3.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-neutral-400">Workspace</span>
            <span className="text-xs text-neutral-300 select-none">/</span>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-none">
              Simple Task
            </h1>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200/80 rounded-full font-mono">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Search & Toggle Form Button */}
      <div className="flex items-center gap-2.5">
        {/* Search input with smooth expansion */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-7 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 w-40 sm:w-52 focus:w-48 sm:focus:w-60 transition-all duration-200 ease-out shadow-2xs"
          />
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="absolute left-2.5 text-neutral-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-700 text-xs font-bold hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer animate-pop-in"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Toggle Create Form Button: hanya muncul jika sudah ada data task */}
        {canHideForm && (
          <button
            type="button"
            onClick={onToggleForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
          >
            <span>{isFormOpen ? '− Hide Form' : '+ New Task'}</span>
          </button>
        )}
      </div>
    </header>
  )
}
