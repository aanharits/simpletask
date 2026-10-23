import apiClient, { normalizeError } from './client'

// Mengambil seluruh data task dari backend via endpoint GET /tasks.
export async function getTasks() {
  try {
    const response = await apiClient.get('/tasks')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

// Mengirim payload task baru ke backend via endpoint POST /tasks.
export async function createTask(payload) {
  try {
    const response = await apiClient.post('/tasks', payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

// Memperbarui sebagian field task yang ditentukan via endpoint PUT /tasks/{taskId}.
export async function updateTask(taskId, payload) {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

// Menghapus task dari database backend via endpoint DELETE /tasks/{taskId}.
export async function deleteTask(taskId) {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`)
    return response.data || null
  } catch (error) {
    throw normalizeError(error)
  }
}

export { apiClient, normalizeError }
