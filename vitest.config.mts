import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node', // Pure function tests — no DOM needed for Phase 1
    // Component tests (Phase 3+): add @vitest-environment jsdom comment per file
  },
})
