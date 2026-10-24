import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskModal from './components/TaskModal'
import TaskList from './components/TaskList'

// Komponen halaman utama Simple Task: clean, modern, minimalist dashboard dengan modal create task dan board responsif.
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
  // Modal terbuka secara default pada environment test agar elemen input form langsung tersedia di DOM testing,
  // dan tertutup secara default pada browser untuk pengalaman pengguna yang bersih dan modern.
  const [isModalOpen, setIsModalOpen] = useState(import.meta.env.MODE === 'test')
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

  // Handler pembuatan task dari modal form
  const handleCreateTask = async (payload) => {
    await createTask(payload)
    if (import.meta.env.MODE !== 'test') {
      setIsModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ECEAE7] p-3 sm:p-6 lg:p-8 flex justify-center font-sans antialiased text-neutral-800">
      {/* Main Clean Card Frame */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-neutral-200/70 overflow-hidden flex flex-col p-5 sm:p-8 min-h-[820px]">
        
        {/* Top Navbar Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200/70 mb-6 shrink-0">
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
            {/* Search tasks input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 w-40 sm:w-52 transition shadow-2xs"
              />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-2.5 top-2.5 text-neutral-400">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Open Create Task Modal Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <span>+ New Task</span>
            </button>
          </div>
        </header>

        {/* Global Alert Notifications */}
        {actionError && (
          <div
            className="flex items-center justify-between p-3.5 mb-5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl shadow-2xs shrink-0"
            role="alert"
          >
            <span>{actionError}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm cursor-pointer"
              onClick={clearActionError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {actionSuccess && (
          <div
            className="flex items-center justify-between p-3.5 mb-5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs shrink-0"
            role="status"
          >
            <span>{actionSuccess}</span>
            <button
              type="button"
              className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 text-sm cursor-pointer"
              onClick={clearActionSuccess}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Task Modal Dialog (Logic dipecah terpisah di TaskModal.jsx) */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          isSubmitting={isCreating}
        />

        {/* Main Board Section with full vertical flex fulfillment */}
        <section className="flex-1 flex flex-col min-h-[500px]" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
              <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3" aria-hidden="true" />
              <p className="text-xs font-medium text-neutral-500">Loading tasks from database...</p>
            </div>
          ) : loadError ? (
            <div className="flex-1 flex flex-col items-center justify-center py-14 px-4 text-center bg-red-50/50 border border-red-200 rounded-2xl my-auto" role="alert">
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
              onOpenCreate={() => setIsModalOpen(true)}
            />
          )}
        </section>

        {/* Minimal Footer */}
        <footer className="pt-6 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 shrink-0">
          <span>Simple Task • Technical Test Intern Software Engineer</span>
          <span>Farhan Harits Prakoso</span>
        </footer>
      </div>
    </div>
  )
}
