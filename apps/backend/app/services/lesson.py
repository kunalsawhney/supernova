"""Service for managing lessons and resources."""

from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exception_handlers import NotFoundException, ValidationError, PermissionError
from app.models.module import Module
from app.models.lesson import Lesson
from app.models.enums import LessonStatus
from app.models.user import User, UserRole
from app.schemas.lesson import LessonCreate, LessonUpdate, ResourceCreate


class LessonService:
    """Service for managing lessons and resources."""
    
    @staticmethod
    async def get_lesson(
        db: AsyncSession,
        lesson_id: UUID
    ) -> Optional[Lesson]:
        """Get lesson by ID."""
        query = select(Lesson).where(Lesson.id == lesson_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_lesson_with_resources(
        db: AsyncSession,
        lesson_id: UUID
    ) -> Optional[Lesson]:
        """Get lesson with related resources."""
        query = (
            select(Lesson)
            .options(selectinload(Lesson.resources))
            .where(Lesson.id == lesson_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
        
    @staticmethod
    async def create_lesson(
        db: AsyncSession,
        current_user: User,
        lesson_data: LessonCreate
    ) -> Lesson:
        """Create a new lesson for a module."""
        # Check if module exists
        module = await db.get(Module, lesson_data.module_id)
        if not module:
            raise NotFoundException("Module not found")
            
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            # Get course content and check ownership
            content = await db.get(Module, module.course_content_id)
            if not content or content.course.created_by_id != current_user.id:
                raise PermissionError("You don't have permission to add lessons to this module")
            
        # Get next sequence number if not specified
        if not lesson_data.sequence_number:
            query = (
                select(func.coalesce(func.max(Lesson.sequence_number), 0) + 1)
                .where(Lesson.module_id == lesson_data.module_id)
            )
            result = await db.execute(query)
            next_seq = result.scalar_one()
            lesson_data_dict = lesson_data.model_dump()
            lesson_data_dict["sequence_number"] = next_seq
        else:
            lesson_data_dict = lesson_data.model_dump()
        
        # Create lesson
        lesson = Lesson(
            **lesson_data_dict,
            # status=LessonStatus.DRAFT
        )
        db.add(lesson)
        await db.flush()
        
        return lesson
    
    @staticmethod
    async def update_lesson(
        db: AsyncSession,
        current_user: User,
        lesson_id: UUID,
        lesson_data: LessonUpdate
    ) -> Lesson:
        """Update a lesson."""
        lesson = await LessonService.get_lesson(db, lesson_id)
        if not lesson:
            raise NotFoundException("Lesson not found")
            
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            # Get module, content, and course to check ownership
            module = await db.get(Module, lesson.module_id)
            if not module:
                raise NotFoundException("Module not found")
                
            content = await db.get(Module, module.course_content_id)
            if not content or content.course.created_by_id != current_user.id:
                raise PermissionError("You don't have permission to update this lesson")
            
        # Update lesson
        lesson_dict = lesson_data.model_dump(exclude_unset=True)
        for key, value in lesson_dict.items():
            setattr(lesson, key, value)
            
        return lesson
    
    @staticmethod
    async def delete_lesson(
        db: AsyncSession,
        current_user: User,
        lesson_id: UUID
    ) -> bool:
        """Delete a lesson."""
        lesson = await LessonService.get_lesson(db, lesson_id)
        if not lesson:
            raise NotFoundException("Lesson not found")
            
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            # Get module, content, and course to check ownership
            module = await db.get(Module, lesson.module_id)
            if not module:
                raise NotFoundException("Module not found")
                
            content = await db.get(Module, module.course_content_id)
            if not content or content.course.created_by_id != current_user.id:
                raise PermissionError("You don't have permission to delete this lesson")
            
        # Delete lesson
        await db.delete(lesson)
        return True
    
    @staticmethod
    async def list_lessons(
        db: AsyncSession,
        module_id: UUID
    ) -> List[Lesson]:
        """List all lessons for a module."""
        query = (
            select(Lesson)
            .where(Lesson.module_id == module_id)
            .order_by(Lesson.sequence_number)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def list_lessons_with_resources(
        db: AsyncSession,
        module_id: UUID
    ) -> List[Lesson]:
        """List all lessons with resources for a module."""
        query = (
            select(Lesson)
            .options(selectinload(Lesson.resources))
            .where(Lesson.module_id == module_id)
            .order_by(Lesson.sequence_number)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def reorder_lessons(
        db: AsyncSession,
        current_user: User,
        module_id: UUID,
        lesson_order: List[UUID]
    ) -> List[Lesson]:
        """Reorder lessons by providing an ordered list of lesson IDs."""
        # Get all lessons for the module
        lessons = await LessonService.list_lessons(db, module_id)
        if not lessons:
            raise NotFoundException("No lessons found for this module")
            
        # Check if all lesson IDs in the order list exist
        lesson_ids = [lesson.id for lesson in lessons]
        if set(lesson_order) != set(lesson_ids):
            raise ValidationError("The lesson order list must contain all and only the existing lesson IDs")
            
        # Check permissions
        if current_user.role != UserRole.SUPER_ADMIN:
            # Get module, content, and course to check ownership
            module = await db.get(Module, module_id)
            if not module:
                raise NotFoundException("Module not found")
                
            content = await db.get(Module, module.course_content_id)
            if not content or content.course.created_by_id != current_user.id:
                raise PermissionError("You don't have permission to reorder lessons in this module")
            
        # Update sequence numbers based on the order
        lesson_dict = {lesson.id: lesson for lesson in lessons}
        for i, lesson_id in enumerate(lesson_order, start=1):
            lesson_dict[lesson_id].sequence_number = i
            
        return list(lesson_dict.values())
    
    # Resource methods
    
    # @staticmethod
    # async def get_resource(
    #     db: AsyncSession,
    #     resource_id: UUID
    # ) -> Optional[Resource]:
    #     """Get resource by ID."""
    #     query = select(Resource).where(Resource.id == resource_id)
    #     result = await db.execute(query)
    #     return result.scalar_one_or_none()
    
    # @staticmethod
    # async def create_resource(
    #     db: AsyncSession,
    #     current_user: User,
    #     resource_data: ResourceCreate
    # ) -> Resource:
    #     """Create a new resource for a lesson."""
    #     # Check if lesson exists
    #     lesson = await db.get(Lesson, resource_data.lesson_id)
    #     if not lesson:
    #         raise NotFoundException("Lesson not found")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         # Get module, content, and course to check ownership
    #         module = await db.get(Module, lesson.module_id)
    #         if not module:
    #             raise NotFoundException("Module not found")
                
    #         content = await db.get(Module, module.course_content_id)
    #         if not content or content.course.created_by_id != current_user.id:
    #             raise PermissionError("You don't have permission to add resources to this lesson")
            
    #     # Get next sequence number if not specified
    #     if not resource_data.sequence_number:
    #         query = (
    #             select(func.coalesce(func.max(Resource.sequence_number), 0) + 1)
    #             .where(Resource.lesson_id == resource_data.lesson_id)
    #         )
    #         result = await db.execute(query)
    #         next_seq = result.scalar_one()
    #         resource_data_dict = resource_data.model_dump()
    #         resource_data_dict["sequence_number"] = next_seq
    #     else:
    #         resource_data_dict = resource_data.model_dump()
        
    #     # Create resource
    #     resource = Resource(**resource_data_dict)
    #     db.add(resource)
    #     await db.flush()
        
    #     return resource
    
    # @staticmethod
    # async def update_resource(
    #     db: AsyncSession,
    #     current_user: User,
    #     resource_id: UUID,
    #     resource_data: dict
    # ) -> Resource:
    #     """Update a resource."""
    #     resource = await LessonService.get_resource(db, resource_id)
    #     if not resource:
    #         raise NotFoundException("Resource not found")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         # Get lesson, module, content, and course to check ownership
    #         lesson = await db.get(Lesson, resource.lesson_id)
    #         if not lesson:
    #             raise NotFoundException("Lesson not found")
                
    #         module = await db.get(Module, lesson.module_id)
    #         if not module:
    #             raise NotFoundException("Module not found")
                
    #         content = await db.get(Module, module.course_content_id)
    #         if not content or content.course.created_by_id != current_user.id:
    #             raise PermissionError("You don't have permission to update this resource")
            
    #     # Update resource
    #     for key, value in resource_data.items():
    #         if hasattr(resource, key):
    #             setattr(resource, key, value)
            
    #     return resource
    
    # @staticmethod
    # async def delete_resource(
    #     db: AsyncSession,
    #     current_user: User,
    #     resource_id: UUID
    # ) -> bool:
    #     """Delete a resource."""
    #     resource = await LessonService.get_resource(db, resource_id)
    #     if not resource:
    #         raise NotFoundException("Resource not found")
            
    #     # Check permissions
    #     if current_user.role != UserRole.SUPER_ADMIN:
    #         # Get lesson, module, content, and course to check ownership
    #         lesson = await db.get(Lesson, resource.lesson_id)
    #         if not lesson:
    #             raise NotFoundException("Lesson not found")
                
    #         module = await db.get(Module, lesson.module_id)
    #         if not module:
    #             raise NotFoundException("Module not found")
                
    #         content = await db.get(Module, module.course_content_id)
    #         if not content or content.course.created_by_id != current_user.id:
    #             raise PermissionError("You don't have permission to delete this resource")
            
    #     # Delete resource
    #     await db.delete(resource)
    #     return True 