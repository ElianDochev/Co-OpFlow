from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ForumCategory(str, Enum):
    GENERAL = "general"
    TECH = "tech"
    PROJECTS = "projects"
    EVENTS = "events"
    HELP = "help"
    OFF_TOPIC = "off_topic"


class ThreadBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=10)
    category: ForumCategory
    tags: List[str] = []


class ThreadCreate(ThreadBase):
    pass


class ThreadUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=10)
    category: Optional[ForumCategory] = None
    tags: Optional[List[str]] = None


class ReplyBase(BaseModel):
    content: str = Field(..., min_length=1)


class ReplyCreate(ReplyBase):
    pass


class ReplyUpdate(BaseModel):
    content: str = Field(..., min_length=1)


class ReplyInDB(ReplyBase):
    id: str = Field(alias="_id")
    thread_id: str
    author_id: str
    author_name: str
    created_at: datetime
    updated_at: datetime


class ReplyResponse(ReplyBase):
    id: str
    thread_id: str
    author_id: str
    author_name: str
    created_at: datetime
    updated_at: datetime


class ThreadInDB(ThreadBase):
    id: str = Field(alias="_id")
    author_id: str
    author_name: str
    replies: List[ReplyInDB] = []
    replies_count: int = 0
    views_count: int = 0
    created_at: datetime
    updated_at: datetime


class ThreadResponse(ThreadBase):
    id: str
    author_id: str
    author_name: str
    replies_count: int
    views_count: int
    created_at: datetime
    updated_at: datetime


class ThreadDetailResponse(ThreadBase):
    id: str
    author_id: str
    author_name: str
    replies: List[ReplyResponse]
    replies_count: int
    views_count: int
    created_at: datetime
    updated_at: datetime


class ThreadListResponse(BaseModel):
    threads: List[ThreadResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool 