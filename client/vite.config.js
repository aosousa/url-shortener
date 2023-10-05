import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportOnFailure: true,
      reportsDirectory: './tests/coverage'
    },
    globals: true,
    setupFiles: ['src/tests/setup.js']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
