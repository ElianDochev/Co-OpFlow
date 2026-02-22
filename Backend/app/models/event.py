from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class EventCategory(str, Enum):
    CONFERENCE = "conference"
    WORKSHOP = "workshop"
    HACKATHON = "hackathon"
    MEETUP = "meetup"
    WEBINAR = "webinar"
    OTHER = "other"


class LocationType(str, Enum):
    ONLINE = "online"
    IN_PERSON = "in_person"
    HYBRID = "hybrid"


class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)
    category: EventCategory
    location_type: LocationType
    location: Optional[str] = None
    start_date: datetime
    end_date: datetime
    max_participants: Optional[int] = None
    image_url: Optional[str] = None
    tags: List[str] = []


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[EventCategory] = None
    location_type: Optional[LocationType] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    max_participants: Optional[int] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None


class EventInDB(EventBase):
    id: str = Field(alias="_id")
    organizer_id: str
    organizer_name: str
    participants: List[str] = []  # List of user IDs
    created_at: datetime
    updated_at: datetime


class EventResponse(EventBase):
    id: str
    organizer_id: str
    organizer_name: str
    participants_count: int
    created_at: datetime
    updated_at: datetime


class EventListResponse(BaseModel):
    events: List[EventResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class EventRegistration(BaseModel):
    event_id: str
    user_id: str
    user_name: str
    user_email: str
    registered_at: datetime 