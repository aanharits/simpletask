import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ToastContainer, { ToastItem } from '../components/Toast'

describe('Toast Component Tests', () => {
  it('renders single success toast item properly', async () => {
    const handleDismiss = vi.fn()
    const toast = { id: 't1', type: 'success', message: 'Task saved!' }

    render(<ToastItem toast={toast} onDismiss={handleDismiss} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Task saved!')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /dismiss notification/i }))

    expect(handleDismiss).toHaveBeenCalledWith('t1')
  })

  it('renders single error toast item with alert role', () => {
    const toast = { id: 't2', type: 'error', message: 'Failed to delete task' }

    render(<ToastItem toast={toast} onDismiss={vi.fn()} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to delete task')).toBeInTheDocument()
    expect(screen.getByText('Notice')).toBeInTheDocument()
  })

  it('renders nothing when ToastContainer has no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders multiple toasts in container', () => {
    const toasts = [
      { id: '1', type: 'success', message: 'Success msg' },
      { id: '2', type: 'error', message: 'Error msg' },
    ]

    render(<ToastContainer toasts={toasts} onDismiss={vi.fn()} />)

    expect(screen.getByText('Success msg')).toBeInTheDocument()
    expect(screen.getByText('Error msg')).toBeInTheDocument()
  })
})
