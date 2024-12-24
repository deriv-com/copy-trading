import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthorize from '../src/hooks/useAuthorize';

// Mock the dependent hooks
const mockSendMessage = vi.fn((message, callback) => {
  // Store the callback for later use
  mockSendMessage.lastCallback = callback;
});
const mockClose = vi.fn();
const mockClearAccounts = vi.fn();

vi.mock('../src/hooks/useWebSocket', () => ({
  default: () => ({
    isConnected: true,
    sendMessage: mockSendMessage,
    close: mockClose
  })
}));

vi.mock('../src/hooks/useDerivAccounts', () => ({
  default: () => ({
    defaultAccount: { token: 'test-token' },
    clearAccounts: mockClearAccounts
  })
}));

describe('useAuthorize', () => {
  beforeEach(() => {
    // Reset the module state and mocks before each test
    vi.clearAllMocks();
    // Reset the global variables by re-importing the module
    vi.resetModules();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthorize());
    
    expect(result.current).toEqual({
      isAuthorized: false,
      authError: null,
      isConnected: true
    });
  });

  it('should send authorize message when connected with token', () => {
    renderHook(() => useAuthorize());
    
    expect(mockSendMessage).toHaveBeenCalledWith(
      { authorize: 'test-token' },
      expect.any(Function)
    );
  });

  it('should handle successful authorization', async () => {
    const { result } = renderHook(() => useAuthorize());
    
    // Simulate successful authorization response
    await act(async () => {
      mockSendMessage.lastCallback({});  // No error means success
    });
    
    expect(result.current.isAuthorized).toBe(true);
    expect(result.current.authError).toBe(null);
  });

  it('should handle failed authorization', async () => {
    const { result } = renderHook(() => useAuthorize());
    
    const error = { code: 'InvalidToken', message: 'Token is invalid' };
    
    // Simulate failed authorization response
    await act(async () => {
      mockSendMessage.lastCallback({ error });
    });
    
    expect(result.current.isAuthorized).toBe(false);
    expect(result.current.authError).toBe(error);
    expect(mockClearAccounts).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });
});
