"""Common utility functions."""

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID

def remove_none_values(d: Dict[str, Any]) -> Dict[str, Any]:
    """Remove None values from dictionary."""
    return {k: v for k, v in d.items() if v is not None}

def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime to ISO format."""
    return dt.isoformat() if dt else None

def format_uuid(uuid: Optional[UUID]) -> Optional[str]:
    """Format UUID to string."""
    return str(uuid) if uuid else None

def parse_uuid(uuid_str: Optional[str]) -> Optional[UUID]:
    """Parse UUID from string."""
    return UUID(uuid_str) if uuid_str else None 