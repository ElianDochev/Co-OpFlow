from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.event import (
    EventCreate, EventUpdate, EventInDB, EventResponse, EventListResponse
)
from ..services.user_service import user_service


class EventService:
    @property
    def collection(self):
        return get_collection("events")
    
    async def create_event(self, event_data: EventCreate, organizer_id: str) -> EventResponse:
        """Create a new event."""
        # Get organizer info
        organizer = await user_service.get_user_by_id(organizer_id)
        if not organizer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Validate dates
        if event_data.start_date >= event_data.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )
        
        # Create event document
        event_doc = {
            "title": event_data.title,
            "description": event_data.description,
            "category": event_data.category,
            "location_type": event_data.location_type,
            "location": event_data.location,
            "start_date": event_data.start_date,
            "end_date": event_data.end_date,
            "max_participants": event_data.max_participants,
            "image_url": event_data.image_url,
            "tags": event_data.tags,
            "organizer_id": organizer_id,
            "organizer_name": organizer.name,
            "participants": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.collection.insert_one(event_doc)
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),  # Map _id to id
            "title": event_data.title,
            "description": event_data.description,
            "category": event_data.category,
            "location_type": event_data.location_type,
            "location": event_data.location,
            "start_date": event_data.start_date,
            "end_date": event_data.end_date,
            "max_participants": event_data.max_participants,
            "image_url": event_data.image_url,
            "tags": event_data.tags,
            "organizer_id": organizer_id,
            "organizer_name": organizer.name,
            "participants_count": 0,
            "created_at": event_doc["created_at"],
            "updated_at": event_doc["updated_at"]
        }
        
        return EventResponse(**response_data)
    
    async def get_event_by_id(self, event_id: str) -> Optional[EventResponse]:
        """Get event by ID."""
        try:
            event_doc = await self.collection.find_one({"_id": ObjectId(event_id)})
            if event_doc:
                # Create response data with proper field mapping
                response_data = {
                    "id": str(event_doc["_id"]),  # Map _id to id
                    "title": event_doc["title"],
                    "description": event_doc["description"],
                    "category": event_doc["category"],
                    "location_type": event_doc["location_type"],
                    "location": event_doc.get("location"),
                    "start_date": event_doc["start_date"],
                    "end_date": event_doc["end_date"],
                    "max_participants": event_doc.get("max_participants"),
                    "image_url": event_doc.get("image_url"),
                    "tags": event_doc.get("tags", []),
                    "organizer_id": event_doc["organizer_id"],
                    "organizer_name": event_doc["organizer_name"],
                    "participants_count": len(event_doc.get("participants", [])),
                    "created_at": event_doc["created_at"],
                    "updated_at": event_doc["updated_at"]
                }
                
                return EventResponse(**response_data)
        except Exception as e:
            print(f"Error getting event by ID {event_id}: {str(e)}")
        return None
    
    async def get_events(
        self,
        skip: int = 0,
        limit: int = 10,
        category: Optional[str] = None,
        location_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> EventListResponse:
        """Get events with filtering and pagination."""
        # Build filter
        filter_query = {}
        if category:
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        if location_type:
            filter_query["location_type"] = {"$regex": f"^{location_type}$", "$options": "i"}
        if search:
            filter_query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search]}}
            ]
        
        # Get total count
        total = await self.collection.count_documents(filter_query)
        
        # Get events
        cursor = self.collection.find(filter_query).sort("start_date", 1).skip(skip).limit(limit)
        events = []
        
        async for event_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(event_doc["_id"]),  # Map _id to id
                "title": event_doc["title"],
                "description": event_doc["description"],
                "category": event_doc["category"],
                "location_type": event_doc["location_type"],
                "location": event_doc.get("location"),
                "start_date": event_doc["start_date"],
                "end_date": event_doc["end_date"],
                "max_participants": event_doc.get("max_participants"),
                "image_url": event_doc.get("image_url"),
                "tags": event_doc.get("tags", []),
                "organizer_id": event_doc["organizer_id"],
                "organizer_name": event_doc["organizer_name"],
                "participants_count": len(event_doc.get("participants", [])),
                "created_at": event_doc["created_at"],
                "updated_at": event_doc["updated_at"]
            }
            
            events.append(EventResponse(**response_data))
        
        return EventListResponse(
            events=events,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def update_event(self, event_id: str, event_data: EventUpdate, user_id: str) -> EventResponse:
        """Update event information."""
        # Check if user is the organizer
        event_doc = await self.collection.find_one({"_id": ObjectId(event_id)})
        if not event_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        if event_doc["organizer_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this event"
            )
        
        update_data = event_data.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data to update"
            )
        
        # Validate dates if provided
        if "start_date" in update_data and "end_date" in update_data:
            if update_data["start_date"] >= update_data["end_date"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="End date must be after start date"
                )
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Return updated event
        return await self.get_event_by_id(event_id)
    
    async def delete_event(self, event_id: str, user_id: str) -> dict:
        """Delete an event."""
        # Check if user is the organizer
        event_doc = await self.collection.find_one({"_id": ObjectId(event_id)})
        if not event_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        if event_doc["organizer_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this event"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(event_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return {"message": "Event deleted successfully"}
    
    async def register_for_event(self, event_id: str, user_id: str) -> dict:
        """Register a user for an event."""
        # Check if event exists
        event_doc = await self.collection.find_one({"_id": ObjectId(event_id)})
        if not event_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Check if event is full
        if event_doc.get("max_participants") and len(event_doc.get("participants", [])) >= event_doc["max_participants"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event is full"
            )
        
        # Check if already registered
        if user_id in event_doc.get("participants", []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already registered for this event"
            )
        
        # Add user to participants
        result = await self.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"participants": user_id}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return {"message": "Registered for event successfully"}
    
    async def unregister_from_event(self, event_id: str, user_id: str) -> dict:
        """Unregister a user from an event."""
        # Check if event exists
        event_doc = await self.collection.find_one({"_id": ObjectId(event_id)})
        if not event_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Check if registered
        if user_id not in event_doc.get("participants", []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not registered for this event"
            )
        
        # Remove user from participants
        result = await self.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$pull": {"participants": user_id}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return {"message": "Unregistered from event successfully"}
    
    async def get_user_events(self, user_id: str) -> List[EventResponse]:
        """Get events the user is registered for."""
        cursor = self.collection.find({"participants": user_id})
        events = []
        
        async for event_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(event_doc["_id"]),  # Map _id to id
                "title": event_doc["title"],
                "description": event_doc["description"],
                "category": event_doc["category"],
                "location_type": event_doc["location_type"],
                "location": event_doc.get("location"),
                "start_date": event_doc["start_date"],
                "end_date": event_doc["end_date"],
                "max_participants": event_doc.get("max_participants"),
                "image_url": event_doc.get("image_url"),
                "tags": event_doc.get("tags", []),
                "organizer_id": event_doc["organizer_id"],
                "organizer_name": event_doc["organizer_name"],
                "participants_count": len(event_doc.get("participants", [])),
                "created_at": event_doc["created_at"],
                "updated_at": event_doc["updated_at"]
            }
            
            events.append(EventResponse(**response_data))
        
        return events
    
    async def get_organized_events(self, user_id: str) -> List[EventResponse]:
        """Get events organized by the user."""
        cursor = self.collection.find({"organizer_id": user_id})
        events = []
        
        async for event_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(event_doc["_id"]),  # Map _id to id
                "title": event_doc["title"],
                "description": event_doc["description"],
                "category": event_doc["category"],
                "location_type": event_doc["location_type"],
                "location": event_doc.get("location"),
                "start_date": event_doc["start_date"],
                "end_date": event_doc["end_date"],
                "max_participants": event_doc.get("max_participants"),
                "image_url": event_doc.get("image_url"),
                "tags": event_doc.get("tags", []),
                "organizer_id": event_doc["organizer_id"],
                "organizer_name": event_doc["organizer_name"],
                "participants_count": len(event_doc.get("participants", [])),
                "created_at": event_doc["created_at"],
                "updated_at": event_doc["updated_at"]
            }
            
            events.append(EventResponse(**response_data))
        
        return events


event_service = EventService() 