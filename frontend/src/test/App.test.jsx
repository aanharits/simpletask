import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const mockTasks = [
  {
    id: 1,
    title: 'Design API contract',
    description: 'Document endpoints and models',
    status: 'Todo',
  },
  {
    id: 2,
    title: 'Implement database models',
    description: 'Use SQLModel with PostgreSQL',
    status: 'In Progress',
  },
]

describe('Task Tracker App Component Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders tasks loaded from API', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (url.includes('/tasks')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockTasks,
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()
    expect(screen.getByText('Document endpoints and models')).toBeInTheDocument()
    expect(screen.getAllByText('Todo').length).toBeGreaterThan(0)
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0)
  })

  it('displays empty state when no tasks are returned', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [],
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/no tasks recorded yet/i)).toBeInTheDocument()
    })
  })

  it('validates required title on submit', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [],
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, '    ')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument()
  })

  it('creates a task without reloading and displays it in list', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            id: 3,
            title: 'New Integration Test Task',
            description: 'Created from form',
            status: 'Todo',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => [],
      })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/title/i), 'New Integration Test Task')
    await user.type(screen.getByLabelText(/description/i), 'Created from form')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'New Integration Test Task' })).toBeInTheDocument()
    })
    expect(screen.getByText('Created from form')).toBeInTheDocument()
  })

  it('updates task status through quick selector', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
      if (options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            id: 1,
            title: 'Design API contract',
            description: 'Document endpoints and models',
            status: 'Done',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => [mockTasks[0]],
      })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })

    const statusSelect = screen.getByRole('combobox', { name: /change status for task/i })
    await user.selectOptions(statusSelect, 'Done')

    await waitFor(() => {
      expect(statusSelect).toHaveValue('Done')
    })
  })

  it('deletes a task after confirmation', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          status: 204,
          headers: new Headers(),
          json: async () => null,
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => [mockTasks[0]],
      })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })

    // Click Delete button
    await user.click(screen.getByRole('button', { name: /delete task/i }))

    // Confirm button appears
    const confirmBtn = screen.getByRole('button', { name: /yes, delete/i })
    expect(confirmBtn).toBeInTheDocument()

    await user.click(confirmBtn)

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Design API contract' })).not.toBeInTheDocument()
    })
  })

  it('edits title and description in-place and saves changes', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
      if (options?.method === 'PUT') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            ...mockTasks[0],
            ...body,
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => [mockTasks[0]],
      })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })

    // Click Edit button
    await user.click(screen.getByRole('button', { name: /edit task/i }))

    // Form inputs appear inside the item
    const editTitleInput = screen.getByDisplayValue('Design API contract')
    await user.clear(editTitleInput)
    await user.type(editTitleInput, 'Edited Contract Title')

    const editDescInput = screen.getByDisplayValue('Document endpoints and models')
    await user.clear(editDescInput)
    await user.type(editDescInput, 'Updated contract details')

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edited Contract Title' })).toBeInTheDocument()
    })
    expect(screen.getByText('Updated contract details')).toBeInTheDocument()
  })

  it('filters task list by status pill and restores all', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockTasks,
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()
    })

    // Click 'In Progress' filter pill
    const inProgressPill = screen.getByRole('button', { name: /In Progress/i })
    await user.click(inProgressPill)

    // Only 'Implement database models' should be visible
    expect(screen.queryByRole('heading', { name: 'Design API contract' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()

    // Click 'Done' filter pill (empty)
    const donePill = screen.getByRole('button', { name: /^Done/i })
    await user.click(donePill)

    expect(screen.getByText(/no tasks match the filter/i)).toBeInTheDocument()

    // Click 'Show all tasks'
    await user.click(screen.getByRole('button', { name: /show all tasks/i }))
    expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()
  })

  it('displays API error message when connection fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network connection failed'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/unable to load tasks/i)).toBeInTheDocument()
      expect(screen.getByText(/network connection failed/i)).toBeInTheDocument()
    })
  })
})
