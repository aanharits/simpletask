import { useState } from 'react'

export default function useTaskCard({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDraggable = true,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [itemError, setItemError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(task.status)

  // Sinkronkan status lokal saat status diubah server atau prop diperbarui.
  if (selectedStatus !== task.status && !isUpdating) {
    setSelectedStatus(task.status)
  }

  // Memperbarui status task saat dropdown status diubah pengguna.
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    if (newStatus === selectedStatus) return

    setSelectedStatus(newStatus)
    setItemError('')
    try {
      await onUpdate(task.id, { status: newStatus }, { silent: true })
    } catch (err) {
      setSelectedStatus(task.status)
      setItemError(err.message || 'Failed to update status.')
    }
  }

  // Menyimpan perubahan title, description, atau status dari form edit inline.
  const handleEditSubmit = async (formData) => {
    setItemError('')
    try {
      await onUpdate(task.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      })
      setIsEditing(false)
    } catch (err) {
      setItemError(err.message || 'Failed to update task.')
      throw err
    }
  }

  // Mengeksekusi penghapusan task dengan konfirmasi keamanan dua langkah.
  const handleDelete = async () => {
    setItemError('')
    try {
      await onDelete(task.id)
    } catch (err) {
      setItemError(err.message || 'Failed to delete task.')
      setShowConfirmDelete(false)
    }
  }

  // Menyiapkan data transfer saat kartu mulai di-drag.
  const handleDragStart = (e) => {
    if (!isDraggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', String(task.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  const startEditing = () => {
    setIsEditing(true)
    setItemError('')
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setItemError('')
  }

  const promptDelete = () => setShowConfirmDelete(true)
  const cancelDelete = () => setShowConfirmDelete(false)
  const clearError = () => setItemError('')

  return {
    isEditing,
    showConfirmDelete,
    itemError,
    selectedStatus,
    handleStatusChange,
    handleEditSubmit,
    handleDelete,
    handleDragStart,
    startEditing,
    cancelEditing,
    promptDelete,
    cancelDelete,
    clearError,
  }
}
