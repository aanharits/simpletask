import { useState, useCallback, useRef, useEffect } from 'react'

// Hook mandiri untuk mengelola antrean notifikasi toaster secara fleksibel dan reaktif.
export function useToast() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  // Menghapus toaster spesifik berdasarkan id dan membersihkan timer terkait.
  const removeToast = useCallback((id) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id))
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Menambahkan toast baru ke antrean dengan durasi auto-dismiss yang dapat dikonfigurasi.
  const showToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      if (!message) return null

      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
      const newToast = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id)
        }, duration)
        timersRef.current.set(id, timer)
      }

      return id
    },
    [removeToast]
  )

  const showSuccess = useCallback(
    (message, duration = 4000) => showToast(message, 'success', duration),
    [showToast]
  )

  const showError = useCallback(
    (message, duration = 5000) => showToast(message, 'error', duration),
    [showToast]
  )

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current.clear()
    setToasts([])
  }, [])

  // Membersihkan seluruh timer yang masih berjalan saat hook di-unmount.
  useEffect(() => {
    const currentTimers = timersRef.current
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer))
      currentTimers.clear()
    }
  }, [])

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    removeToast,
    clearAll,
  }
}

export default useToast
