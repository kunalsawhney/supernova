/**
 * Utility functions for testing services
 */
import { vi } from 'vitest';
import { api } from '@/lib/api';
import { apiCache } from './caching';

/**
 * Mock the API module for testing
 */
export function mockApi() {
  return {
    get: vi.spyOn(api, 'get').mockImplementation(),
    post: vi.spyOn(api, 'post').mockImplementation(),
    put: vi.spyOn(api, 'put').mockImplementation(),
    patch: vi.spyOn(api, 'patch').mockImplementation(),
    delete: vi.spyOn(api, 'delete').mockImplementation(),
  };
}

/**
 * Reset all API mocks
 */
export function resetApiMocks() {
  vi.resetAllMocks();
}

/**
 * Clear the API cache for testing
 */
export function clearApiCache() {
  apiCache.clear();
}

/**
 * Create a mock API response
 */
export function createMockApiResponse<T>(data: T, status = 200, message?: string) {
  return {
    data,
    status,
    message,
  };
}

/**
 * Create a mock API error
 */
export function createMockApiError(message = 'An error occurred', status = 500, errors?: Record<string, string[]>) {
  const error = new Error(message) as any;
  error.response = {
    data: {
      message,
      status,
      errors,
    },
    status,
  };
  return error;
}

/**
 * Wait for all promises to resolve
 */
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Mock the localStorage for testing
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    length: Object.keys(store).length,
  };
}

/**
 * Mock the fetch API for testing
 */
export function mockFetch(response?: any) {
  return vi.fn().mockImplementation(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      headers: new Headers(),
      status: 200,
      statusText: 'OK',
    })
  );
} 