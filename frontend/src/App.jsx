import { useState, useEffect } from 'react'
import useTasks from './hooks/useTasks'
import useToast from './hooks/useToast'
import Header from './components/Header'
import CreateTaskSection from './components/CreateTaskSection'
import TaskList from './components/TaskList'
import ToastContainer from './components/Toast'
import Footer from './components/Footer'

// Komponen root Simple Task: bertindak sebagai controller / orchestrator halaman utama.
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

  const { toasts, showSuccess, showError, removeToast } = useToast()

  const [activeFilter, setActiveFilter] = useState('All')
  const [showCreateForm, setShowCreateForm] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Sinkronkan notifikasi sukses atau error ke modul toaster mengambang
  useEffect(() => {
    if (actionSuccess) {
      showSuccess(actionSuccess)
      clearActionSuccess()
    }
  }, [actionSuccess, showSuccess, clearActionSuccess])

  useEffect(() => {
    if (actionError) {
      showError(actionError)
      clearActionError()
    }
  }, [actionError, showError, clearActionError])

  // Form wajib selalu terbuka jika belum ada task sama sekali
  const hasTasks = tasks.length > 0
  const isFormOpen = !hasTasks || showCreateForm

  const handleOpenCreateForm = () => {
    setShowCreateForm(true)
    const titleInput = document.getElementById('create-task-title')
    if (titleInput) {
      titleInput.focus()
      titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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
      {/* Floating Toaster Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Clean Card Frame */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-neutral-200/70 overflow-hidden flex flex-col p-5 sm:p-8 min-h-[800px]">
        {/* Modular Navbar Header */}
        <Header
          taskCount={tasks.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          canHideForm={hasTasks}
          isFormOpen={isFormOpen}
          onToggleForm={() => setShowCreateForm(!isFormOpen)}
        />

        {/* Modular Collapsible Create Task Section */}
        <CreateTaskSection
          isOpen={isFormOpen}
          canClose={hasTasks}
          onClose={() => setShowCreateForm(false)}
          onSubmit={createTask}
          isSubmitting={isCreating}
        />

        {/* Main Board & Tasks Section */}
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
              onOpenCreate={handleOpenCreateForm}
            />
          )}
        </section>

        {/* Modular Footer */}
        <Footer />
      </div>
    </div>
  )
}
