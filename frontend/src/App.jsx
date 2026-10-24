import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Komponen halaman utama Simple Task: clean, modern, minimalist dashboard tanpa sidebar.
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
    createTask,
    updateTask,
    deleteTask,
    retryLoad,
    clearActionError,
    clearActionSuccess,
  } = useTasks()

  const [activeFilter, setActiveFilter] = useState('All')
  const [showCreateForm, setShowCreateForm] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter tasks berdasarkan activeFilter dan search query jika ada
  const displayedTasks = tasks.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchText = t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      if (!matchText) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#ECEAE7] p-3 sm:p-6 lg:p-8 flex justify-center font-sans antialiased text-neutral-800">
      {/* Main Clean Card Frame */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-neutral-200/70 overflow-hidden flex flex-col p-5 sm:p-8 min-h-[800px]">
        
        {/* Top Navbar Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200/70 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white text-sm font-bold shadow-xs">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-neutral-900">Simple Task</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search tasks input with smooth expansion */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 w-40 sm:w-52 focus:w-48 sm:focus:w-60 transition-all duration-200 ease-out shadow-2xs"
              />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-2.5 text-neutral-400 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-neutral-400 hover:text-neutral-700 text-xs font-bold hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer animate-pop-in"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Toggle Create Form Button with smooth micro-interaction */}
            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
            >
              <span>{showCreateForm ? '− Hide Form' : '+ New Task'}</span>
            </button>
          </div>
        </header>

        {/* Global Alert Notifications with slide-down animation */}
        {actionError && (
          <div
            className="flex items-center justify-between p-3.5 mb-5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl shadow-2xs animate-slide-down"
            role="alert"
          >
            <span>{actionError}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={clearActionError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {actionSuccess && (
          <div
            className="flex items-center justify-between p-3.5 mb-5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs animate-slide-down"
            role="status"
          >
            <span>{actionSuccess}</span>
            <button
              type="button"
              className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 text-sm hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={clearActionSuccess}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Task Card with smooth slide-down entrance */}
        {showCreateForm && (
          <section
            className="mb-6 bg-[#FAF9F7] border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs animate-slide-down"
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
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-medium hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Close
              </button>
            </div>

            <TaskForm
              onSubmit={createTask}
              isSubmitting={isCreating}
              buttonText="Create Task"
              idPrefix="create-task"
            />
          </section>
        )}

        {/* Main Board Section */}
        <section className="flex-1" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
              <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3" aria-hidden="true" />
              <p className="text-xs font-medium text-neutral-500">Loading tasks from database...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-red-50/50 border border-red-200 rounded-2xl" role="alert">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center mb-2">!</div>
              <h3 className="text-sm font-bold text-red-900 mb-1">Unable to load tasks</h3>
              <p className="text-xs text-red-600 max-w-md mb-4">{loadError}</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl shadow-xs transition cursor-pointer"
                onClick={retryLoad}
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <TaskList
              tasks={displayedTasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              updatingTaskId={updatingTaskId}
              deletingTaskId={deletingTaskId}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenCreate={() => setShowCreateForm(true)}
            />
          )}
        </section>

        {/* Minimal Footer */}
        <footer className="pt-6 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <span>Simple Task • Technical Test Intern Software Engineer</span>
          <span>Farhan Harits Prakoso</span>
        </footer>
      </div>
    </div>
  )
}
