/**
 * Enhanced error handling utilities for the application
 */

/**
 * Error types for better categorization
 */
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  AUTH: "AUTH_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  SERVER: "SERVER_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * Maps HTTP status codes to error types
 */
const STATUS_TO_ERROR_TYPE = {
  400: ERROR_TYPES.VALIDATION,
  401: ERROR_TYPES.AUTH,
  403: ERROR_TYPES.AUTH,
  404: ERROR_TYPES.SERVER,
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.NETWORK,
  503: ERROR_TYPES.NETWORK,
  504: ERROR_TYPES.NETWORK,
};

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]:
    "Errore di connessione. Controlla la tua connessione internet e riprova.",
  [ERROR_TYPES.AUTH]: "Sessione scaduta. Effettua nuovamente l'accesso.",
  [ERROR_TYPES.VALIDATION]:
    "I dati inseriti non sono validi. Controlla e riprova.",
  [ERROR_TYPES.SERVER]: "Errore del server. Riprova più tardi.",
  [ERROR_TYPES.UNKNOWN]:
    "Si è verificato un errore imprevisto. Riprova più tardi.",
};

/**
 * Creates a standardized error object
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, originalError = null) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Handles and formats API errors
 */
export function handleApiError(error, context = "") {
  console.error(`API Error in ${context}:`, error);

  // Network errors
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return new AppError(
      ERROR_MESSAGES[ERROR_TYPES.NETWORK],
      ERROR_TYPES.NETWORK,
      error
    );
  }

  // HTTP errors
  if (error.status) {
    const errorType = STATUS_TO_ERROR_TYPE[error.status] || ERROR_TYPES.SERVER;
    const message = error.message || ERROR_MESSAGES[errorType];
    return new AppError(message, errorType, error);
  }

  // Custom app errors
  if (error instanceof AppError) {
    return error;
  }

  // Unknown errors
  return new AppError(
    error.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
    ERROR_TYPES.UNKNOWN,
    error
  );
}

/**
 * Determines if an error should trigger a logout
 */
export function shouldLogout(error) {
  return (
    error.type === ERROR_TYPES.AUTH &&
    (error.originalError?.status === 401 || error.originalError?.status === 403)
  );
}

/**
 * Logs errors to the console with structured format
 */
export function logError(error, context = "") {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    type: error.type || "UNKNOWN",
    message: error.message,
    stack: error.stack,
    originalError: error.originalError,
  };

  console.error("Application Error:", logData);
}

/**
 * Shows user-friendly error notifications
 */
export function showErrorNotification(error, notificationHandler = alert) {
  const message =
    error instanceof AppError
      ? error.message
      : ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

  notificationHandler(message);
}
