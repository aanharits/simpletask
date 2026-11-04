import { FILTER_ALL, TASK_FILTERS } from '@/constants/task'

// Tab filter status (Board / Todo / In Progress / Done) beserta jumlah task di masing-masing tab.
export default function StatusFilterTabs({ tasks, activeFilter, onFilterChange }) {
  const countFor = (filter) =>
    filter === FILTER_ALL ? tasks.length : tasks.filter((t) => t.status === filter).length

  return (
    <div
      className="w-full sm:w-auto flex items-center p-1 bg-column-bg rounded-xl border border-neutral-200/60 shadow-2xs overflow-x-auto no-scrollbar"
      role="group"
      aria-label="Filter tasks by status"
    >
      {TASK_FILTERS.map((filter) => {
        const isSelected = activeFilter === filter

        return (
          <button
            key={filter}
            type="button"
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
            onClick={() => onFilterChange(filter)}
            aria-pressed={isSelected}
            aria-label={filter}
          >
            <span>{filter === FILTER_ALL ? 'Board' : filter}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full transition-colors duration-150 ${
                isSelected ? 'bg-neutral-100 text-neutral-700' : 'text-neutral-400'
              }`}
            >
              {countFor(filter)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
