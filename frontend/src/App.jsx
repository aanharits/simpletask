import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Komponen halaman utama yang merender layout, header, form input, dan daftar task.
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

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">Task Tracker</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full border border-slate-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              FastAPI + PostgreSQL
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition cursor-pointer"
            >
              <span>{isFormOpen ? '− Hide Form' : '+ New Task'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
            Simple Task / Project Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Manage your workflow with clarity.
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            A full-stack task manager persisting to PostgreSQL. Create, track progress, edit, and organize deliverables without page reload.
          </p>

          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2" role="region" aria-label="Task progress summary">
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="block text-xs font-medium text-slate-500">Total Tasks</span>
              <span className="text-xl font-bold text-slate-900 mt-1">{stats.total}</span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="block text-xs font-medium text-slate-500">Todo</span>
              <span className="text-xl font-bold text-slate-700 mt-1">{stats.todo}</span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="block text-xs font-medium text-slate-500">In Progress</span>
              <span className="text-xl font-bold text-blue-600 mt-1">{stats.inProgress}</span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="block text-xs font-medium text-slate-500">Done</span>
              <span className="text-xl font-bold text-emerald-600 mt-1">{stats.done}</span>
            </div>
          </div>
        </section>

        {/* Global Notifications */}
        {actionError && (
          <div
            className="flex items-center justify-between p-3.5 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl shadow-2xs animate-in fade-in"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" aria-hidden="true">⚠</span>
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 font-bold ml-4 text-base cursor-pointer"
              onClick={clearActionError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {actionSuccess && (
          <div
            className="flex items-center justify-between p-3.5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs animate-in fade-in"
            role="status"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" aria-hidden="true">✓</span>
              <span>{actionSuccess}</span>
            </div>
            <button
              type="button"
              className="text-emerald-500 hover:text-emerald-700 font-bold ml-4 text-base cursor-pointer"
              onClick={clearActionSuccess}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Task Card */}
        {isFormOpen && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs" aria-labelledby="create-task-heading">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                New Task
              </div>
              <h2 id="create-task-heading" className="text-base sm:text-lg font-bold text-slate-900">
                Create a Task
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
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

        {/* Kanban Board Section */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" aria-hidden="true" />
              <p className="text-xs font-medium text-slate-500">Loading tasks from database...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-red-50/50 border border-red-100 rounded-xl" role="alert">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold mb-2">!</div>
              <h3 className="text-sm font-bold text-red-900 mb-1">Unable to load tasks</h3>
              <p className="text-xs text-red-600 max-w-md mb-4">{loadError}</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition cursor-pointer"
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
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Task Tracker</span> — Built for GLI Full-Stack Developer Technical Assessment.
          </div>
          <div>
            <span>FastAPI • SQLModel • PostgreSQL 17 • React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
