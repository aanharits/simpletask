import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Komponen halaman utama yang merender layout modern berbasis referensi desain.
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
  const [isFormOpen, setIsFormOpen] = useState(true)

  // Tanggal dinamis terformat sesuai gaya referensi "21st Feb, 2025"
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased flex flex-col">
      {/* Top Bar matching reference: Title + Notification Bell + User Avatar */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Todo List
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-border-custom text-slate-custom">
            <span className="w-1.5 h-1.5 rounded-full bg-light-orange" aria-hidden="true" />
            FastAPI + PostgreSQL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell with status dot */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-border-custom flex items-center justify-center text-charcoal hover:border-ink transition cursor-pointer relative shadow-2xs"
            aria-label="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-signal-orange" aria-hidden="true" />
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-ink text-canvas font-bold text-xs flex items-center justify-center border-2 border-white shadow-2xs">
            GL
          </div>
        </div>
      </header>

      {/* Main White Dashboard Surface */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,20,19,0.05)] border border-border-custom space-y-6">

          {/* Sub-header / Toolbar row matching reference: Date dropdown on left, Add CTA on right */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-custom">
            <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-ink cursor-default">
              <span>{formattedDate}</span>
              <span className="text-xs text-slate-custom" aria-hidden="true">▾</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-ink text-canvas hover:bg-charcoal active:scale-[0.98] transition cursor-pointer shadow-xs"
              >
                <span className="text-base leading-none" aria-hidden="true">{isFormOpen ? '−' : '+'}</span>
                <span>{isFormOpen ? 'Hide Form' : 'Add New Task'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible / Default Open Form Card */}
          {isFormOpen && (
            <section
              className="bg-lifted border border-border-custom rounded-2xl p-5 sm:p-6 shadow-2xs animate-in fade-in"
              aria-labelledby="create-task-heading"
            >
              <div className="mb-5 pb-3 border-b border-border-custom">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-granite mb-1">
                  <span className="text-light-orange text-base leading-none" aria-hidden="true">•</span> NEW TASK
                </span>
                <h2 id="create-task-heading" className="text-lg font-bold tracking-tight text-ink">
                  Create a Task
                </h2>
                <p className="text-xs text-slate-custom mt-0.5">
                  Add a new deliverable with title, optional description, and status.
                </p>
              </div>

              <TaskForm
                onSubmit={createTask}
                isSubmitting={isCreating}
                buttonText="Create Task"
                idPrefix="create-task"
              />
            </section>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1" role="region" aria-label="Task progress summary">
            <div className="bg-canvas/50 border border-border-custom rounded-xl p-3.5 flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-custom">Total Tasks</span>
              <span className="text-xl font-bold text-ink">{stats.total}</span>
            </div>
            <div className="bg-canvas/50 border border-border-custom rounded-xl p-3.5 flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-custom">Todo</span>
              <span className="text-xl font-bold text-charcoal">{stats.todo}</span>
            </div>
            <div className="bg-canvas/50 border border-border-custom rounded-xl p-3.5 flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-custom">In Progress</span>
              <span className="text-xl font-bold text-clay-brown">{stats.inProgress}</span>
            </div>
            <div className="bg-canvas/50 border border-border-custom rounded-xl p-3.5 flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-custom">Done</span>
              <span className="text-xl font-bold text-[#1B4D20]">{stats.done}</span>
            </div>
          </div>

          {/* Global Alert Banners */}
          {actionError && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-error-bg text-error-text border border-error-border"
              role="alert"
            >
              <span className="font-bold text-base" aria-hidden="true">⚠</span>
              <span className="flex-1">{actionError}</span>
              <button
                type="button"
                className="text-lg leading-none opacity-70 hover:opacity-100 cursor-pointer"
                onClick={clearActionError}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {actionSuccess && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-success-bg text-success-text border border-success-border"
              role="status"
            >
              <span className="font-bold text-base" aria-hidden="true">✓</span>
              <span className="flex-1">{actionSuccess}</span>
              <button
                type="button"
                className="text-lg leading-none opacity-70 hover:opacity-100 cursor-pointer"
                onClick={clearActionSuccess}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {/* Main Task List Grid Section */}
          <section aria-labelledby="task-list-heading">
            <h2 id="task-list-heading" className="sr-only">Tasks</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-custom text-sm" role="status" aria-live="polite">
                <div className="w-8 h-8 border-3 border-taupe border-t-ink rounded-full animate-spin" aria-hidden="true" />
                <p>Loading tasks from database...</p>
              </div>
            ) : loadError ? (
              <div className="text-center p-10 bg-white border border-error-border rounded-2xl flex flex-col items-center gap-3" role="alert">
                <div className="w-9 h-9 rounded-full bg-error-bg text-error-text flex items-center justify-center text-lg font-bold">
                  !
                </div>
                <h3 className="text-lg font-bold text-ink">Unable to load tasks</h3>
                <p className="text-sm text-granite max-w-[440px]">{loadError}</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold bg-ink text-canvas border-[1.5px] border-ink hover:bg-charcoal transition cursor-pointer"
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
          </section>
        </div>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-custom mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Task Tracker — Built for GLI Technical Assessment</span>
          <span>FastAPI • SQLModel • PostgreSQL 17 • React + Vite</span>
        </div>
      </footer>
    </div>
  )
}
