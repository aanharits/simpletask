import { useState } from 'react'

// Controller drag-and-drop pada Board: melacak kolom yang sedang di-hover dan memindahkan status task saat di-drop.
export default function useBoardDragDrop({ onUpdate, isTaskBusy }) {
  const [dragOverStatus, setDragOverStatus] = useState(null)

  const getDropHandlers = (status) => ({
    onDragOver: (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (dragOverStatus !== status) setDragOverStatus(status)
    },
    onDragLeave: (e) => {
      // Abaikan event saat kursor berpindah ke elemen anak di dalam kolom yang sama.
      if (!e.currentTarget.contains(e.relatedTarget)) setDragOverStatus(null)
    },
    onDrop: async (e) => {
      e.preventDefault()
      setDragOverStatus(null)
      const taskId = Number(e.dataTransfer.getData('text/plain'))
      if (!taskId || isTaskBusy(taskId)) return

      try {
        await onUpdate(taskId, { status }, { silent: true })
      } catch {
        // Feedback error sudah ditampilkan controller melalui toast.
      }
    },
  })

  return { dragOverStatus, getDropHandlers }
}
