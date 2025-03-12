/**
 * Error handling utilities for the application
 */

// Custom API error class
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Checks if an error is an instance of ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Formats an error message based on the type of error
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Handles API errors in a standardized way
 * @param error The error to handle
 * @param defaultMessage Default message to show if error doesn't have a message
 * @returns Formatted error message
 */
export function handleApiError(error: unknown, defaultMessage: string = 'An error occurred'): Error {
  // Log the error for debugging
  console.error('API Error:', error);
  
  // If it's already an Error instance, just return it
  if (error instanceof Error) {
    return error;
  }
  
  // If it's a string, create a new Error with the string as message
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  // For other types, return a generic error with the default message
  return new Error(defaultMessage);
}

/**
 * Logs an error to the console (and potentially to a monitoring service in the future)
 * @param error The error to log
 * @param context Additional context about the error
 */
export function logError(error: unknown, context: Record<string, any> = {}): void {
  console.error('Error:', error);
  
  if (Object.keys(context).length > 0) {
    console.error('Context:', context);
  }
  
  // In the future, this could send errors to a monitoring service like Sentry
}

/**
 * Creates a standardized error object
 * @param message Error message
 * @param status HTTP status code
 * @param errors Additional validation errors
 * @returns ApiError instance
 */
export function createError(message: string, status: number = 500, errors?: Record<string, string[]>): ApiError {
  return new ApiError(message, status, errors);
} 