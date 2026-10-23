import { useState } from 'react'
import useTasks from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

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
    <div className="app-layout">
      <header className="app-header">
        <div className="header-pill">
          <div className="brand-badge">
            <span className="brand-dot" aria-hidden="true"></span>
            <span className="brand-name">Task Tracker</span>
          </div>
          <span className="header-meta">FastAPI + PostgreSQL</span>
        </div>
      </header>

      <main className="main-content">
        <section className="intro-section">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot" aria-hidden="true">•</span> SIMPLE TASK / PROJECT TRACKER
          </span>
          <h1 className="page-headline">Manage your workflow with clarity.</h1>
          <p className="page-subhead">
            A full-stack task manager persisting to PostgreSQL. Create, track progress, edit, and organize deliverables without page reload.
          </p>

          <div className="stats-row" role="region" aria-label="Task progress summary">
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card stat-todo">
              <span className="stat-label">Todo</span>
              <span className="stat-value">{stats.todo}</span>
            </div>
            <div className="stat-card stat-progress">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{stats.inProgress}</span>
            </div>
            <div className="stat-card stat-done">
              <span className="stat-label">Done</span>
              <span className="stat-value">{stats.done}</span>
            </div>
          </div>
        </section>

        {actionError && (
          <div className="global-alert alert-error" role="alert">
            <span className="alert-icon" aria-hidden="true">⚠</span>
            <span className="alert-message">{actionError}</span>
            <button
              type="button"
              className="alert-dismiss"
              onClick={clearActionError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {actionSuccess && (
          <div className="global-alert alert-success" role="status">
            <span className="alert-icon" aria-hidden="true">✓</span>
            <span className="alert-message">{actionSuccess}</span>
            <button
              type="button"
              className="alert-dismiss"
              onClick={clearActionSuccess}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="card-surface create-section" aria-labelledby="create-task-heading">
          <div className="section-header">
            <span className="eyebrow-tag">
              <span className="eyebrow-dot" aria-hidden="true">•</span> NEW TASK
            </span>
            <h2 id="create-task-heading" className="section-title">
              Create a Task
            </h2>
            <p className="section-subtitle">
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

        <section className="card-surface list-section" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Tasks</h2>

          {loading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>Loading tasks from database...</p>
            </div>
          ) : loadError ? (
            <div className="load-error-state" role="alert">
              <span className="load-error-icon" aria-hidden="true">!</span>
              <h3>Unable to load tasks</h3>
              <p>{loadError}</p>
              <button type="button" className="btn btn-primary" onClick={retryLoad}>
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

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-title">Task Tracker</span>
            <p className="footer-desc">
              Built for GLI Full-Stack Developer Technical Assessment.
            </p>
          </div>
          <div className="footer-right">
            <span>FastAPI • SQLModel • PostgreSQL 17 • React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
