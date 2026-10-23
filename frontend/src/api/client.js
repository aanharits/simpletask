import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Format detail array 422 dari FastAPI atau pesan timeout agar menjadi pesan error yang user friendly.
export function normalizeError(error) {
  let message = 'An unexpected error occurred.'

  if (error.response?.data?.detail) {
    const detail = error.response.data.detail
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

export default apiClient
