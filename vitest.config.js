import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 20000,
    hookTimeout: 20000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    maxConcurrency: 1,
    isolate: false,
    sequence: {
      hooks: 'list'
    },
    onConsoleLog: (log, type) => {
      // Ignore WebSocket configuration logs
      if (log.includes('WebSocket Configuration')) {
        return false;
      }
      return true;
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        '**/*.d.ts'
      ]
    }
  }
});
