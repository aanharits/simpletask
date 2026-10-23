// Extend Vitest matchers with jest-dom assertions (e.g. toBeInTheDocument).
// The vitest import is needed so @testing-library/jest-dom can access expect.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Automatically unmount rendered components after each test
afterEach(() => {
  cleanup()
})
