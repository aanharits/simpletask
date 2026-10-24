import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const NAV_ITEMS = [
  { key: 'All', label: 'All Tasks' },
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
]

// Komponen halaman utama yang merender layout sidebar + main panel.
export default function App() {
  const {
    tasks,
    loading,
    loadError,
    actionError,
    actionSuccess,
    isCreating,
    updatingTaskId,
    deletingTaskId,
    stats,
    createTask,
    updateTask,
    deleteTask,
    retryLoad,
    clearActionError,
    clearActionSuccess,
  } = useTasks()

  const [activeFilter, setActiveFilter] = useState('All')
  const [showForm, setShowForm] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Hitung task count per status untuk ditampilkan di sidebar.
  const countFor = (key) => {
    if (key === 'All') return tasks.length
    return tasks.filter((t) => t.status === key).length
  }

  const currentLabel = NAV_ITEMS.find((n) => n.key === activeFilter)?.label || 'All Tasks'

  return (
    <div className="flex h-screen bg-[#ECEAE7] text-ink font-sans overflow-hidden">
      {/* ── Mobile sidebar backdrop ─────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Left Sidebar ────────────────────────────── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-56 flex flex-col bg-[#ECEAE7] shrink-0
          transition-transform duration-200
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-light-orange shadow-[0_0_0_3px_rgba(243,115,56,0.2)]"
              aria-hidden="true"
            />
            <span className="text-sm font-bold tracking-tight text-ink">Task Tracker</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5" aria-label="Task filters">
          {NAV_ITEMS.map(({ key, label }) => {
            const isActive = activeFilter === key
            const count = countFor(key)
            return (
              <button
                key={key}
                type="button"
                className={`
                  w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer
                  ${isActive
                    ? 'bg-white/70 text-ink font-semibold shadow-[0_1px_3px_rgba(20,20,19,0.06)]'
                    : 'text-granite hover:bg-white/40 hover:text-ink font-medium'
                  }
                `}
                onClick={() => {
                  setActiveFilter(key)
                  setMobileSidebarOpen(false)
                }}
                aria-pressed={isActive}
                aria-label={key}
              >
                <span aria-hidden="true">{label}</span>
                {count > 0 && (
                  <span aria-hidden="true" className={`text-[11px] tabular-nums ${isActive ? 'text-slate-custom' : 'text-taupe'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Stats mini row */}
        <div
          className="mx-3 mb-4 p-3 rounded-xl bg-white/40 space-y-1.5"
          role="region"
          aria-label="Task progress summary"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-custom font-medium">Total</span>
            <span className="font-bold text-ink tabular-nums">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-custom font-medium">In Progress</span>
            <span className="font-semibold text-clay-brown tabular-nums">{stats.inProgress}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-custom font-medium">Done</span>
            <span className="font-semibold text-[#1B4D20] tabular-nums">{stats.done}</span>
          </div>
        </div>

        {/* New Task button */}
        <div className="px-3 pb-5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-signal-orange text-white text-sm font-semibold shadow-[0_2px_8px_rgba(207,69,0,0.35)] hover:bg-[#b83d00] active:scale-[0.98] transition-all cursor-pointer"
            onClick={() => {
              setShowForm(true)
              setMobileSidebarOpen(false)
            }}
          >
            <span className="text-base leading-none" aria-hidden="true">+</span>
            New Task
          </button>
        </div>
      </aside>

      {/* ── Main Panel ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Inner white/cream surface */}
        <div className="flex-1 m-3 md:m-4 bg-lifted rounded-2xl shadow-[0_2px_16px_rgba(20,20,19,0.07)] flex flex-col overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-1.5 rounded-lg text-slate-custom hover:bg-canvas transition cursor-pointer"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold tracking-tight text-ink">{currentLabel}</h1>
            </div>

            {/* Notifications area */}
            <div className="flex items-center gap-2">
              {actionSuccess && (
                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-success-bg text-success-text border border-success-border"
                  role="status"
                >
                  <span aria-hidden="true">✓</span>
                  <span>{actionSuccess}</span>
                  <button
                    type="button"
                    className="opacity-60 hover:opacity-100 ml-0.5 cursor-pointer"
                    onClick={clearActionSuccess}
                    aria-label="Dismiss message"
                  >
                    ×
                  </button>
                </div>
              )}
              {actionError && (
                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-error-bg text-error-text border border-error-border"
                  role="alert"
                >
                  <span aria-hidden="true">⚠</span>
                  <span>{actionError}</span>
                  <button
                    type="button"
                    className="opacity-60 hover:opacity-100 ml-0.5 cursor-pointer"
                    onClick={clearActionError}
                    aria-label="Dismiss error"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile notifications (below header) */}
          {(actionError || actionSuccess) && (
            <div className="sm:hidden px-4 py-3 border-b border-border-custom space-y-2 shrink-0">
              {actionSuccess && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-success-bg text-success-text border border-success-border" role="status">
                  <span>✓ {actionSuccess}</span>
                  <button type="button" onClick={clearActionSuccess} className="opacity-60 hover:opacity-100 cursor-pointer" aria-label="Dismiss message">×</button>
                </div>
              )}
              {actionError && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-error-bg text-error-text border border-error-border" role="alert">
                  <span>⚠ {actionError}</span>
                  <button type="button" onClick={clearActionError} className="opacity-60 hover:opacity-100 cursor-pointer" aria-label="Dismiss error">×</button>
                </div>
              )}
            </div>
          )}

          {/* Create Task Form — collapsible */}
          {showForm && (
            <div className="shrink-0 border-b border-border-custom bg-canvas/50">
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="create-task-heading" className="text-sm font-bold uppercase tracking-wider text-granite">
                    New Task
                  </h2>
                  <button
                    type="button"
                    className="text-slate-custom hover:text-ink transition cursor-pointer p-1 rounded-md hover:bg-canvas"
                    onClick={() => setShowForm(false)}
                    aria-label="Dismiss form"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <TaskForm
                  onSubmit={async (payload) => {
                    await createTask(payload)
                    setShowForm(false)
                  }}
                  isSubmitting={isCreating}
                  buttonText="Create Task"
                  idPrefix="create-task"
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* Scrollable task area */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 h-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-custom text-sm" role="status" aria-live="polite">
                  <div className="w-7 h-7 border-[2.5px] border-taupe border-t-ink rounded-full animate-spin" aria-hidden="true" />
                  <p>Loading tasks from database...</p>
                </div>
              ) : loadError ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center" role="alert">
                  <div className="w-8 h-8 rounded-full bg-error-bg text-error-text flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-1">Unable to load tasks</h3>
                    <p className="text-xs text-granite max-w-xs">{loadError}</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-canvas hover:bg-charcoal transition cursor-pointer"
                    onClick={retryLoad}
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  updatingTaskId={updatingTaskId}
                  deletingTaskId={deletingTaskId}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              )}
            </div>
          </div>

          {/* Panel Footer */}
          <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-border-custom">
            <span className="text-[11px] text-taupe">FastAPI · SQLModel · PostgreSQL 17 · React + Vite</span>
            <span className="text-[11px] text-taupe">
              Built for GLI Technical Assessment
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
