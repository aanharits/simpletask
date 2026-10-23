import apiClient, { normalizeError } from './client'

export async function getTasks() {
  try {
    const response = await apiClient.get('/tasks')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createTask(payload) {
  try {
    const response = await apiClient.post('/tasks', payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function updateTask(taskId, payload) {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`)
    return response.data || null
  } catch (error) {
    throw normalizeError(error)
  }
}

export { apiClient, normalizeError }
