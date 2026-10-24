import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/tasks'
import useToast from './useToast'

// Custom hook untuk mengelola state data tasks, CRUD HTTP request, 
// filter & pencarian, manajemen tampilan form, serta integrasi feedback toaster.
export function useTasks() {
  const { toasts, showSuccess, showError, removeToast, clearAll: clearToasts } = useToast()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)

  // Controller state: status filter, query pencarian, dan visibilitas accordion form
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(true)

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

  // Memuat ulang daftar task dari backend saat koneksi gagal.
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

  // Membuat task baru, menambahkannya ke state, dan memunculkan feedback toaster sukses.
  const handleCreateTask = useCallback(async (payload) => {
    setIsCreating(true)
    setActionError('')
    try {
      const newTask = await apiCreateTask(payload)
      // Pertahankan urutan ID ascending agar posisi task tetap stabil di UI.
      setTasks((prev) => [...prev, newTask].sort((a, b) => a.id - b.id))
      const successMsg = `Task "${newTask.title}" created successfully.`
      setActionSuccess(successMsg)
      showSuccess(successMsg)
      return newTask
    } catch (err) {
      const errorMsg = err.message || 'Failed to create task.'
      setActionError(errorMsg)
      showError(errorMsg)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [showSuccess, showError])

  // Memperbarui task di database dan mengupdate state lokal tanpa reload halaman.
  const handleUpdateTask = useCallback(async (taskId, payload, options = {}) => {
    setUpdatingTaskId(taskId)
    setActionError('')
    try {
      const updated = await apiUpdateTask(taskId, payload)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
      // Tampilkan toaster sukses hanya jika aksi tidak di-set silent (misal: bukan drag & drop)
      if (!options.silent) {
        const successMsg = `Task #${taskId} updated successfully.`
        setActionSuccess(successMsg)
        showSuccess(successMsg)
      }
      return updated
    } catch (err) {
      const errorMsg = err.message || 'Failed to update task.'
      setActionError(errorMsg)
      showError(errorMsg)
      throw err
    } finally {
      setUpdatingTaskId(null)
    }
  }, [showSuccess, showError])

  // Menghapus task dari database dan mengeluarkan task tersebut dari state lokal.
  const handleDeleteTask = useCallback(async (taskId) => {
    setDeletingTaskId(taskId)
    setActionError('')
    try {
      await apiDeleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      const successMsg = `Task #${taskId} deleted successfully.`
      setActionSuccess(successMsg)
      showSuccess(successMsg)
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete task.'
      setActionError(errorMsg)
      showError(errorMsg)
      throw err
    } finally {
      setDeletingTaskId(null)
    }
  }, [showSuccess, showError])

  // Hitung jumlah task per status menggunakan useMemo agar efisien saat render ulang.
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'Todo').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    }
  }, [tasks])

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

  // Logika visibilitas form: form wajib terbuka jika belum ada task sama sekali
  const hasTasks = tasks.length > 0
  const isFormOpen = !hasTasks || showCreateForm
  const canHideForm = hasTasks

  const toggleForm = useCallback(() => {
    if (!hasTasks) return
    setShowCreateForm((prev) => !prev)
  }, [hasTasks])

  const closeForm = useCallback(() => {
    if (hasTasks) {
      setShowCreateForm(false)
    }
  }, [hasTasks])

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true)
    setTimeout(() => {
      const titleInput = document.getElementById('create-task-title')
      if (titleInput) {
        titleInput.focus()
        titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 50)
  }, [])

  return {
    // Data states
    tasks,
    displayedTasks,
    stats,
    loading,
    loadError,
    actionError,
    actionSuccess,
    isCreating,
    updatingTaskId,
    deletingTaskId,

    // CRUD Actions
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    retryLoad,
    clearActionError: () => setActionError(''),
    clearActionSuccess: () => setActionSuccess(''),

    // Search & Filter Controller states
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,

    // Form Presentation & Visibility states
    isFormOpen,
    canHideForm,
    toggleForm,
    closeForm,
    openCreateForm,

    // Toaster states & methods
    toasts,
    removeToast,
    showSuccess,
    showError,
    clearToasts,
  }
}

export default useTasks
