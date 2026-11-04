import { STATUS_META, TASK_STATUS } from '@/constants/task'

const STATUS_ICONS = {
  [TASK_STATUS.TODO]: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  [TASK_STATUS.IN_PROGRESS]: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden="true">
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
  [TASK_STATUS.DONE]: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
}

// Header kolom status (ikon + judul + jumlah task), dipakai bersama oleh KanbanColumn dan TaskGrid.
export default function StatusColumnHeader({ status, count, className = '' }) {
  return (
    <div className={`flex items-center px-1 pb-3 border-b border-neutral-200/60 ${className}`.trim()}>
      <div className="flex items-center gap-2">
        {STATUS_ICONS[status]}
        <h3 className="text-xs font-bold text-neutral-800">{STATUS_META[status]?.title ?? status}</h3>
        <span className="text-[11px] font-semibold text-neutral-400">{count}</span>
      </div>
    </div>
  )
}
