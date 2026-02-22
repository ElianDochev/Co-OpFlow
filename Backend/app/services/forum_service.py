from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.forum import (
    ThreadCreate, ThreadUpdate, ThreadInDB, ThreadResponse, ThreadDetailResponse,
    ThreadListResponse, ReplyCreate, ReplyInDB, ReplyResponse
)
from ..services.user_service import user_service


class ForumService:
    @property
    def threads_collection(self):
        return get_collection("forum_threads")
    
    @property
    def replies_collection(self):
        return get_collection("forum_replies")
    
    async def create_thread(self, thread_data: ThreadCreate, author_id: str) -> ThreadResponse:
        """Create a new forum thread."""
        # Get author info
        author = await user_service.get_user_by_id(author_id)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create thread document
        thread_doc = {
            "title": thread_data.title,
            "content": thread_data.content,
            "category": thread_data.category,
            "tags": thread_data.tags,
            "author_id": author_id,
            "author_name": author.name,
            "replies": [],
            "replies_count": 0,
            "views_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.threads_collection.insert_one(thread_doc)
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),  # Map _id to id
            "title": thread_data.title,
            "content": thread_data.content,
            "category": thread_data.category,
            "tags": thread_data.tags,
            "author_id": author_id,
            "author_name": author.name,
            "replies_count": 0,
            "views_count": 0,
            "created_at": thread_doc["created_at"],
            "updated_at": thread_doc["updated_at"]
        }
        
        return ThreadResponse(**response_data)
    
    async def get_thread_by_id(self, thread_id: str) -> Optional[ThreadDetailResponse]:
        """Get thread by ID with replies."""
        try:
            thread_doc = await self.threads_collection.find_one({"_id": ObjectId(thread_id)})
            if thread_doc:
                # Get replies
                replies_cursor = self.replies_collection.find({"thread_id": thread_id}).sort("created_at", 1)
                replies = []
                
                async for reply_doc in replies_cursor:
                    # Create reply response data with proper field mapping
                    reply_response_data = {
                        "id": str(reply_doc["_id"]),  # Map _id to id
                        "thread_id": reply_doc["thread_id"],
                        "author_id": reply_doc["author_id"],
                        "author_name": reply_doc["author_name"],
                        "content": reply_doc["content"],
                        "created_at": reply_doc["created_at"],
                        "updated_at": reply_doc["updated_at"]
                    }
                    replies.append(ReplyResponse(**reply_response_data))
                
                # Increment view count
                await self.threads_collection.update_one(
                    {"_id": ObjectId(thread_id)},
                    {"$inc": {"views_count": 1}}
                )
                
                # Create thread response data with proper field mapping
                thread_response_data = {
                    "id": str(thread_doc["_id"]),  # Map _id to id
                    "title": thread_doc["title"],
                    "content": thread_doc["content"],
                    "category": thread_doc["category"],
                    "tags": thread_doc.get("tags", []),
                    "author_id": thread_doc["author_id"],
                    "author_name": thread_doc["author_name"],
                    "replies": replies,
                    "replies_count": thread_doc.get("replies_count", 0),
                    "views_count": thread_doc.get("views_count", 0),
                    "created_at": thread_doc["created_at"],
                    "updated_at": thread_doc["updated_at"]
                }
                
                return ThreadDetailResponse(**thread_response_data)
        except Exception as e:
            print(f"Error getting thread by ID {thread_id}: {str(e)}")
        return None
    
    async def get_threads(
        self,
        skip: int = 0,
        limit: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> ThreadListResponse:
        """Get threads with filtering and pagination."""
        # Build filter
        filter_query = {}
        if category:
            filter_query["category"] = category
        if search:
            filter_query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search]}}
            ]
        
        # Get total count
        total = await self.threads_collection.count_documents(filter_query)
        
        # Get threads
        cursor = self.threads_collection.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        threads = []
        
        async for thread_doc in cursor:
            # Create thread response data with proper field mapping
            thread_response_data = {
                "id": str(thread_doc["_id"]),  # Map _id to id
                "title": thread_doc["title"],
                "content": thread_doc["content"],
                "category": thread_doc["category"],
                "tags": thread_doc.get("tags", []),
                "author_id": thread_doc["author_id"],
                "author_name": thread_doc["author_name"],
                "replies_count": thread_doc.get("replies_count", 0),
                "views_count": thread_doc.get("views_count", 0),
                "created_at": thread_doc["created_at"],
                "updated_at": thread_doc["updated_at"]
            }
            
            threads.append(ThreadResponse(**thread_response_data))
        
        return ThreadListResponse(
            threads=threads,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def update_thread(self, thread_id: str, thread_data: ThreadUpdate, user_id: str) -> ThreadResponse:
        """Update thread information."""
        # Check if user is the author
        thread_doc = await self.threads_collection.find_one({"_id": ObjectId(thread_id)})
        if not thread_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Thread not found"
            )
        
        if thread_doc["author_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this thread"
            )
        
        update_data = thread_data.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data to update"
            )
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.threads_collection.update_one(
            {"_id": ObjectId(thread_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Thread not found"
            )
        
        # Return updated thread
        updated_thread = await self.threads_collection.find_one({"_id": ObjectId(thread_id)})
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(updated_thread["_id"]),  # Map _id to id
            "title": updated_thread["title"],
            "content": updated_thread["content"],
            "category": updated_thread["category"],
            "tags": updated_thread.get("tags", []),
            "author_id": updated_thread["author_id"],
            "author_name": updated_thread["author_name"],
            "replies_count": updated_thread.get("replies_count", 0),
            "views_count": updated_thread.get("views_count", 0),
            "created_at": updated_thread["created_at"],
            "updated_at": updated_thread["updated_at"]
        }
        
        return ThreadResponse(**response_data)
    
    async def delete_thread(self, thread_id: str, user_id: str) -> dict:
        """Delete a thread."""
        # Check if user is the author
        thread_doc = await self.threads_collection.find_one({"_id": ObjectId(thread_id)})
        if not thread_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Thread not found"
            )
        
        if thread_doc["author_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this thread"
            )
        
        # Delete thread and all replies
        await self.threads_collection.delete_one({"_id": ObjectId(thread_id)})
        await self.replies_collection.delete_many({"thread_id": thread_id})
        
        return {"message": "Thread deleted successfully"}
    
    async def add_reply(self, thread_id: str, reply_data: ReplyCreate, author_id: str) -> ReplyResponse:
        """Add a reply to a thread."""
        # Check if thread exists
        thread_doc = await self.threads_collection.find_one({"_id": ObjectId(thread_id)})
        if not thread_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Thread not found"
            )
        
        # Get author info
        author = await user_service.get_user_by_id(author_id)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create reply document
        reply_doc = {
            "thread_id": thread_id,
            "author_id": author_id,
            "author_name": author.name,
            "content": reply_data.content,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.replies_collection.insert_one(reply_doc)
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),  # Map _id to id
            "thread_id": thread_id,
            "author_id": author_id,
            "author_name": author.name,
            "content": reply_data.content,
            "created_at": reply_doc["created_at"],
            "updated_at": reply_doc["updated_at"]
        }
        
        # Update thread reply count
        await self.threads_collection.update_one(
            {"_id": ObjectId(thread_id)},
            {"$inc": {"replies_count": 1}}
        )
        
        return ReplyResponse(**response_data)
    
    async def update_reply(self, reply_id: str, reply_data: ReplyCreate, user_id: str) -> ReplyResponse:
        """Update a reply."""
        # Check if user is the author
        reply_doc = await self.replies_collection.find_one({"_id": ObjectId(reply_id)})
        if not reply_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reply not found"
            )
        
        if reply_doc["author_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this reply"
            )
        
        update_data = {
            "content": reply_data.content,
            "updated_at": datetime.utcnow()
        }
        
        result = await self.replies_collection.update_one(
            {"_id": ObjectId(reply_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reply not found"
            )
        
        # Return updated reply
        updated_reply = await self.replies_collection.find_one({"_id": ObjectId(reply_id)})
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(updated_reply["_id"]),  # Map _id to id
            "thread_id": updated_reply["thread_id"],
            "author_id": updated_reply["author_id"],
            "author_name": updated_reply["author_name"],
            "content": updated_reply["content"],
            "created_at": updated_reply["created_at"],
            "updated_at": updated_reply["updated_at"]
        }
        
        return ReplyResponse(**response_data)
    
    async def delete_reply(self, reply_id: str, user_id: str) -> dict:
        """Delete a reply."""
        # Check if user is the author
        reply_doc = await self.replies_collection.find_one({"_id": ObjectId(reply_id)})
        if not reply_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reply not found"
            )
        
        if reply_doc["author_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this reply"
            )
        
        # Delete reply
        await self.replies_collection.delete_one({"_id": ObjectId(reply_id)})
        
        # Update thread reply count
        await self.threads_collection.update_one(
            {"_id": ObjectId(reply_doc["thread_id"])},
            {"$inc": {"replies_count": -1}}
        )
        
        return {"message": "Reply deleted successfully"}


forum_service = ForumService() 