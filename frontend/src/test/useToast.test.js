import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '../hooks/useToast'

describe('useToast Hook Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds and auto-dismisses a toast after specified duration', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Test notification', 'success', 3000)
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Test notification')
    expect(result.current.toasts[0].type).toBe('success')

    // Fast-forward time past 3000ms
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('shows success and error toasts via dedicated helpers', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess('Operation successful')
      result.current.showError('Operation failed')
    })

    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts[0].type).toBe('success')
    expect(result.current.toasts[0].message).toBe('Operation successful')
    expect(result.current.toasts[1].type).toBe('error')
    expect(result.current.toasts[1].message).toBe('Operation failed')
  })

  it('removes toast manually before timer expires', () => {
    const { result } = renderHook(() => useToast())

    let toastId
    act(() => {
      toastId = result.current.showSuccess('To be removed manually', 5000)
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.removeToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('clears all active toasts and timers', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess('Toast 1')
      result.current.showError('Toast 2')
    })

    expect(result.current.toasts).toHaveLength(2)

    act(() => {
      result.current.clearAll()
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
