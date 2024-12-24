import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';

// Mock matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock WebSocket
global.WebSocket = class MockWebSocket {
  constructor() {
    this.readyState = 0;
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
    }, 0);
  }
  send() {}
  close() {
    this.readyState = 3;
    this.onclose?.();
  }
};

// Reset global WebSocket state between tests
beforeEach(() => {
  try {
    global.isAuthorizedGlobal = false;
    global.globalWs = null;
    global.responseHandlers = new Set();
  } catch (error) {
    console.error('Error in beforeEach:', error);
  }
});

// Clean up WebSocket connections after each test
afterEach(() => {
  try {
    if (global.globalWs) {
      global.globalWs.close();
      global.globalWs = null;
    }
    global.isAuthorizedGlobal = false;
    global.responseHandlers = new Set();

    // Clear all mocks
    vi.clearAllMocks();
    vi.clearAllTimers();
  } catch (error) {
    console.error('Error in afterEach:', error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
