import useTasks from './hooks/useTasks'
import Header from './components/Header'
import TaskCreatePanel from './components/TaskCreatePanel'
import TaskBoard from './components/TaskBoard'
import ToastContainer from './components/Toast'
import Footer from './components/Footer'

// Komponen root Simple Task: Pure presentation layer yang mengonsumsi state & controller dari useTasks.
export default function App() {
  const {
    tasks,
    displayedTasks,
    loading,
    loadError,
    retryLoad,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    updatingTaskId,
    deletingTaskId,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isFormOpen,
    canHideForm,
    toggleForm,
    closeForm,
    openCreateForm,
    toasts,
    removeToast,
  } = useTasks()

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
          canHideForm={canHideForm}
          isFormOpen={isFormOpen}
          onToggleForm={toggleForm}
        />

        {/* Modular Collapsible Create Task Section */}
        <TaskCreatePanel
          isOpen={isFormOpen}
          canClose={canHideForm}
          onClose={closeForm}
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
            <TaskBoard
              tasks={displayedTasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              updatingTaskId={updatingTaskId}
              deletingTaskId={deletingTaskId}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenCreate={openCreateForm}
            />
          )}
        </section>

        {/* Modular Footer */}
        <Footer />
      </div>
    </div>
  )
}
