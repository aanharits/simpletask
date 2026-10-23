/**
 * API client module for interacting with the /tasks backend.
 * Uses Axios with baseURL configuration and normalized error handling.
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Normalizes Axios error responses into user-friendly Error objects.
 * Extracts FastAPI validation details (array of errors) or custom string details.
 */
export function normalizeError(error) {
  let message = 'An unexpected error occurred.'
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail
    if (Array.isArray(detail)) {
      message = detail.map((err) => err.msg || JSON.stringify(err)).join(', ')
    } else if (typeof detail === 'string') {
      message = detail
    }
  } else if (error.message) {
    message = error.message
  }

  const normalized = new Error(message)
  normalized.status = error.response?.status
  normalized.data = error.response?.data
  return normalized
}

/**
 * Fetch all tasks ordered by ID ascending.
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasks() {
  try {
    const response = await apiClient.get('/tasks')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

/**
 * Create a new task.
 * @param {Object} payload { title: string, description?: string, status?: string }
 * @returns {Promise<Object>} Created task with generated ID
 */
export async function createTask(payload) {
  try {
    const response = await apiClient.post('/tasks', payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

/**
 * Update one or more fields of an existing task.
 * @param {number} taskId
 * @param {Object} payload Partial task fields { title?, description?, status? }
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(taskId, payload) {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, payload)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

/**
 * Delete a task by ID.
 * @param {number} taskId
 * @returns {Promise<null>}
 */
export async function deleteTask(taskId) {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`)
    return response.data || null
  } catch (error) {
    throw normalizeError(error)
  }
}
