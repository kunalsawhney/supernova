"""Custom exceptions for the application."""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base exception for all application exceptions."""
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.data = data or {}
        super().__init__(self.message)


class NotFoundException(AppException):
    """Exception raised when a resource is not found."""
    def __init__(
        self,
        message: str = "Resource not found",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=404, data=data)


class ValidationError(AppException):
    """Exception raised for validation errors."""
    def __init__(
        self,
        message: str = "Validation error",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=400, data=data)


class PermissionError(AppException):
    """Exception raised for permission errors."""
    def __init__(
        self,
        message: str = "Permission denied",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=403, data=data)


class AuthenticationError(AppException):
    """Exception raised for authentication errors."""
    def __init__(
        self,
        message: str = "Authentication failed",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=401, data=data)


class ConflictError(AppException):
    """Exception raised for conflict errors."""
    def __init__(
        self,
        message: str = "Resource conflict",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=409, data=data)


class RateLimitError(AppException):
    """Exception raised when rate limit is exceeded."""
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=429, data=data)


class ServiceUnavailableError(AppException):
    """Exception raised when a service is unavailable."""
    def __init__(
        self,
        message: str = "Service unavailable",
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(message, status_code=503, data=data) 