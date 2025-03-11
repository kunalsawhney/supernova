"""Base service class and utilities."""

from typing import Any, Generic, Type, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseService(Generic[ModelType]):
    """Base class for services."""

    def __init__(self, model: Type[ModelType]):
        """Initialize service with model."""
        self.model = model

    async def get(self, db: AsyncSession, id: UUID) -> ModelType:
        """Get a record by ID."""
        result = await db.execute(
            select(self.model).where(self.model.id == id)
        )
        obj = result.scalar_one_or_none()
        if not obj:
            raise NotFoundException(f"{self.model.__name__} not found")
        return obj

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        **filters: Any
    ) -> list[ModelType]:
        """Get multiple records with optional filtering."""
        query = select(self.model)
        
        # Apply filters
        for field, value in filters.items():
            if value is not None:
                query = query.where(getattr(self.model, field) == value)

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: dict[str, Any]) -> ModelType:
        """Create a new record."""
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.flush()
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: dict[str, Any]
    ) -> ModelType:
        """Update a record."""
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.flush()
        return db_obj

    async def delete(self, db: AsyncSession, *, id: UUID) -> ModelType:
        """Delete a record."""
        obj = await self.get(db, id)
        await db.delete(obj)
        return obj 