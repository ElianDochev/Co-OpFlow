from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.user import UserCreate, UserUpdate, UserInDB, UserResponse, UserListResponse
from ..auth.jwt import get_password_hash, verify_password


class UserService:
    @property
    def collection(self):
        return get_collection("users")
    
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user."""
        # Check if user already exists
        existing_user = await self.collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "name": user_data.name,
            "account_type": user_data.account_type,
            "company_name": user_data.company_name,
            "bio": user_data.bio,
            "location": user_data.location,
            "skills": user_data.skills,
            "interests": user_data.interests,
            "portfolio_links": user_data.portfolio_links,
            "avatar_url": user_data.avatar_url,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await self.collection.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        
        # Create response object without hashed_password and with proper id field
        response_data = {k: v for k, v in user_doc.items() if k != "hashed_password"}
        response_data["id"] = response_data.pop("_id")  # Convert _id to id
        return UserResponse(**response_data)
    
    async def get_users(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        skills: Optional[List[str]] = None
    ) -> UserListResponse:
        """Get users with filtering and pagination."""
        # Build filter
        filter_clauses = []
        if search:
            filter_clauses.append({
                "$or": [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"email": {"$regex": search, "$options": "i"}}
                ]
            })
        if skills:
            for skill in skills:
                filter_clauses.append({
                    "skills": {"$elemMatch": {"$regex": skill, "$options": "i"}}
                })
        if filter_clauses:
            filter_query = {"$and": filter_clauses} if len(filter_clauses) > 1 else filter_clauses[0]
        else:
            filter_query = {}
        # Get total count
        total = await self.collection.count_documents(filter_query)
        # Get users
        cursor = self.collection.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            user_doc["_id"] = str(user_doc["_id"])
            # Convert _id to id for UserResponse
            user_doc["id"] = user_doc.pop("_id")
            users.append(UserResponse(**user_doc))
        return UserListResponse(
            users=users,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email (returns UserInDB with hashed_password)."""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            user_doc["_id"] = str(user_doc["_id"])
            return UserInDB(**user_doc)
        return None
    
    async def get_user_response_by_email(self, email: str) -> Optional[UserResponse]:
        """Get user by email (returns UserResponse without hashed_password)."""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            user_doc["_id"] = str(user_doc["_id"])
            # Convert _id to id for UserResponse
            user_doc["id"] = user_doc.pop("_id")
            return UserResponse(**user_doc)
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID."""
        try:
            user_doc = await self.collection.find_one({"_id": ObjectId(user_id)})
            if user_doc:
                user_doc["_id"] = str(user_doc["_id"])
                # Convert _id to id for UserResponse
                user_doc["id"] = user_doc.pop("_id")
                return UserResponse(**user_doc)
        except Exception:
            pass
        return None
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> UserResponse:
        """Update user information."""
        update_data = user_data.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data to update"
            )
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Return updated user
        return await self.get_user_by_id(user_id)
    
    async def delete_user(self, user_id: str) -> dict:
        """Delete a user."""
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "User deleted successfully"}
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticate user with email and password."""
        user = await self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


user_service = UserService() 