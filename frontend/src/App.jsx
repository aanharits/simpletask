import useTaskPage from '@/hooks/useTaskPage'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TaskCreatePanel from '@/components/task/TaskCreatePanel'
import TaskBoard from '@/components/task/TaskBoard'
import ToastContainer from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'

const ErrorIcon = () => (
  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center mb-2" aria-hidden="true">
    !
  </div>
)

// Komponen root Simple Task: pure presentation layer yang mengonsumsi state & controller dari useTaskPage.
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
    updatingTaskIds,
    deletingTaskIds,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isFormOpen,
    canHideForm,
    toggleForm,
    closeForm,
    openCreateForm,
    focusRequest,
    clearSearch,
    toasts,
    removeToast,
  } = useTaskPage()

  const renderTasks = () => {
    if (loading) return <LoadingState message="Loading tasks from database..." />

    if (loadError) {
      return (
        <EmptyState
          tone="danger"
          className="py-14 px-4 bg-red-50/50 border border-red-200 rounded-2xl"
          role="alert"
          icon={<ErrorIcon />}
          title="Unable to load tasks"
          description={loadError}
          action={<Button onClick={retryLoad}>Retry Connection</Button>}
        />
      )
    }

    return (
      <TaskBoard
        tasks={displayedTasks}
        totalTaskCount={tasks.length}
        onClearSearch={clearSearch}
        onUpdate={updateTask}
        onDelete={deleteTask}
        updatingTaskIds={updatingTaskIds}
        deletingTaskIds={deletingTaskIds}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenCreate={openCreateForm}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#ECEAE7] p-0 sm:p-6 lg:p-8 flex justify-center font-sans antialiased text-neutral-800">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="w-full max-w-6xl bg-white rounded-none sm:rounded-3xl shadow-none sm:shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-0 sm:border border-neutral-200/70 overflow-hidden flex flex-col p-4 sm:p-8 min-h-screen sm:min-h-200">
        <Header
          taskCount={tasks.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          canHideForm={canHideForm}
          isFormOpen={isFormOpen}
          onToggleForm={toggleForm}
        />

        <TaskCreatePanel
          focusRequest={focusRequest}
          isOpen={isFormOpen}
          canClose={canHideForm}
          onClose={closeForm}
          onSubmit={createTask}
          isSubmitting={isCreating}
        />

        <section className="flex-1" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>
          {renderTasks()}
        </section>

        <Footer />
      </div>
    </div>
  )
}
