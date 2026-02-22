from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional
from ..models.forum import (
    ThreadCreate, ThreadUpdate, ThreadResponse, ThreadDetailResponse,
    ThreadListResponse, ReplyCreate, ReplyResponse
)
from ..services.forum_service import forum_service
from ..services.user_service import user_service
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/forums", tags=["Forums"])


@router.get("/threads", response_model=ThreadListResponse)
async def get_threads(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title, content, or tags")
):
    """Get forum threads with filtering and pagination."""
    try:
        skip = (page - 1) * limit
        return await forum_service.get_threads(
            skip=skip,
            limit=limit,
            category=category,
            search=search
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get threads"
        )


@router.get("/threads/{thread_id}", response_model=ThreadDetailResponse)
async def get_thread(thread_id: str):
    """Get a specific forum thread with replies."""
    try:
        thread = await forum_service.get_thread_by_id(thread_id)
        if not thread:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Thread not found"
            )
        return thread
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get thread"
        )


@router.post("/threads", response_model=ThreadResponse)
async def create_thread(
    thread_data: ThreadCreate,
    current_user=Depends(get_current_user)
):
    """Create a new forum thread."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        thread = await forum_service.create_thread(thread_data, user.id)
        return thread
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create thread"
        )


@router.put("/threads/{thread_id}", response_model=ThreadResponse)
async def update_thread(
    thread_id: str,
    thread_data: ThreadUpdate,
    current_user=Depends(get_current_user)
):
    """Update a forum thread."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        thread = await forum_service.update_thread(thread_id, thread_data, user.id)
        return thread
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update thread"
        )


@router.delete("/threads/{thread_id}")
async def delete_thread(
    thread_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a forum thread."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await forum_service.delete_thread(thread_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete thread"
        )


@router.post("/threads/{thread_id}/replies", response_model=ReplyResponse)
async def add_reply(
    thread_id: str,
    reply_data: ReplyCreate,
    current_user=Depends(get_current_user)
):
    """Add a reply to a forum thread."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        reply = await forum_service.add_reply(thread_id, reply_data, user.id)
        return reply
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add reply"
        )


@router.put("/replies/{reply_id}", response_model=ReplyResponse)
async def update_reply(
    reply_id: str,
    reply_data: ReplyCreate,
    current_user=Depends(get_current_user)
):
    """Update a reply."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        reply = await forum_service.update_reply(reply_id, reply_data, user.id)
        return reply
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update reply"
        )


@router.delete("/replies/{reply_id}")
async def delete_reply(
    reply_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a reply."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await forum_service.delete_reply(reply_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete reply"
        )