class ApplicationError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends ApplicationError {
  constructor(message, details = null) {
    super(message, 422, "VALIDATION_ERROR");
    this.details = details;
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class AuthorizationError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, 409, "CONFLICT");
  }
}

class DatabaseError extends ApplicationError {
  constructor(message = "Database error occurred") {
    super(message, 500, "DATABASE_ERROR");
  }
}

class ExternalServiceError extends ApplicationError {
  constructor(message = "External service error") {
    super(message, 502, "EXTERNAL_SERVICE_ERROR");
  }
}

export  {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
};
