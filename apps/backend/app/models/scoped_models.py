"""Scoped model classes for different access levels."""

from typing import Optional
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.declarative import declared_attr

from app.models.base_model import BaseModel

class SchoolScopedModel(BaseModel):
    """Base model for school-scoped entities."""
    
    __abstract__ = True

    school_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("schools.id", ondelete="CASCADE"),
        nullable=False,
    )

    @declared_attr
    def school(cls):
        """Relationship to school."""
        return relationship(
            "School",
            primaryjoin="School.id==foreign(SchoolScopedModel.school_id)",
            viewonly=True
        )


class SuperAdminScopedModel(BaseModel):
    """Base model for content managed by super admins."""
    
    __abstract__ = True

    created_by_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    is_d2c_enabled: Mapped[bool] = mapped_column(
        Boolean,
        server_default=text("false"),
        nullable=False,
    )
    is_b2b_enabled: Mapped[bool] = mapped_column(
        Boolean,
        server_default=text("true"),
        nullable=False,
    )
    
    @declared_attr
    def created_by(cls):
        """Relationship to creator."""
        return relationship(
            "User",
            viewonly=True
        ) 