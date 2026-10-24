import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Komponen halaman utama dengan layout Codomo reference design: sidebar, header toolbar, view tabs, dan board.
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
    <div className="min-h-screen bg-[#ECEAE7] p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased text-neutral-800">
      {/* Outer App Frame matching reference screenshot with curved borders and soft shadow */}
      <div className="w-full max-w-[1520px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-200/70 overflow-hidden flex flex-col md:flex-row min-h-[860px]">
        
        {/* ── Left Sidebar (Codomo Style) ─────────────────────────────────── */}
        <aside className="w-64 shrink-0 bg-[#FAF9F7] border-r border-neutral-200/70 p-5 flex flex-col justify-between hidden md:flex">
          <div>
            {/* Logo / Brand Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-xs font-black shadow-xs">
                  ✻
                </div>
                <span className="text-sm font-bold tracking-tight text-neutral-900">Codomo</span>
              </div>
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-600 transition"
                title="Sidebar layout"
                aria-label="Toggle sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>
            </div>

            {/* Create project / search bar */}
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-neutral-200/90 rounded-xl shadow-2xs hover:bg-neutral-50 transition cursor-pointer"
              >
                <span>+ Create project</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200/90 rounded-xl shadow-2xs text-neutral-500 hover:text-neutral-900 transition"
                title="Search"
                aria-label="Search navigation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Main Navigation Items */}
            <nav className="space-y-1 mb-6 text-xs font-medium text-neutral-600">
              <a href="#inbox" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
                <span>Inbox</span>
              </a>
              <a href="#reports" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span>Reports</span>
              </a>
              <a href="#notifications" className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition">
                <div className="flex items-center gap-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Notifications</span>
                </div>
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
              </a>
              <a href="#invoice" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Invoice</span>
              </a>
              <a href="#archive" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                <span>Archive</span>
              </a>
            </nav>

            {/* PROJECTS Tree */}
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 mb-2 block px-2.5">
                Projects
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>Intex Company</span>
                  </div>
                  <span className="text-neutral-400 text-xs">^</span>
                </div>

                <div className="pl-6 space-y-1 text-xs">
                  <a href="#branding" className="flex items-center gap-2 py-1 text-neutral-500 hover:text-neutral-900">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Branding</span>
                  </a>
                  <a href="#email-template" className="flex items-center gap-2 py-1 text-neutral-500 hover:text-neutral-900">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Email Template</span>
                  </a>
                  <div className="flex items-center gap-2 py-1.5 px-2 bg-neutral-200/70 rounded-lg text-neutral-900 font-semibold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Design for Landing Page</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 py-1 text-neutral-400 hover:text-neutral-800 text-[11px] cursor-pointer"
                  >
                    <span>+ Create new issue</span>
                  </button>
                </div>

                <div className="flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-neutral-600 rounded-lg hover:bg-neutral-200/40 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span>Go Money</span>
                  </div>
                  <span className="text-neutral-400 text-xs">v</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Status */}
          <div className="pt-4 border-t border-neutral-200/60">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                FastAPI + Postgres
              </span>
              <span className="font-mono text-neutral-400">v1.0</span>
            </div>
          </div>
        </aside>

        {/* ── Main Content Area (Board View) ───────────────────────────────── */}
        <main className="flex-1 flex flex-col p-5 sm:p-7 overflow-x-hidden">
          
          {/* Top Breadcrumb & Toolbar matching Codomo screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200/70 mb-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Intex Company</span>
              <span className="text-neutral-400">›</span>
              <span className="text-neutral-800 font-semibold">Design for Landing Page</span>
            </div>

            {/* Right Toolbar: Avatars + Search + Filter + Share + Add New Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Avatar stack */}
              <div className="hidden lg:flex items-center -space-x-1.5 mr-1">
                <span className="w-6 h-6 rounded-full bg-sky-200 border-2 border-white text-[11px] flex items-center justify-center">👨🏻</span>
                <span className="w-6 h-6 rounded-full bg-emerald-200 border-2 border-white text-[11px] flex items-center justify-center">👩🏽</span>
                <span className="w-6 h-6 rounded-full bg-amber-200 border-2 border-white text-[11px] flex items-center justify-center">🧑🏻</span>
                <span className="w-6 h-6 rounded-full bg-neutral-100 border-2 border-white text-[10px] font-bold text-neutral-600 flex items-center justify-center">+8</span>
              </div>

              {/* Search anything input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 w-36 sm:w-44 transition shadow-2xs"
                />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-2.5 top-2.5 text-neutral-400">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Filter button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-xl shadow-2xs text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
                <span className="text-[10px] text-neutral-400">v</span>
              </button>

              {/* Add New CTA button */}
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>{showCreateForm ? '− Hide Form' : '+ Add New'}</span>
              </button>
            </div>
          </div>

          {/* Page Heading */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Design for Landing Page
            </h1>
          </div>

          {/* Global Alert Notifications */}
          {actionError && (
            <div
              className="flex items-center justify-between p-3 mb-4 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl shadow-2xs"
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
              className="flex items-center justify-between p-3 mb-4 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs"
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

          {/* Create Task Card matching Codomo modern card */}
          {showCreateForm && (
            <section
              className="mb-6 bg-[#FAF9F7] border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs"
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
                  className="text-neutral-400 hover:text-neutral-700 text-xs font-medium cursor-pointer"
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
        </main>
      </div>
    </div>
  )
}
