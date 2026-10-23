import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { apiClient, normalizeError } from '../api/tasks'

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

describe('Task Tracker App Component Tests (with Axios)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders tasks loaded via Axios', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockTasks })

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
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/no tasks recorded yet/i)).toBeInTheDocument()
    })
  })

  it('validates required title on submit before network request', async () => {
    const user = userEvent.setup()
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] })
    const postSpy = vi.spyOn(apiClient, 'post')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, '    ')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(screen.getByText(/title cannot be empty/i)).toBeInTheDocument()
    expect(postSpy).not.toHaveBeenCalled()
  })

  it('creates a task via Axios POST and displays it in list without reload', async () => {
    const user = userEvent.setup()

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] })
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        id: 3,
        title: 'New Integration Test Task',
        description: 'Created from form',
        status: 'Todo',
      },
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

  it('updates task status through quick selector via Axios PUT', async () => {
    const user = userEvent.setup()

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'put').mockResolvedValue({
      data: {
        id: 1,
        title: 'Design API contract',
        description: 'Document endpoints and models',
        status: 'Done',
      },
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

  it('edits title and description in-place and saves via Axios PUT', async () => {
    const user = userEvent.setup()

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'put').mockImplementation((url, body) =>
      Promise.resolve({
        data: {
          ...mockTasks[0],
          ...body,
        },
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /edit task/i }))

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

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockTasks })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()
    })

    const inProgressPill = screen.getByRole('button', { name: /In Progress/i })
    await user.click(inProgressPill)

    expect(screen.queryByRole('heading', { name: 'Design API contract' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()

    const donePill = screen.getByRole('button', { name: /^Done/i })
    await user.click(donePill)

    expect(screen.getByText(/no tasks match the filter/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show all tasks/i }))
    expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Implement database models' })).toBeInTheDocument()
  })

  it('deletes a task after confirmation via Axios DELETE', async () => {
    const user = userEvent.setup()

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [mockTasks[0]] })
    vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: null })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Design API contract' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /delete task/i }))

    const confirmBtn = screen.getByRole('button', { name: /yes, delete/i })
    expect(confirmBtn).toBeInTheDocument()

    await user.click(confirmBtn)

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Design API contract' })).not.toBeInTheDocument()
    })
  })

  it('displays API error message when Axios request fails', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue({
      message: 'Network connection failed',
      response: {
        status: 500,
        data: { detail: 'Internal server error from database' },
      },
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/unable to load tasks/i)).toBeInTheDocument()
      expect(screen.getByText(/internal server error from database/i)).toBeInTheDocument()
    })
  })

  it('normalizes FastAPI validation array errors properly', () => {
    const axiosError = {
      response: {
        status: 422,
        data: {
          detail: [
            { msg: 'Title must not be empty' },
            { msg: 'Status must be Todo, In Progress, or Done' },
          ],
        },
      },
    }
    const err = normalizeError(axiosError)
    expect(err.message).toBe('Title must not be empty, Status must be Todo, In Progress, or Done')
    expect(err.status).toBe(422)
  })
})
