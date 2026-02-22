from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from ..models.event import (
    EventCreate, EventUpdate, EventResponse, EventListResponse
)
from ..services.event_service import event_service
from ..services.user_service import user_service
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("/", response_model=EventListResponse)
async def get_events(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    location_type: Optional[str] = Query(None, description="Filter by location type"),
    search: Optional[str] = Query(None, description="Search in title, description, or tags")
):
    """Get events with filtering and pagination."""
    try:
        skip = (page - 1) * limit
        return await event_service.get_events(
            skip=skip,
            limit=limit,
            category=category,
            location_type=location_type,
            search=search
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get events"
        )


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    """Get a specific event by ID."""
    try:
        event = await event_service.get_event_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get event"
        )


@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    current_user=Depends(get_current_user)
):
    """Create a new event."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        event = await event_service.create_event(event_data, user.id)
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event"
        )


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user=Depends(get_current_user)
):
    """Update an event."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        event = await event_service.update_event(event_id, event_data, user.id)
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update event"
        )


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    current_user=Depends(get_current_user)
):
    """Delete an event."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await event_service.delete_event(event_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete event"
        )


@router.post("/{event_id}/register")
async def register_for_event(
    event_id: str,
    current_user=Depends(get_current_user)
):
    """Register for an event."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await event_service.register_for_event(event_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register for event"
        )


@router.post("/{event_id}/unregister")
async def unregister_from_event(
    event_id: str,
    current_user=Depends(get_current_user)
):
    """Unregister from an event."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await event_service.unregister_from_event(event_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unregister from event"
        ) 