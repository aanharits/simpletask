import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import useTasks from '@/hooks/useTasks'
import { apiClient } from '@/api/client'

const tasks = [
  { id: 1, title: 'First', status: 'Todo' },
  { id: 2, title: 'Second', status: 'Todo' },
]
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

describe('useTasks concurrent mutations', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: tasks })
  })

  it.each(['update', 'delete'])('tracks concurrent %s requests independently, including failures', async (action) => {
    const first = deferred()
    const second = deferred()
    vi.spyOn(apiClient, action === 'update' ? 'put' : 'delete')
      .mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const pendingKey = action === 'update' ? 'updatingTaskIds' : 'deletingTaskIds'
    let one, two
    act(() => {
      one = result.current[action + 'Task'](1, { status: 'Done' }).catch((error) => error)
      two = result.current[action + 'Task'](2, { status: 'Done' })
    })
    expect([...result.current[pendingKey]]).toEqual([1, 2])
    await act(async () => {
      second.resolve({ data: { ...tasks[1], status: 'Done' } })
      await two
    })
    expect([...result.current[pendingKey]]).toEqual([1])
    await act(async () => {
      first.reject(new Error('Failed'))
      await one
    })
    expect(result.current[pendingKey].size).toBe(0)
    expect(result.current.tasks.find((task) => task.id === 1)).toEqual(tasks[0])
  })

  it('blocks a second mutation for the same ID before the next render', async () => {
    const pending = deferred()
    const put = vi.spyOn(apiClient, 'put').mockReturnValue(pending.promise)
    const remove = vi.spyOn(apiClient, 'delete')
    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let update
    await act(async () => {
      update = result.current.updateTask(1, { status: 'Done' })
      await expect(result.current.deleteTask(1)).rejects.toThrow('already')
      await expect(result.current.updateTask(1, {})).rejects.toThrow('already')
    })
    expect(put).toHaveBeenCalledTimes(1)
    expect(remove).not.toHaveBeenCalled()
    await act(async () => {
      pending.resolve({ data: { ...tasks[0], status: 'Done' } })
      await update
    })
  })
})
