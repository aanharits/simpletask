// Impor matchers jest-dom agar assertions seperti toBeInTheDocument tersedia di Vitest.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount komponen setelah setiap test selesai agar DOM tidak menumpuk antar-test.
afterEach(() => {
  cleanup()
})
