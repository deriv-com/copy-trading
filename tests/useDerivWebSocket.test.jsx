import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useDerivWebSocket from '../src/hooks/useDerivWebSocket';
import useDerivAccounts from '../src/hooks/useDerivAccounts';
import { getConfig } from '../src/config';

// Define WebSocket constants if not available in test environment
const WS_CONSTANTS = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WS_CONSTANTS.CONNECTING;
    this.CONNECTING = WS_CONSTANTS.CONNECTING;
    this.OPEN = WS_CONSTANTS.OPEN;
    this.CLOSING = WS_CONSTANTS.CLOSING;
    this.CLOSED = WS_CONSTANTS.CLOSED;
    
    // Simulate connection after creation
    setTimeout(() => {
      this.readyState = WS_CONSTANTS.OPEN;
      this.onopen?.();
    }, 0);
  }

  send(data) {
    this.lastSentMessage = JSON.parse(data);
    // Simulate responses based on the message type
    setTimeout(() => {
      if (this.lastSentMessage.authorize) {
        this.onmessage?.({
          data: JSON.stringify({
            msg_type: 'authorize',
            authorize: {
              email: 'test@example.com',
              currency: 'USD'
            }
          })
        });
      } else if (this.lastSentMessage.get_settings) {
        this.onmessage?.({
          data: JSON.stringify({
            msg_type: 'get_settings',
            get_settings: {
              email: 'test@example.com',
              currency: 'USD'
            }
          })
        });
      }
    }, 0);
  }

  close() {
    this.readyState = WS_CONSTANTS.CLOSED;
    this.onclose?.();
  }
}

// Mock dependencies
vi.mock('../src/hooks/useDerivAccounts', () => ({
  default: () => ({
    defaultAccount: { token: 'test-token' },
    clearAccounts: vi.fn()
  })
}));

vi.mock('../src/config', () => ({
  getConfig: () => ({
    WS_URL: 'wss://test.deriv.com',
    APP_ID: '1234'
  })
}));

// Mock WebSocket globally
global.WebSocket = MockWebSocket;

describe('useDerivWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global state
    vi.mock('../src/hooks/useDerivWebSocket', async () => {
      const actual = await vi.importActual('../src/hooks/useDerivWebSocket');
      return {
        ...actual,
        globalWs: null,
        isAuthorizedGlobal: false,
        responseHandlers: new Set()
      };
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDerivWebSocket());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.settings).toBe(null);
    expect(result.current.wsResponse).toBe(null);
  });

  it('should connect to WebSocket and authorize', async () => {
    const { result } = renderHook(() => useDerivWebSocket());
    
    // Wait for connection and authorization
    await vi.waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    expect(result.current.socket).toBeDefined();
    expect(result.current.socket.lastSentMessage).toEqual({
      authorize: 'test-token'
    });
  });

  it('should fetch settings after successful authorization', async () => {
    const { result } = renderHook(() => useDerivWebSocket());
    
    // Wait for settings to be loaded
    await vi.waitFor(() => {
      expect(result.current.settings).toEqual({
        email: 'test@example.com',
        currency: 'USD'
      });
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle authorization failure', async () => {
    const mockClearAccounts = vi.fn();
    vi.mocked(useDerivAccounts).mockReturnValue({
      defaultAccount: { token: 'invalid-token' },
      clearAccounts: mockClearAccounts
    });

    const { result } = renderHook(() => useDerivWebSocket());
    
    // Simulate authorization failure
    await act(async () => {
      result.current.socket.onmessage?.({
        data: JSON.stringify({
          msg_type: 'authorize',
          error: {
            code: 'InvalidToken',
            message: 'Token is invalid'
          }
        })
      });
    });

    // After first failure, it should retry
    expect(result.current.isConnected).toBe(false);

    // Simulate second failure
    await act(async () => {
      result.current.socket.onmessage?.({
        data: JSON.stringify({
          msg_type: 'authorize',
          error: {
            code: 'InvalidToken',
            message: 'Token is invalid'
          }
        })
      });
    });

    // After second failure, it should clear accounts
    expect(mockClearAccounts).toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });

  it('should handle connection close', async () => {
    const { result } = renderHook(() => useDerivWebSocket());
    
    // Wait for initial connection
    await vi.waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Simulate connection close
    await act(async () => {
      result.current.socket.close();
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('should send requests when connected', async () => {
    const { result } = renderHook(() => useDerivWebSocket());
    
    // Wait for connection
    await vi.waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Send a test request
    await act(async () => {
      result.current.sendRequest({ ping: 1 });
    });

    expect(result.current.socket.lastSentMessage).toEqual({ ping: 1 });
  });
});
