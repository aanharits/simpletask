/**
 * Custom Axios Client Instance
 *
 * Best Practices Implemented:
 * 1. Centralized baseURL configured from Vite environment variables.
 * 2. Sensible request timeout (10s) to prevent hanging requests.
 * 3. Default JSON content-type and accept headers.
 * 4. Request interceptor: Hook for attaching auth tokens / logging in future iterations.
 * 5. Response interceptor: Centralized error handling and FastAPI 422 error normalization.
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
  if (error?.isNormalized) {
    return error
  }

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
  normalized.isNormalized = true
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

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Pluggable for Authorization header when auth is introduced:
    // const token = localStorage.getItem('auth_token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(normalizeError(error))
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(normalizeError(error))
  }
)

export default apiClient
