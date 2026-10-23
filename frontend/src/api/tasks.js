/**
 * Task Tracker API Service.
 *
 * Provides domain-specific CRUD operations for tasks using the
 * custom Axios apiClient instance.
 */

import apiClient, { normalizeError } from './client'

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

// Re-export apiClient and normalizeError for convenience or testing
export { apiClient, normalizeError }
