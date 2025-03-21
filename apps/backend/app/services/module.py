"""Service for managing course modules."""

from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.course_version import CourseContent
from app.models.module import Module
from app.models.enums import ModuleStatus
from app.models.user import User, UserRole
from app.schemas.module import ModuleCreate, ModuleUpdate


class ModuleService:
    """Service for managing course modules."""
    
    @staticmethod
    async def get_module(
        db: AsyncSession,
        module_id: UUID
    ) -> Optional[Module]:
        """Get module by ID."""
        query = select(Module).where(Module.id == module_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_module_with_lessons(
        db: AsyncSession,
        module_id: UUID
    ) -> Optional[Module]:
        """Get module with related lessons."""
        query = (
            select(Module)
            .options(selectinload(Module.lessons))
            .where(Module.id == module_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
        
    @staticmethod
    async def create_module(
        db: AsyncSession,
        current_user: User,
        module_data: ModuleCreate
    ) -> Module:
        """Create a new module for course content."""
        # Check if content exists
        content = await db.get(CourseContent, module_data.content_id)
        if not content:
            raise NotFoundException("Course content not found")
            
        # Check permissions
        if (current_user.role != UserRole.SUPER_ADMIN and 
                content.course.created_by_id != current_user.id):
            raise PermissionError("You don't have permission to add modules to this course")
            
        # Get next sequence number if not specified
        if not module_data.sequence_number:
            query = (
                select(func.coalesce(func.max(Module.sequence_number), 0) + 1)
                .where(Module.content_id == module_data.content_id)
            )
            result = await db.execute(query)
            next_seq = result.scalar_one()
            module_data_dict = module_data.model_dump()
            module_data_dict["sequence_number"] = next_seq
        else:
            module_data_dict = module_data.model_dump()
        print("Module data dict: ", module_data_dict)
        # Create module
        module = Module(
            **module_data_dict
        )
        db.add(module)
        await db.flush()
        
        return module
    
    @staticmethod
    async def update_module(
        db: AsyncSession,
        current_user: User,
        module_id: UUID,
        module_data: ModuleUpdate
    ) -> Module:
        """Update a module."""
        module = await ModuleService.get_module(db, module_id)
        if not module:
            raise NotFoundException("Module not found")
            
        # Check if content exists
        content = await db.get(CourseContent, module.course_content_id)
        if not content:
            raise NotFoundException("Course content not found")
            
        # Check permissions
        if (current_user.role != UserRole.SUPER_ADMIN and 
                content.course.created_by_id != current_user.id):
            raise PermissionError("You don't have permission to update this module")
            
        # Update module
        module_dict = module_data.model_dump(exclude_unset=True)
        for key, value in module_dict.items():
            setattr(module, key, value)
            
        return module
    
    @staticmethod
    async def delete_module(
        db: AsyncSession,
        current_user: User,
        module_id: UUID
    ) -> bool:
        """Delete a module."""
        module = await ModuleService.get_module(db, module_id)
        if not module:
            raise NotFoundException("Module not found")
            
        # # Check if content exists
        # content = await db.get(CourseContent, module.course_content_id)
        # if not content:
        #     raise NotFoundException("Course content not found")
            
        # Check permissions
        if (current_user.role != UserRole.SUPER_ADMIN):
            raise PermissionError("You don't have permission to delete this module")
            
        # Delete module
        await db.delete(module)
        return True
    
    @staticmethod
    async def list_modules(
        db: AsyncSession,
        course_content_id: UUID
    ) -> List[Module]:
        """List all modules for a course content."""
        query = (
            select(Module)
            .where(Module.course_content_id == course_content_id)
            .order_by(Module.sequence_number)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def list_modules_with_lessons(
        db: AsyncSession,
        course_content_id: UUID
    ) -> List[Module]:
        """List all modules with lessons for a course content."""
        query = (
            select(Module)
            .options(selectinload(Module.lessons))
            .where(Module.course_content_id == course_content_id)
            .order_by(Module.sequence_number)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def reorder_modules(
        db: AsyncSession,
        current_user: User,
        course_content_id: UUID,
        module_order: List[UUID]
    ) -> List[Module]:
        """Reorder modules by providing an ordered list of module IDs."""
        # Get all modules for the content
        modules = await ModuleService.list_modules(db, course_content_id)
        if not modules:
            raise NotFoundException("No modules found for this course content")
            
        # Check if all module IDs in the order list exist
        module_ids = [module.id for module in modules]
        if set(module_order) != set(module_ids):
            raise ValidationError("The module order list must contain all and only the existing module IDs")
            
        # Check permissions
        content = await db.get(CourseContent, course_content_id)
        if not content:
            raise NotFoundException("Course content not found")
            
        if (current_user.role != UserRole.SUPER_ADMIN and 
                content.course.created_by_id != current_user.id):
            raise PermissionError("You don't have permission to reorder modules in this course")
            
        # Update sequence numbers based on the order
        module_dict = {module.id: module for module in modules}
        for i, module_id in enumerate(module_order, start=1):
            module_dict[module_id].sequence_number = i
            
        return list(module_dict.values()) 