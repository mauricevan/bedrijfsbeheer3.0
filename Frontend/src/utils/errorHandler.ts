// Note: useToast is imported dynamically to avoid circular dependencies
// Import it in components that use useErrorHandler

/**
 * Centralized error handling utility
 * Provides consistent error handling across the application
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Logs error to console and optionally to error reporting service
 */
export const logError = (error: Error | unknown, context?: ErrorContext) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[${context?.component || 'App'}]`, {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });

  // TODO: Add error reporting service integration (e.g., Sentry, LogRocket)
  // if (process.env.NODE_ENV === 'production') {
  //   errorReportingService.captureException(error, { extra: context });
  // }
};

/**
 * Handles error and shows toast notification
 * Use this in components with access to toast context
 */
export const handleError = (
  error: Error | unknown,
  context?: ErrorContext,
  showToast?: (message: string, type?: 'error' | 'success' | 'info') => void
) => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Er is een onverwachte fout opgetreden';

  logError(error, context);

  if (showToast) {
    showToast(errorMessage, 'error');
  } else {
    // Fallback to alert if toast context not available
    alert(errorMessage);
  }
};

/**
 * Creates an error handler function for use in components
 * Usage:
 *   const { showToast } = useToast();
 *   const handleError = useErrorHandler(showToast);
 */
export const useErrorHandler = (showToast: (message: string, type?: 'error' | 'success' | 'info') => void) => {
  return (error: Error | unknown, context?: ErrorContext) => {
    handleError(error, context, showToast);
  };
};

/**
 * Wraps async functions with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext,
  showToast?: (message: string, type?: 'error' | 'success' | 'info') => void
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, showToast);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }) as T;
};

/**
 * Formats error message for display
 */
export const formatErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message || 'Er is een onverwachte fout opgetreden';
  }
  return String(error) || 'Er is een onverwachte fout opgetreden';
};

