import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)

  useEffect(() => {
    const fetchInitialTasks = async () => {
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
    }

    fetchInitialTasks()
  }, [])

  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess])

  const retryLoad = useCallback(async () => {
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

  const handleCreateTask = useCallback(async (payload) => {
    setIsCreating(true)
    setActionError('')
    try {
      const newTask = await apiCreateTask(payload)
      // Pertahankan urutan ID ascending agar posisi task tetap stabil di UI.
      setTasks((prev) => [...prev, newTask].sort((a, b) => a.id - b.id))
      setActionSuccess(`Task "${newTask.title}" created successfully.`)
      return newTask
    } catch (err) {
      setActionError(err.message || 'Failed to create task.')
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [])

  const handleUpdateTask = useCallback(async (taskId, payload) => {
    setUpdatingTaskId(taskId)
    setActionError('')
    try {
      const updated = await apiUpdateTask(taskId, payload)
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
  }, [])

  const handleDeleteTask = useCallback(async (taskId) => {
    setDeletingTaskId(taskId)
    setActionError('')
    try {
      await apiDeleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setActionSuccess(`Task #${taskId} deleted successfully.`)
    } catch (err) {
      setActionError(err.message || 'Failed to delete task.')
      throw err
    } finally {
      setDeletingTaskId(null)
    }
  }, [])

  // Hitung jumlah task per status menggunakan useMemo agar efisien saat render ulang.
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'Todo').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    }
  }, [tasks])

  return {
    tasks,
    loading,
    loadError,
    actionError,
    actionSuccess,
    isCreating,
    updatingTaskId,
    deletingTaskId,
    stats,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    retryLoad,
    clearActionError: () => setActionError(''),
    clearActionSuccess: () => setActionSuccess(''),
  }
}

export default useTasks
