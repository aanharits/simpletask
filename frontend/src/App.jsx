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

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink font-sans">
      {/* Floating Navigation Header */}
      <header className="p-6 pb-0 flex justify-center">
        <div className="flex items-center justify-between max-w-[980px] w-full bg-white px-6 py-3 rounded-full shadow-[0_4px_24px_rgba(20,20,19,0.04)] border border-border-custom">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-light-orange shadow-[0_0_0_3px_rgba(243,115,56,0.2)]"
              aria-hidden="true"
            />
            <span className="text-base font-bold tracking-tight text-ink">Task Tracker</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-custom">FastAPI + PostgreSQL</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[980px] w-full mx-auto px-4 sm:px-6 pb-16">
        {/* Editorial Intro Section */}
        <section className="py-8 sm:py-10">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-granite mb-2">
            <span className="text-light-orange text-base leading-none" aria-hidden="true">•</span> SIMPLE TASK / PROJECT TRACKER
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-semibold leading-[1.15] tracking-tight text-ink mb-3">
            Manage your workflow with clarity.
          </h1>
          <p className="text-base sm:text-[17px] text-granite max-w-[640px] leading-relaxed mb-6">
            A full-stack task manager persisting to PostgreSQL. Create, track progress, edit, and organize deliverables without page reload.
          </p>

          {/* Metric Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4" role="region" aria-label="Task progress summary">
            <div className="bg-lifted border border-border-custom rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-medium text-slate-custom">Total Tasks</span>
              <span className="text-2xl font-bold tracking-tight text-ink">{stats.total}</span>
            </div>
            <div className="bg-lifted border border-border-custom rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-medium text-slate-custom">Todo</span>
              <span className="text-2xl font-bold tracking-tight text-charcoal">{stats.todo}</span>
            </div>
            <div className="bg-lifted border border-border-custom rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-medium text-slate-custom">In Progress</span>
              <span className="text-2xl font-bold tracking-tight text-clay-brown">{stats.inProgress}</span>
            </div>
            <div className="bg-lifted border border-border-custom rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-medium text-slate-custom">Done</span>
              <span className="text-2xl font-bold tracking-tight text-[#1B4D20]">{stats.done}</span>
            </div>
          </div>
        </section>

        {/* Global Notifications */}
        {actionError && (
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm font-medium bg-error-bg text-error-text border border-error-border"
            role="alert"
          >
            <span className="font-bold text-base" aria-hidden="true">⚠</span>
            <span className="flex-1">{actionError}</span>
            <button
              type="button"
              className="text-xl leading-none opacity-70 hover:opacity-100 cursor-pointer"
              onClick={clearActionError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {actionSuccess && (
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm font-medium bg-success-bg text-success-text border border-success-border"
            role="status"
          >
            <span className="font-bold text-base" aria-hidden="true">✓</span>
            <span className="flex-1">{actionSuccess}</span>
            <button
              type="button"
              className="text-xl leading-none opacity-70 hover:opacity-100 cursor-pointer"
              onClick={clearActionSuccess}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Task Card Surface */}
        <section
          className="bg-lifted border border-border-custom rounded-[24px] shadow-[0_4px_24px_rgba(20,20,19,0.04)] p-6 sm:p-8 mb-8"
          aria-labelledby="create-task-heading"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-granite mb-1">
              <span className="text-light-orange text-base leading-none" aria-hidden="true">•</span> NEW TASK
            </span>
            <h2 id="create-task-heading" className="text-2xl font-semibold tracking-tight text-ink mb-1">
              Create a Task
            </h2>
            <p className="text-sm text-slate-custom">
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

        {/* Task List Card Surface */}
        <section
          className="bg-lifted border border-border-custom rounded-[24px] shadow-[0_4px_24px_rgba(20,20,19,0.04)] p-6 sm:p-8 mb-8"
          aria-labelledby="task-list-heading"
        >
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4 text-slate-custom text-sm" role="status" aria-live="polite">
              <div className="w-8 h-8 border-3 border-taupe border-t-ink rounded-full animate-spin" aria-hidden="true" />
              <p>Loading tasks from database...</p>
            </div>
          ) : loadError ? (
            <div className="text-center p-10 bg-white border border-error-border rounded-[18px] flex flex-col items-center gap-3" role="alert">
              <div className="w-9 h-9 rounded-full bg-error-bg text-error-text flex items-center justify-center text-lg font-bold">
                !
              </div>
              <h3 className="text-lg font-bold text-ink">Unable to load tasks</h3>
              <p className="text-sm text-granite max-w-[440px]">{loadError}</p>
              <button
                type="button"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[15px] font-semibold bg-ink text-canvas border-[1.5px] border-ink hover:bg-charcoal transition cursor-pointer"
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

      {/* Editorial Dark Footer */}
      <footer className="bg-ink text-canvas py-10 px-6 mt-auto">
        <div className="max-w-[980px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-base font-bold tracking-tight text-canvas">Task Tracker</span>
            <p className="text-xs sm:text-sm text-taupe mt-1">
              Built for GLI Full-Stack Developer Technical Assessment.
            </p>
          </div>
          <div className="text-xs text-taupe">
            <span>FastAPI • SQLModel • PostgreSQL 17 • React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
