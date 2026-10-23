import { useState, useEffect, useCallback } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  // Load tasks on initial mount
  const loadTasks = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await getTasks()
      setTasks(data || [])
    } catch (err) {
      setLoadError(
        err.message ||
          'Could not connect to the backend API. Please make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    getTasks()
      .then((data) => {
        if (isMounted) setTasks(data || [])
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(
            err.message ||
              'Could not connect to the backend API. Please make sure the backend is running.'
          )
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Clear success notification after 4 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess])

  // Handle task creation
  const handleCreateTask = async (payload) => {
    setIsCreating(true)
    setActionError('')
    try {
      const newTask = await createTask(payload)
      // Insert in deterministic ID ascending order
      setTasks((prev) => [...prev, newTask].sort((a, b) => a.id - b.id))
      setActionSuccess(`Task "${newTask.title}" created successfully.`)
    } catch (err) {
      setActionError(err.message || 'Failed to create task.')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  // Handle task update
  const handleUpdateTask = async (taskId, payload) => {
    setUpdatingTaskId(taskId)
    setActionError('')
    try {
      const updated = await updateTask(taskId, payload)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
      setActionSuccess(`Task #${taskId} updated successfully.`)
      return updated
    } catch (err) {
      setActionError(err.message || 'Failed to update task.')
      throw err
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    setDeletingTaskId(taskId)
    setActionError('')
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setActionSuccess(`Task #${taskId} deleted successfully.`)
    } catch (err) {
      setActionError(err.message || 'Failed to delete task.')
      throw err
    } finally {
      setDeletingTaskId(null)
    }
  }

  // Quick statistics
  const todoCount = tasks.filter((t) => t.status === 'Todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length
  const doneCount = tasks.filter((t) => t.status === 'Done').length

  return (
    <div className="app-layout">
      {/* Top Floating Header */}
      <header className="app-header">
        <div className="header-pill">
          <div className="brand-badge">
            <span className="brand-dot" aria-hidden="true"></span>
            <span className="brand-name">Task Tracker</span>
          </div>
          <span className="header-meta">FastAPI + PostgreSQL</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Editorial Page Intro */}
        <section className="intro-section">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot" aria-hidden="true">•</span> SIMPLE TASK / PROJECT TRACKER
          </span>
          <h1 className="page-headline">Manage your workflow with clarity.</h1>
          <p className="page-subhead">
            A full-stack task manager persisting to PostgreSQL. Create, track progress, edit, and organize deliverables without page reload.
          </p>

          {/* Metric stats row */}
          <div className="stats-row" role="region" aria-label="Task progress summary">
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{tasks.length}</span>
            </div>
            <div className="stat-card stat-todo">
              <span className="stat-label">Todo</span>
              <span className="stat-value">{todoCount}</span>
            </div>
            <div className="stat-card stat-progress">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{inProgressCount}</span>
            </div>
            <div className="stat-card stat-done">
              <span className="stat-label">Done</span>
              <span className="stat-value">{doneCount}</span>
            </div>
          </div>
        </section>

        {/* Global Notifications */}
        {actionError && (
          <div className="global-alert alert-error" role="alert">
            <span className="alert-icon" aria-hidden="true">⚠</span>
            <span className="alert-message">{actionError}</span>
            <button
              type="button"
              className="alert-dismiss"
              onClick={() => setActionError('')}
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
              onClick={() => setActionSuccess('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Task Card */}
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
            onSubmit={handleCreateTask}
            isSubmitting={isCreating}
            buttonText="Create Task"
            idPrefix="create-task"
          />
        </section>

        {/* Task List Section */}
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
              <button type="button" className="btn btn-primary" onClick={loadTasks}>
                Retry Connection
              </button>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              updatingTaskId={updatingTaskId}
              deletingTaskId={deletingTaskId}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          )}
        </section>
      </main>

      {/* Footer */}
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
