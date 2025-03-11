import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

import logging
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        *,
        exclude_paths: set[str] = None
    ) -> None:
        super().__init__(app)
        self.exclude_paths = exclude_paths or {"/health", "/metrics"}

    async def dispatch(
        self,
        request: Request,
        call_next: Callable
    ) -> Response:
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Start timer
        start_time = time.time()
        
        # Get request body
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.json()
            except:
                body = await request.body()

        # Log request
        logger.info(
            "Request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_host": request.client.host if request.client else None,
                "body": body
            }
        )

        # Process request
        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # Log response
            logger.info(
                "Response",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "process_time": f"{process_time:.3f}s"
                }
            )

            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}s"

            return response

        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                "Request failed",
                extra={
                    "request_id": request_id,
                    "error": str(e),
                    "process_time": f"{process_time:.3f}s"
                }
            )
            raise

class AuditLogMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        *,
        exclude_paths: set[str] = None
    ) -> None:
        super().__init__(app)
        self.exclude_paths = exclude_paths or {"/health", "/metrics"}
        self.audit_logger = logging.getLogger("audit")
        self.audit_logger.setLevel(logging.INFO)

    async def dispatch(
        self,
        request: Request,
        call_next: Callable
    ) -> Response:
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Only audit write operations
        if request.method not in ["POST", "PUT", "PATCH", "DELETE"]:
            return await call_next(request)

        try:
            user = request.state.current_user
            user_id = user.id if user else None
            user_role = user.role if user else None
        except:
            user_id = None
            user_role = None

        # Log audit event
        self.audit_logger.info(
            "Audit event",
            extra={
                "request_id": getattr(request.state, "request_id", None),
                "user_id": user_id,
                "user_role": user_role,
                "method": request.method,
                "path": request.url.path,
                "client_host": request.client.host if request.client else None
            }
        )

        return await call_next(request) 