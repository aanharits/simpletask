import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskBoard from '@/components/task/TaskBoard'

const task = { id: 1, title: 'First', description: '', status: 'Todo' }

describe('TaskBoard drag requests', () => {
  it.each(['updatingTaskIds', 'deletingTaskIds'])('blocks drag and drop for %s', (pendingProp) => {
    const update = vi.fn()
    render(<TaskBoard tasks={[task]} onUpdate={update} onDelete={vi.fn()}
      onFilterChange={vi.fn()} {...{ [pendingProp]: new Set([1]) }} />)
    const card = screen.getByRole('listitem')
    expect(card).toHaveAttribute('draggable', 'false')
    expect(screen.getByRole('combobox')).toBeDisabled()
    const column = screen.getByRole('heading', { name: 'Done' }).closest('div.flex-col')
    fireEvent.drop(column, { dataTransfer: { getData: () => '1' } })
    expect(update).not.toHaveBeenCalled()
  })

  it('handles a rejected drop update without an unhandled rejection', async () => {
    const update = vi.fn().mockRejectedValue(new Error('Network failed'))
    render(<TaskBoard tasks={[task]} onUpdate={update} onDelete={vi.fn()}
      onFilterChange={vi.fn()} />)
    const column = screen.getByRole('heading', { name: 'Done' }).closest('div.flex-col')
    fireEvent.drop(column, { dataTransfer: { getData: () => '1' } })
    await waitFor(() => expect(update).toHaveBeenCalledWith(1, { status: 'Done' }, { silent: true }))
  })
})
