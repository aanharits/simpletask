import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/tasks'

// State server dan operasi CRUD; presentasi halaman dikelola useTaskPage.
export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingTaskIds, setUpdatingTaskIds] = useState(new Set())
  const [deletingTaskIds, setDeletingTaskIds] = useState(new Set())
  const pendingIds = useRef(new Set())

  const loadTasks = useCallback(() => {
    return getTasks()
      .then((data) => setTasks(data || []))
      .catch((err) => {
        setLoadError(
          err.message ||
            'Could not connect to the backend API. Please make sure the backend is running.'
        )
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const retryLoad = useCallback(() => {
    setLoading(true)
    setLoadError('')
    return loadTasks()
  }, [loadTasks])

  const createTask = useCallback(async (payload) => {
    setIsCreating(true)
    try {
      const task = await apiCreateTask(payload)
      setTasks((prev) => [...prev, task].sort((a, b) => a.id - b.id))
      return task
    } finally {
      setIsCreating(false)
    }
  }, [])

  // Ref mengunci ID secara sinkron, termasuk sebelum render berikutnya.
  const mutateTask = useCallback(async (taskId, setPending, operation) => {
    if (pendingIds.current.has(taskId)) {
      throw new Error('This task is already being updated or deleted.')
    }
    pendingIds.current.add(taskId)
    setPending((prev) => new Set(prev).add(taskId))
    try {
      return await operation()
    } finally {
      pendingIds.current.delete(taskId)
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }, [])

  const updateTask = useCallback((taskId, payload) =>
    mutateTask(taskId, setUpdatingTaskIds, async () => {
      const updated = await apiUpdateTask(taskId, payload)
      setTasks((prev) => prev.map((task) => task.id === taskId ? updated : task))
      return updated
    }), [mutateTask])

  const deleteTask = useCallback((taskId) =>
    mutateTask(taskId, setDeletingTaskIds, async () => {
      await apiDeleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    }), [mutateTask])

  return {
    tasks, loading, loadError, isCreating,
    updatingTaskIds, deletingTaskIds,
    createTask, updateTask, deleteTask, retryLoad,
  }
}

export default useTasks
