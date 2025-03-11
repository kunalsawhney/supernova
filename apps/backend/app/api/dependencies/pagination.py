"""Pagination dependencies."""

from typing import Annotated

from fastapi import Query

class PaginationParams:
    """Pagination parameters."""

    def __init__(
        self,
        skip: Annotated[int, Query(ge=0)] = 0,
        limit: Annotated[int, Query(ge=1, le=100)] = 10
    ):
        """Initialize pagination parameters."""
        self.skip = skip
        self.limit = limit 