"""Base model class for SQLAlchemy models.

This module provides the BaseModel class which includes common fields and functionality
for all models in the application, including:
- UUID primary key
- Creation and update timestamps
- Soft delete functionality
- Active status tracking
"""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, func, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.declarative import declared_attr

from app.db.base_class import Base


class TimestampMixin:
    """Mixin to add timestamp fields."""
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


class SoftDeleteMixin:
    """Mixin to add soft delete functionality."""
    
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    is_deleted: Mapped[bool] = mapped_column(default=False)

    @declared_attr
    def __mapper_args__(cls) -> dict:
        """Add filter for soft delete."""
        return {
            "polymorphic_on": cls.type if hasattr(cls, "type") else None,
            "with_polymorphic": "*"
        }


class BaseModel(Base, TimestampMixin, SoftDeleteMixin):
    """Base model class that includes common fields.
    
    All models should inherit from this class to get:
    - UUID primary key
    - Creation and update timestamps
    - Soft delete functionality
    - Active status tracking
    """
    
    __abstract__ = True

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # def __repr__(self) -> str:
    #     return f"<{self.__class__.__name__}(id={self.id!r})>"

    @declared_attr
    def __mapper_args__(cls) -> dict:
        """Add default mapper args."""
        return {
            "polymorphic_on": getattr(cls, "type", None),
            "with_polymorphic": "*"
        } 