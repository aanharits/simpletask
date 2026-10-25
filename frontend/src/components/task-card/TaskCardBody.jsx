const STATUS_PROGRESS = {
  'Todo': {
    label: '0%',
    badge: 'text-neutral-500 bg-neutral-100 border-neutral-200',
    icon: '○',
  },
  'In Progress': {
    label: '50%',
    badge: 'text-amber-700 bg-amber-50 border-amber-200',
    icon: '◑',
  },
  'Done': {
    label: '100%',
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: '●',
  },
}

// Komponen presentasi konten utama kartu task: title, description, dan meta badge.
export default function TaskCardBody({ task }) {
  const isDone = task.status === 'Done'
  const prog = STATUS_PROGRESS[task.status] || STATUS_PROGRESS['Todo']

  return (
    <div>
      {/* Task Title */}
      <h3
        className={`text-sm font-bold leading-snug break-words mb-1 ${
          isDone ? 'text-neutral-500 line-through' : 'text-neutral-900'
        }`}
      >
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description ? (
        <p className="text-xs text-neutral-500 leading-relaxed whitespace-pre-wrap break-words line-clamp-2 mb-3">
          {task.description}
        </p>
      ) : (
        <p className="text-xs text-neutral-400 italic mb-3">
          No description provided.
        </p>
      )}

      {/* Meta / Date & Status Progress Row */}
      <div className="flex items-center justify-between gap-2 pt-1 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 font-medium">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>ID #{task.id}</span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-full border transition-colors duration-150 ${prog.badge}`}
        >
          <span aria-hidden="true">{prog.icon}</span>
          <span>{prog.label}</span>
        </span>
      </div>
    </div>
  )
}
