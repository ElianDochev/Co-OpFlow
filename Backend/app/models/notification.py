from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class NotificationType(str, Enum):
    MESSAGE = "message"
    TEAM_INVITATION = "team_invitation"
    PROJECT_LIKE = "project_like"
    PROJECT_STAR = "project_star"
    EVENT_REGISTRATION = "event_registration"
    FORUM_REPLY = "forum_reply"
    GENERAL = "general"


class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=500)
    notification_type: NotificationType
    data: Optional[Dict[str, Any]] = None


class NotificationCreate(NotificationBase):
    recipient_id: str


class NotificationInDB(NotificationBase):
    id: str = Field(alias="_id")
    recipient_id: str
    is_read: bool = False
    created_at: datetime
    updated_at: datetime


class NotificationResponse(NotificationBase):
    id: str
    recipient_id: str
    is_read: bool
    created_at: datetime
    updated_at: datetime


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class NotificationUpdate(BaseModel):
    is_read: bool = True 