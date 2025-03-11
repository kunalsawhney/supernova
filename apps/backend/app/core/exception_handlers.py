"""Exception handlers for the application."""

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import (
    AppException,
    NotFoundException,
    ValidationError,
    PermissionError,
    AuthenticationError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError,
)


async def app_exception_handler(
    request: Request,
    exc: AppException
) -> JSONResponse:
    """Handler for all application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "data": exc.data,
        },
    )


async def not_found_exception_handler(
    request: Request,
    exc: NotFoundException
) -> JSONResponse:
    """Handler for not found exceptions."""
    return await app_exception_handler(request, exc)


async def validation_exception_handler(
    request: Request,
    exc: ValidationError
) -> JSONResponse:
    """Handler for validation exceptions."""
    return await app_exception_handler(request, exc)


async def permission_exception_handler(
    request: Request,
    exc: PermissionError
) -> JSONResponse:
    """Handler for permission exceptions."""
    return await app_exception_handler(request, exc)


async def authentication_exception_handler(
    request: Request,
    exc: AuthenticationError
) -> JSONResponse:
    """Handler for authentication exceptions."""
    return await app_exception_handler(request, exc)


async def conflict_exception_handler(
    request: Request,
    exc: ConflictError
) -> JSONResponse:
    """Handler for conflict exceptions."""
    return await app_exception_handler(request, exc)


async def rate_limit_exception_handler(
    request: Request,
    exc: RateLimitError
) -> JSONResponse:
    """Handler for rate limit exceptions."""
    return await app_exception_handler(request, exc)


async def service_unavailable_exception_handler(
    request: Request,
    exc: ServiceUnavailableError
) -> JSONResponse:
    """Handler for service unavailable exceptions."""
    return await app_exception_handler(request, exc)


async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException
) -> JSONResponse:
    """Handler for HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail)},
    )


async def validation_request_exception_handler(
    request: Request,
    exc: RequestValidationError
) -> JSONResponse:
    """Handler for request validation exceptions."""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
        },
    ) 