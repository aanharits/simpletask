import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTasks } from '../hooks/useTasks'
import { apiClient } from '../api/client'

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Desc 1', status: 'Todo' },
  { id: 2, title: 'Task 2', description: 'Desc 2', status: 'In Progress' },
]

describe('useTasks Custom Hook Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads tasks on mount and computes stats accurately', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockTasks })

    const { result } = renderHook(() => useTasks())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.stats).toEqual({
      total: 2,
      todo: 1,
      inProgress: 1,
      done: 0,
    })
  })

  it('handles load error and allows retrying', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Connection Failed'))

    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loadError).toBe('Connection Failed')
    })
    expect(result.current.loading).toBe(false)

    // Now mock success on retry
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockTasks })

    await act(async () => {
      await result.current.retryLoad()
    })

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.loadError).toBe('')
  })

  it('creates task and appends in sorted order', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { id: 3, title: 'Task 3', description: '', status: 'Done' },
    })

    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.createTask({ title: 'Task 3', description: '', status: 'Done' })
    })

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.tasks[1].id).toBe(3)
    expect(result.current.actionSuccess).toContain('Task 3')
  })

  it('updates task in-place and clears updatingTaskId', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'put').mockResolvedValue({
      data: { ...mockTasks[0], status: 'Done' },
    })

    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.updateTask(1, { status: 'Done' })
    })

    expect(result.current.tasks[0].status).toBe('Done')
    expect(result.current.updatingTaskId).toBeNull()
  })

  it('deletes task and removes from list', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: null })

    const { result } = renderHook(() => useTasks())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteTask(1)
    })

    expect(result.current.tasks).toHaveLength(0)
    expect(result.current.deletingTaskId).toBeNull()
  })
})
