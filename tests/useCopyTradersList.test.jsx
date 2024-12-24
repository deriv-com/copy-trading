import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useWebSocket from '../src/hooks/useWebSocket';
import useAuthorize from '../src/hooks/useAuthorize';
import useCopyTradersList from '../src/hooks/useCopyTradersList';

// Mock the dependent hooks
const mockSendMessage = vi.fn((message, callback) => {
  // Store the callback for later use
  mockSendMessage.lastCallback = callback;
});

vi.mock('../src/hooks/useWebSocket', () => ({
  default: () => ({
    sendMessage: mockSendMessage,
    lastMessage: null,
    isConnected: true
  })
}));

vi.mock('../src/hooks/useAuthorize', () => ({
  default: () => ({
    isAuthorized: true,
    isConnected: true
  })
}));

describe('useCopyTradersList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty list', () => {
    const { result } = renderHook(() => useCopyTradersList());
    
    expect(result.current.traders).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch copy traders list when authorized', () => {
    renderHook(() => useCopyTradersList());
    
    expect(mockSendMessage).toHaveBeenCalledWith(
      { copytrading_list: 1 },
      expect.any(Function)
    );
  });

  it('should handle successful response', async () => {
    const mockResponse = {
      copytrading_list: {
        traders: [
          { id: '1', name: 'Trader 1' },
          { id: '2', name: 'Trader 2' }
        ],
        copiers: []
      }
    };

    const { result } = renderHook(() => useCopyTradersList());
    
    await act(async () => {
      mockSendMessage.lastCallback(mockResponse);
    });

    // Wait for next tick to allow state updates to complete
    await vi.waitFor(() => {
      expect(result.current.traders).toEqual(mockResponse.copytrading_list.traders);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle error response', async () => {
    const mockError = {
      error: {
        code: 'InvalidToken',
        message: 'Token is invalid'
      }
    };

    const { result } = renderHook(() => useCopyTradersList());
    
    await act(async () => {
      mockSendMessage.lastCallback(mockError);
    });

    // Wait for next tick to allow state updates to complete
    await vi.waitFor(() => {
      expect(result.current.traders).toEqual([]);
      expect(result.current.error).toBe(mockError.error.message);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
