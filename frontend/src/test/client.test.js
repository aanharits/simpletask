import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, normalizeError } from '../api/client'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'

describe('Axios Client & Tasks Service Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('configures default headers and timeout properly', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
    expect(apiClient.defaults.headers.Accept).toBe('application/json')
    expect(apiClient.defaults.timeout).toBe(10000)
  })

  describe('normalizeError helper', () => {
    it('normalizes FastAPI 422 array detail', () => {
      const err = {
        response: {
          status: 422,
          data: {
            detail: [
              { msg: 'Field required' },
              { msg: 'Must be at least 1 character' },
            ],
          },
        },
      }
      const result = normalizeError(err)
      expect(result.message).toBe('Field required, Must be at least 1 character')
      expect(result.status).toBe(422)
    })

    it('normalizes string detail', () => {
      const err = {
        response: {
          status: 404,
          data: { detail: 'Task with ID 999 not found' },
        },
      }
      const result = normalizeError(err)
      expect(result.message).toBe('Task with ID 999 not found')
      expect(result.status).toBe(404)
    })

    it('handles connection timeout ECONNABORTED', () => {
      const err = { code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }
      const result = normalizeError(err)
      expect(result.message).toBe('Request timed out. Please try again later.')
    })

    it('falls back to error message if no response detail', () => {
      const err = new Error('Network Offline')
      const result = normalizeError(err)
      expect(result.message).toBe('Network Offline')
    })
  })

  describe('Tasks API service functions', () => {
    it('getTasks calls apiClient.get and returns data', async () => {
      const mockData = [{ id: 1, title: 'Test Task', status: 'Todo' }]
      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockData })

      const result = await getTasks()
      expect(apiClient.get).toHaveBeenCalledWith('/tasks')
      expect(result).toEqual(mockData)
    })

    it('createTask calls apiClient.post with payload', async () => {
      const payload = { title: 'New Task', description: 'Desc', status: 'Todo' }
      const created = { id: 10, ...payload }
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: created })

      const result = await createTask(payload)
      expect(apiClient.post).toHaveBeenCalledWith('/tasks', payload)
      expect(result).toEqual(created)
    })

    it('updateTask calls apiClient.put with ID and payload', async () => {
      const payload = { status: 'Done' }
      const updated = { id: 1, title: 'Existing', status: 'Done' }
      vi.spyOn(apiClient, 'put').mockResolvedValue({ data: updated })

      const result = await updateTask(1, payload)
      expect(apiClient.put).toHaveBeenCalledWith('/tasks/1', payload)
      expect(result).toEqual(updated)
    })

    it('deleteTask calls apiClient.delete with ID', async () => {
      vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: null })

      const result = await deleteTask(1)
      expect(apiClient.delete).toHaveBeenCalledWith('/tasks/1')
      expect(result).toBeNull()
    })
  })
})
