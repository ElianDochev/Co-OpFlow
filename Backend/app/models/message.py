from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"


class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    message_type: MessageType = MessageType.TEXT


class MessageCreate(MessageBase):
    pass


class MessageInDB(MessageBase):
    id: str = Field(alias="_id")
    chat_id: str
    sender_id: str
    sender_name: str
    created_at: datetime
    updated_at: datetime


class MessageResponse(MessageBase):
    id: str
    chat_id: str
    sender_id: str
    sender_name: str
    created_at: datetime
    updated_at: datetime


class ChatBase(BaseModel):
    name: Optional[str] = None
    is_group: bool = False


class ChatCreate(ChatBase):
    participant_ids: List[str] = Field(..., min_items=2)


class ChatInDB(ChatBase):
    id: str = Field(alias="_id")
    participant_ids: List[str]
    participant_names: List[str]
    last_message: Optional[dict] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class ChatResponse(ChatBase):
    id: str
    participant_ids: List[str]
    participant_names: List[str]
    last_message: Optional[dict] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class ChatListResponse(BaseModel):
    chats: List[ChatResponse]
    total: int


class MessageListResponse(BaseModel):
    messages: List[MessageResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool 