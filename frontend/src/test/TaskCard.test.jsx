import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from '../components/TaskCard'

const mockTask = {
  id: 10,
  title: 'Refactor TaskCard architecture',
  description: 'Decompose monolithic card into modular components',
  status: 'In Progress',
}

describe('TaskCard Component Unit Tests', () => {
  it('renders task title, description, and status badge properly', () => {
    render(<TaskCard task={mockTask} onUpdate={vi.fn()} onDelete={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: 'Refactor TaskCard architecture' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Decompose monolithic card into modular components')
    ).toBeInTheDocument()
    expect(screen.getByText('ID #10')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('triggers quick status update when dropdown is changed', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn().mockResolvedValue({})

    render(<TaskCard task={mockTask} onUpdate={handleUpdate} onDelete={vi.fn()} />)

    const select = screen.getByRole('combobox', {
      name: /change status for task/i,
    })
    await user.selectOptions(select, 'Done')

    expect(handleUpdate).toHaveBeenCalledWith(
      10,
      { status: 'Done' },
      { silent: true }
    )
  })

  it('toggles edit mode on clicking Edit button and allows cancel', async () => {
    const user = userEvent.setup()
    render(<TaskCard task={mockTask} onUpdate={vi.fn()} onDelete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit task/i }))

    expect(screen.getByText('Editing Task #10')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByText('Editing Task #10')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Refactor TaskCard architecture' })
    ).toBeInTheDocument()
  })

  it('handles two-step delete confirmation flow', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn().mockResolvedValue({})

    render(<TaskCard task={mockTask} onUpdate={vi.fn()} onDelete={handleDelete} />)

    await user.click(screen.getByRole('button', { name: /delete task/i }))

    expect(screen.getByText('Delete?')).toBeInTheDocument()
    const confirmButton = screen.getByRole('button', { name: /yes, delete/i })
    expect(confirmButton).toBeInTheDocument()

    await user.click(confirmButton)
    expect(handleDelete).toHaveBeenCalledWith(10)
  })

  it('displays error alert if update fails', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn().mockRejectedValue(new Error('Network failure'))

    render(<TaskCard task={mockTask} onUpdate={handleUpdate} onDelete={vi.fn()} />)

    const select = screen.getByRole('combobox', {
      name: /change status for task/i,
    })
    await user.selectOptions(select, 'Done')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Network failure')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /dismiss error/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
