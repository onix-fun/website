import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'styled-components', 'lucide-react'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    server: {
      deps: {
        // The linked kit has its own node_modules; transform its React-using
        // dependencies so resolve.dedupe can keep a single React instance.
        inline: [/@onix\/ui-kit/, /@base-ui\//, /styled-components/, /lucide-react/],
      },
    },
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    clearMocks: true,
    css: false,
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
})
