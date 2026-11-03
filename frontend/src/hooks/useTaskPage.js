import { useState, useMemo, useCallback } from 'react'
import useTasks from './useTasks'
import useToast from './useToast'

export default function useTaskPage() {
  const data = useTasks()
  const { tasks, createTask, updateTask, deleteTask } = data
  const { toasts, removeToast, showSuccess, showError } = useToast()
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(true)
  const [focusRequest, setFocusRequest] = useState(0)

  const handleCreate = useCallback(async (payload) => {
    try {
      const task = await createTask(payload)
      showSuccess(`Task "${task.title}" created successfully.`)
      return task
    } catch (err) {
      showError(err.message || 'Failed to create task.')
      throw err
    }
  }, [createTask, showSuccess, showError])

  const handleUpdate = useCallback(async (id, payload, options = {}) => {
    try {
      const task = await updateTask(id, payload)
      if (!options.silent) showSuccess(`Task #${id} updated successfully.`)
      return task
    } catch (err) {
      showError(err.message || 'Failed to update task.')
      throw err
    }
  }, [updateTask, showSuccess, showError])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteTask(id)
      showSuccess(`Task #${id} deleted successfully.`)
    } catch (err) {
      showError(err.message || 'Failed to delete task.')
      throw err
    }
  }, [deleteTask, showSuccess, showError])

  // Filter tasks berdasarkan searchQuery (case-insensitive di title dan description)
  const displayedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    const q = searchQuery.toLowerCase().trim()
    return tasks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      )
    })
  }, [tasks, searchQuery])

  // visibilitas form: form wajib terbuka jika belum ada task sama sekali
  const hasTasks = tasks.length > 0
  const isFormOpen = !hasTasks || showCreateForm
  const canHideForm = hasTasks

  const toggleForm = useCallback(() => {
    if (!hasTasks) return
    setShowCreateForm((prev) => !prev)
    if (!showCreateForm) setFocusRequest((prev) => prev + 1)
  }, [hasTasks, showCreateForm])

  const closeForm = useCallback(() => {
    if (hasTasks) {
      setShowCreateForm(false)
    }
  }, [hasTasks])

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true)
    setFocusRequest((prev) => prev + 1)
  }, [])

  const clearSearch = useCallback(() => setSearchQuery(''), [])

  return {
    ...data,
    createTask: handleCreate,
    updateTask: handleUpdate,
    deleteTask: handleDelete,
    displayedTasks, activeFilter, setActiveFilter, searchQuery, setSearchQuery,
    clearSearch, isFormOpen, canHideForm, toggleForm, closeForm, openCreateForm,
    focusRequest, toasts, removeToast,
  }
}
