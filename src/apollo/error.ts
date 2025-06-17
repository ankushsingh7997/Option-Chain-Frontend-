import { ApolloError } from '@apollo/client';

// Interface for GraphQL error structure
interface GraphQLError {
  message: string;
  status?: boolean;
  code?: string;
  path?: string[];
}

// Interface for network error result
interface NetworkErrorResult {
  errors?: GraphQLError[];
  data?: any;
}

// Interface for network error
interface NetworkError {
  result?: NetworkErrorResult;
  message?: string;
  statusCode?: number;
}

/**
 * Extracts error message from Apollo GraphQL errors
 * @param error - ApolloError object
 * @param fallbackMessage - Default message if no specific error found
 * @returns Extracted error message
 */
export const extractErrorMessage = (
  error: ApolloError, 
  fallbackMessage: string = 'Something went wrong'
): string => {
  // Priority 1: Network error with result errors (for 401, 403, etc. with error details)
  if (error.networkError) {
    const networkError = error.networkError as NetworkError;
    
    if (networkError.result?.errors && networkError.result.errors.length > 0) {
      return networkError.result.errors[0].message || fallbackMessage;
    }
    
    // If network error has a specific message
    if (networkError.message) {
      return networkError.message;
    }
  }

  // Priority 2: GraphQL errors (for successful HTTP requests with GraphQL errors)
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message || fallbackMessage;
  }

  // Priority 3: General Apollo error message
  if (error.message) {
    return error.message;
  }

  // Fallback
  return fallbackMessage;
};

/**
 * Extracts all error messages from Apollo GraphQL errors
 * @param error - ApolloError object
 * @returns Array of all error messages
 */
export const extractAllErrorMessages = (error: ApolloError): string[] => {
  const messages: string[] = [];

  // Network error messages
  if (error.networkError) {
    const networkError = error.networkError as NetworkError;
    
    if (networkError.result?.errors) {
      networkError.result.errors.forEach(err => {
        if (err.message) messages.push(err.message);
      });
    } else if (networkError.message) {
      messages.push(networkError.message);
    }
  }

  // GraphQL error messages
  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(err => {
      if (err.message) messages.push(err.message);
    });
  }

  // General error message as fallback
  if (messages.length === 0 && error.message) {
    messages.push(error.message);
  }

  return messages.length > 0 ? messages : ['Something went wrong'];
};

/**
 * Extracts error code from Apollo GraphQL errors
 * @param error - ApolloError object
 * @returns Error code if available
 */
export const extractErrorCode = (error: ApolloError): string | null => {
  // Check network error for code
  if (error.networkError) {
    const networkError = error.networkError as NetworkError;
    
    if (networkError.result?.errors && networkError.result.errors.length > 0) {
      return networkError.result.errors[0].code || null;
    }
  }

  // Check GraphQL errors for code
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0] as any;
    return graphQLError.extensions?.code || graphQLError.code || null;
  }

  return null;
};

/**
 * Check if error is of specific type/code
 * @param error - ApolloError object
 * @param code - Error code to check for
 * @returns Boolean indicating if error matches the code
 */
export const isErrorOfType = (error: ApolloError, code: string): boolean => {
  const errorCode = extractErrorCode(error);
  return errorCode === code;
};

// Usage examples:
/*
// Basic usage
const errorMessage = extractErrorMessage(error, 'Login failed');

// Get all error messages
const allMessages = extractAllErrorMessages(error);

// Check error type
if (isErrorOfType(error, 'UNAUTHENTICATED')) {
  // Handle authentication error
}

// Get error code
const code = extractErrorCode(error);
*/