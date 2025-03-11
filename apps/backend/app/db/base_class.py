"""Base class for SQLAlchemy declarative base."""

from typing import Any
from uuid import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Mapped
from sqlalchemy.dialects.postgresql import UUID as PGUUID

class Base(DeclarativeBase):
    """Base class for all models."""
    
    # Type hints for common attributes
    id: Mapped[UUID]
    
    # Generate __tablename__ automatically
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        """Generate table name automatically."""
        return cls.__name__.lower() 