/**
 * API client module for interacting with the /tasks backend.
 * Uses browser fetch with clean error handling and response normalization.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Helper to handle fetch responses safely, avoiding JSON parsing errors on 204
 * and extracting user-facing error messages from 4xx/5xx responses.
 */
async function handleResponse(response) {
  if (response.status === 204) {
    return null
  }

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    let message = 'An unexpected error occurred.'
    if (data && data.detail) {
      if (Array.isArray(data.detail)) {
        // FastAPI validation errors
        message = data.detail.map((err) => err.msg || JSON.stringify(err)).join(', ')
      } else if (typeof data.detail === 'string') {
        message = data.detail
      }
    } else if (response.statusText) {
      message = response.statusText
    }
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

/**
 * Fetch all tasks ordered by ID ascending.
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      Accept: 'application/json',
    },
  })
  return handleResponse(response)
}

/**
 * Create a new task.
 * @param {Object} payload { title: string, description?: string, status?: string }
 * @returns {Promise<Object>} Created task with generated ID
 */
export async function createTask(payload) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

/**
 * Update one or more fields of an existing task.
 * @param {number} taskId
 * @param {Object} payload Partial task fields { title?, description?, status? }
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(taskId, payload) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

/**
 * Delete a task by ID.
 * @param {number} taskId
 * @returns {Promise<null>}
 */
export async function deleteTask(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}
