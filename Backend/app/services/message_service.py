from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
import logging
from ..database import get_collection
from ..models.message import (
    MessageCreate, MessageResponse, ChatCreate, ChatResponse, 
    ChatListResponse, MessageListResponse
)
from ..services.user_service import user_service

# Set up logging
logger = logging.getLogger(__name__)

class MessageService:
    @property
    def chats_collection(self):
        return get_collection("chats")
    
    @property
    def messages_collection(self):
        return get_collection("messages")
    
    async def create_chat(self, chat_data: ChatCreate, creator_id: str) -> ChatResponse:
        """Create a new chat."""
        try:
            logger.info(f"Creating chat with creator_id: {creator_id}")
            logger.info(f"Chat data: {chat_data.dict()}")
            
            # Ensure creator is included in participants
            if creator_id not in chat_data.participant_ids:
                chat_data.participant_ids.append(creator_id)
            
            logger.info(f"Final participant_ids: {chat_data.participant_ids}")
            
            # Get participant names
            participant_names = []
            for participant_id in chat_data.participant_ids:
                logger.info(f"Looking up user: {participant_id}")
                try:
                    user = await user_service.get_user_by_id(participant_id)
                    if not user:
                        logger.error(f"User {participant_id} not found")
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User {participant_id} not found"
                        )
                    participant_names.append(user.name)
                    logger.info(f"Found user: {user.name}")
                except Exception as e:
                    logger.error(f"Error looking up user {participant_id}: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Error looking up user {participant_id}: {str(e)}"
                    )
            
            logger.info(f"Participant names: {participant_names}")
            
            # Check if chat already exists (for 1-on-1 chats)
            if len(chat_data.participant_ids) == 2 and not chat_data.is_group:
                logger.info("Checking for existing 1-on-1 chat")
                try:
                    existing_chat = await self.chats_collection.find_one({
                        "participant_ids": {"$all": chat_data.participant_ids},
                        "is_group": False
                    })
                    if existing_chat:
                        logger.info(f"Found existing chat: {existing_chat['_id']}")
                        # Return existing chat
                        response_data = {
                            "id": str(existing_chat["_id"]),
                            "name": existing_chat.get("name"),
                            "is_group": existing_chat.get("is_group", False),
                            "participant_ids": existing_chat["participant_ids"],
                            "participant_names": existing_chat["participant_names"],
                            "last_message": existing_chat.get("last_message"),
                            "last_message_at": existing_chat.get("last_message_at"),
                            "created_at": existing_chat["created_at"],
                            "updated_at": existing_chat["updated_at"]
                        }
                        return ChatResponse(**response_data)
                except Exception as e:
                    logger.error(f"Error checking for existing chat: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Error checking for existing chat: {str(e)}"
                    )
            
            # Create chat document
            chat_doc = {
                "name": chat_data.name,
                "is_group": chat_data.is_group,
                "participant_ids": chat_data.participant_ids,
                "participant_names": participant_names,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            logger.info(f"Creating chat document: {chat_doc}")
            
            try:
                result = await self.chats_collection.insert_one(chat_doc)
                logger.info(f"Chat created successfully with ID: {result.inserted_id}")
            except Exception as e:
                logger.error(f"Error inserting chat document: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error creating chat: {str(e)}"
                )
            
            # Create response data with proper field mapping
            response_data = {
                "id": str(result.inserted_id),
                "name": chat_data.name,
                "is_group": chat_data.is_group,
                "participant_ids": chat_data.participant_ids,
                "participant_names": participant_names,
                "last_message": None,
                "last_message_at": None,
                "created_at": chat_doc["created_at"],
                "updated_at": chat_doc["updated_at"]
            }
            
            logger.info(f"Returning chat response: {response_data}")
            return ChatResponse(**response_data)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in create_chat: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create chat: {str(e)}"
            )
    
    async def get_user_chats(self, user_id: str) -> ChatListResponse:
        """Get all chats for a user."""
        cursor = self.chats_collection.find({"participant_ids": user_id}).sort("last_message_at", -1)
        chats = []
        
        async for chat_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(chat_doc["_id"]),
                "name": chat_doc.get("name"),
                "is_group": chat_doc.get("is_group", False),
                "participant_ids": chat_doc["participant_ids"],
                "participant_names": chat_doc["participant_names"],
                "last_message": chat_doc.get("last_message"),
                "last_message_at": chat_doc.get("last_message_at"),
                "created_at": chat_doc["created_at"],
                "updated_at": chat_doc["updated_at"]
            }
            
            chats.append(ChatResponse(**response_data))
        
        total = len(chats)
        
        return ChatListResponse(
            chats=chats,
            total=total
        )
    
    async def get_chat_by_id(self, chat_id: str, user_id: str) -> Optional[ChatResponse]:
        """Get chat by ID if user is a participant."""
        try:
            chat_doc = await self.chats_collection.find_one({
                "_id": ObjectId(chat_id),
                "participant_ids": user_id
            })
            
            if chat_doc:
                # Create response data with proper field mapping
                response_data = {
                    "id": str(chat_doc["_id"]),
                    "name": chat_doc.get("name"),
                    "is_group": chat_doc.get("is_group", False),
                    "participant_ids": chat_doc["participant_ids"],
                    "participant_names": chat_doc["participant_names"],
                    "last_message": chat_doc.get("last_message"),
                    "last_message_at": chat_doc.get("last_message_at"),
                    "created_at": chat_doc["created_at"],
                    "updated_at": chat_doc["updated_at"]
                }
                
                return ChatResponse(**response_data)
        except Exception as e:
            print(f"Error getting chat by ID {chat_id}: {str(e)}")
        return None
    
    async def get_chat_messages(
        self, 
        chat_id: str, 
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> MessageListResponse:
        """Get messages for a chat."""
        # Verify user is participant
        chat = await self.get_chat_by_id(chat_id, user_id)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found or access denied"
            )
        
        # Get total count
        total = await self.messages_collection.count_documents({"chat_id": chat_id})
        
        # Get messages
        cursor = self.messages_collection.find({"chat_id": chat_id}).sort("created_at", -1).skip(skip).limit(limit)
        messages = []
        
        async for message_doc in cursor:
            # Create response data with proper field mapping
            response_data = {
                "id": str(message_doc["_id"]),
                "content": message_doc["content"],
                "message_type": message_doc["message_type"],
                "chat_id": message_doc["chat_id"],
                "sender_id": message_doc["sender_id"],
                "sender_name": message_doc["sender_name"],
                "created_at": message_doc["created_at"],
                "updated_at": message_doc["updated_at"]
            }
            
            messages.append(MessageResponse(**response_data))
        
        # Reverse to get chronological order
        messages.reverse()
        
        return MessageListResponse(
            messages=messages,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def send_message(self, chat_id: str, message_data: MessageCreate, sender_id: str) -> MessageResponse:
        """Send a message in a chat."""
        # Verify user is participant
        chat = await self.get_chat_by_id(chat_id, sender_id)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found or access denied"
            )
        
        # Get sender info
        sender = await user_service.get_user_by_id(sender_id)
        if not sender:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create message document
        message_doc = {
            "content": message_data.content,
            "message_type": message_data.message_type,
            "chat_id": chat_id,
            "sender_id": sender_id,
            "sender_name": sender.name,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.messages_collection.insert_one(message_doc)
        
        # Update chat's last message
        last_message_data = {
            "content": message_data.content,
            "sender_name": sender.name,
            "created_at": message_doc["created_at"]
        }
        
        await self.chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$set": {
                    "last_message": last_message_data,
                    "last_message_at": message_doc["created_at"],
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),
            "content": message_data.content,
            "message_type": message_data.message_type,
            "chat_id": chat_id,
            "sender_id": sender_id,
            "sender_name": sender.name,
            "created_at": message_doc["created_at"],
            "updated_at": message_doc["updated_at"]
        }
        
        return MessageResponse(**response_data)


message_service = MessageService() 