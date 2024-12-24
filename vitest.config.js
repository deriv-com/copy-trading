import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'vmThreads', // Use VM threads instead of worker threads
    poolOptions: {
      vmThreads: {
        singleThread: true
      }
    },
    maxConcurrency: 1,
    maxThreads: 1,
    minThreads: 1,
    isolate: false, // Disable test isolation
    sequence: {
      hooks: 'list' // Run hooks in sequence
    },
    onConsoleLog: (log, type) => {
      // Ignore WebSocket configuration logs
      if (log.includes('WebSocket Configuration')) {
        return false;
      }
      return true;
    }
  }
});
