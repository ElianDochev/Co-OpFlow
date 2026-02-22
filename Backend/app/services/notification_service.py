from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.notification import (
    NotificationCreate, NotificationResponse, NotificationListResponse,
    NotificationUpdate
)


class NotificationService:
    @property
    def collection(self):
        return get_collection("notifications")
    
    async def create_notification(self, notification_data: NotificationCreate) -> NotificationResponse:
        """Create a new notification."""
        notification_doc = {
            "title": notification_data.title,
            "message": notification_data.message,
            "notification_type": notification_data.notification_type,
            "data": notification_data.data,
            "recipient_id": notification_data.recipient_id,
            "is_read": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.collection.insert_one(notification_doc)
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),
            "title": notification_data.title,
            "message": notification_data.message,
            "notification_type": notification_data.notification_type,
            "data": notification_data.data,
            "recipient_id": notification_data.recipient_id,
            "is_read": False,
            "created_at": notification_doc["created_at"],
            "updated_at": notification_doc["updated_at"]
        }
        
        return NotificationResponse(**response_data)
    
    async def get_user_notifications(
        self, 
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> NotificationListResponse:
        """Get notifications for a user."""
        # Get total count
        total = await self.collection.count_documents({"recipient_id": user_id})
        
        # Get unread count
        unread_count = await self.collection.count_documents({
            "recipient_id": user_id,
            "is_read": False
        })
        
        # Get notifications
        cursor = self.collection.find({"recipient_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        notifications = []
        
        async for notification_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(notification_doc["_id"]),
                "title": notification_doc["title"],
                "message": notification_doc["message"],
                "notification_type": notification_doc["notification_type"],
                "data": notification_doc.get("data"),
                "recipient_id": notification_doc["recipient_id"],
                "is_read": notification_doc["is_read"],
                "created_at": notification_doc["created_at"],
                "updated_at": notification_doc["updated_at"]
            }
            
            notifications.append(NotificationResponse(**response_data))
        
        return NotificationListResponse(
            notifications=notifications,
            total=total,
            unread_count=unread_count,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def get_notification_by_id(self, notification_id: str, user_id: str) -> Optional[NotificationResponse]:
        """Get notification by ID if user is the recipient."""
        try:
            notification_doc = await self.collection.find_one({
                "_id": ObjectId(notification_id),
                "recipient_id": user_id
            })
            
            if notification_doc:
                # Create response data with proper field mapping
                response_data = {
                    "id": str(notification_doc["_id"]),
                    "title": notification_doc["title"],
                    "message": notification_doc["message"],
                    "notification_type": notification_doc["notification_type"],
                    "data": notification_doc.get("data"),
                    "recipient_id": notification_doc["recipient_id"],
                    "is_read": notification_doc["is_read"],
                    "created_at": notification_doc["created_at"],
                    "updated_at": notification_doc["updated_at"]
                }
                
                return NotificationResponse(**response_data)
        except Exception as e:
            print(f"Error getting notification by ID {notification_id}: {str(e)}")
        return None
    
    async def mark_notification_read(self, notification_id: str, user_id: str) -> NotificationResponse:
        """Mark a notification as read."""
        notification = await self.get_notification_by_id(notification_id, user_id)
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found or access denied"
            )
        
        result = await self.collection.update_one(
            {"_id": ObjectId(notification_id)},
            {
                "$set": {
                    "is_read": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        # Return updated notification
        notification.is_read = True
        notification.updated_at = datetime.utcnow()
        return notification
    
    async def mark_all_notifications_read(self, user_id: str) -> dict:
        """Mark all notifications as read for a user."""
        result = await self.collection.update_many(
            {"recipient_id": user_id, "is_read": False},
            {
                "$set": {
                    "is_read": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "message": f"Marked {result.modified_count} notifications as read",
            "modified_count": result.modified_count
        }
    
    async def delete_notification(self, notification_id: str, user_id: str) -> dict:
        """Delete a notification."""
        notification = await self.get_notification_by_id(notification_id, user_id)
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found or access denied"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(notification_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return {"message": "Notification deleted successfully"}
    
    async def create_message_notification(self, recipient_id: str, sender_name: str, chat_id: str) -> NotificationResponse:
        """Create a notification for a new message."""
        notification_data = NotificationCreate(
            title="New Message",
            message=f"{sender_name} sent you a message",
            notification_type="message",
            data={"chat_id": chat_id, "sender_name": sender_name},
            recipient_id=recipient_id
        )
        
        return await self.create_notification(notification_data)
    
    async def create_team_invitation_notification(self, recipient_id: str, team_name: str, inviter_name: str) -> NotificationResponse:
        """Create a notification for a team invitation."""
        notification_data = NotificationCreate(
            title="Team Invitation",
            message=f"{inviter_name} invited you to join {team_name}",
            notification_type="team_invitation",
            data={"team_name": team_name, "inviter_name": inviter_name},
            recipient_id=recipient_id
        )
        
        return await self.create_notification(notification_data)
    
    async def create_project_like_notification(self, recipient_id: str, project_title: str, liker_name: str) -> NotificationResponse:
        """Create a notification for a project like."""
        notification_data = NotificationCreate(
            title="Project Liked",
            message=f"{liker_name} liked your project '{project_title}'",
            notification_type="project_like",
            data={"project_title": project_title, "liker_name": liker_name},
            recipient_id=recipient_id
        )
        
        return await self.create_notification(notification_data)
    
    async def create_project_star_notification(self, recipient_id: str, project_title: str, starrer_name: str) -> NotificationResponse:
        """Create a notification for a project star."""
        notification_data = NotificationCreate(
            title="Project Starred",
            message=f"{starrer_name} starred your project '{project_title}'",
            notification_type="project_star",
            data={"project_title": project_title, "starrer_name": starrer_name},
            recipient_id=recipient_id
        )
        
        return await self.create_notification(notification_data)


notification_service = NotificationService() 