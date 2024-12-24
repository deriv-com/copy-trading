import '@testing-library/jest-dom';

// Mock matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Reset global WebSocket state between tests
beforeEach(() => {
  global.isAuthorizedGlobal = false;
  global.globalWs = null;
  global.responseHandlers = new Set();
});

// Clean up WebSocket connections after each test
afterEach(() => {
  if (global.globalWs) {
    global.globalWs.close();
    global.globalWs = null;
  }
  global.isAuthorizedGlobal = false;
  global.responseHandlers = new Set();
});
