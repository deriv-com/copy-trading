import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks', // Use process isolation
    poolOptions: {
      threads: {
        singleThread: true // Run in single thread to avoid memory issues
      }
    },
    maxConcurrency: 1, // Run tests serially
    maxThreads: 1,
    minThreads: 1
  }
});
