from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from datetime import datetime

from app.api.v1.api import api_router
from app.core.config import settings
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
from app.core.exception_handlers import (
    app_exception_handler,
    not_found_exception_handler,
    validation_exception_handler,
    permission_exception_handler,
    authentication_exception_handler,
    conflict_exception_handler,
    rate_limit_exception_handler,
    service_unavailable_exception_handler,
    http_exception_handler,
    validation_request_exception_handler,
)
from app.core.middleware import RequestLoggingMiddleware, AuditLogMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    version="1.0.0",
    description="""
    Learning Management System API.
    
    Features:
    * Course Management (B2B and D2C)
    * User Management with Role-Based Access Control
    * School Management for B2B
    * Progress Tracking
    * Content Versioning
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add logging and audit middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(AuditLogMiddleware)

# Add exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(NotFoundException, not_found_exception_handler)
app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(PermissionError, permission_exception_handler)
app.add_exception_handler(AuthenticationError, authentication_exception_handler)
app.add_exception_handler(ConflictError, conflict_exception_handler)
app.add_exception_handler(RateLimitError, rate_limit_exception_handler)
app.add_exception_handler(ServiceUnavailableError, service_unavailable_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_request_exception_handler)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    """
    Root endpoint.
    """
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Returns basic system health metrics.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 