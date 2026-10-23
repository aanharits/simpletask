/**
 * Custom Axios Client Instance
 *
 * Configured with baseURL, sensible timeout, and default JSON headers.
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Normalizes Axios error responses into user-friendly Error objects.
 * Extracts FastAPI validation details (array of errors), string details, or timeout messages.
 *
 * @param {import('axios').AxiosError|Error|Object} error
 * @returns {Error} Normalized Error object with status and data attributes
 */
export function normalizeError(error) {
  let message = 'An unexpected error occurred.'

  if (error.response?.data?.detail) {
    const detail = error.response.data.detail
    // FastAPI 422 returns an array of validation errors: [{ loc: [...], msg: "...", type: "..." }]
    if (Array.isArray(detail)) {
      message = detail.map((err) => err.msg || JSON.stringify(err)).join(', ')
    } else if (typeof detail === 'string') {
      message = detail
    }
  } else if (error.code === 'ECONNABORTED') {
    message = 'Request timed out. Please try again later.'
  } else if (error.message) {
    message = error.message
  }

  const normalized = new Error(message)
  normalized.status = error.response?.status
  normalized.data = error.response?.data
  return normalized
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default apiClient
