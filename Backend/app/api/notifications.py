from fastapi import APIRouter, HTTPException, status, Depends, Query
from ..models.notification import (
    NotificationResponse, NotificationListResponse
)
from ..services.notification_service import notification_service
from ..services.user_service import user_service
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=NotificationListResponse)
async def get_user_notifications(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Notifications per page"),
    current_user=Depends(get_current_user)
):
    """Get notifications for the authenticated user."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        skip = (page - 1) * limit
        return await notification_service.get_user_notifications(user.id, skip, limit)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get notifications"
        )


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    current_user=Depends(get_current_user)
):
    """Mark a specific notification as read."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return await notification_service.mark_notification_read(notification_id, user.id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark notification as read"
        )


@router.put("/mark-all-read")
async def mark_all_notifications_read(current_user=Depends(get_current_user)):
    """Mark all notifications as read for the authenticated user."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return await notification_service.mark_all_notifications_read(user.id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark all notifications as read"
        )


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a specific notification."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return await notification_service.delete_notification(notification_id, user.id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete notification"
        ) 