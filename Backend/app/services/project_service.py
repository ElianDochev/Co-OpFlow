from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.project import ProjectCreate, ProjectUpdate, ProjectInDB, ProjectResponse, ProjectListResponse
from ..services.user_service import user_service
import logging

# Set up logging
logger = logging.getLogger(__name__)

class ProjectService:
    @property
    def collection(self):
        return get_collection("projects")
    
    async def create_project(self, project_data: ProjectCreate, creator_id: str) -> ProjectResponse:
        """Create a new project."""
        try:
            # Validate creator exists
            creator = await user_service.get_user_by_id(creator_id)
            if not creator:
                logger.error(f"Creator with ID {creator_id} not found")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Creator with ID {creator_id} not found"
                )
            
            # Create project document
            project_doc = {
                "title": project_data.title,
                "description": project_data.description,
                "category": project_data.category,
                "tech_stack": project_data.tech_stack or [],
                "team_name": project_data.team_name,
                "looking_for": project_data.looking_for,
                "image_url": project_data.image_url,
                "creator_id": creator_id,
                "likes_count": 0,
                "stars_count": 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            logger.info(f"Attempting to create project: {project_data.title} by user {creator_id}")
            
            # Insert project into database
            result = await self.collection.insert_one(project_doc)
            if not result.inserted_id:
                logger.error("Failed to insert project into database - no inserted_id returned")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to insert project into database"
                )
            
            logger.info(f"Successfully created project with ID: {result.inserted_id}")
            
            # Create response data with proper field mapping
            response_data = {
                "id": str(result.inserted_id),  # Map _id to id
                "title": project_data.title,
                "description": project_data.description,
                "category": project_data.category,
                "tech_stack": project_data.tech_stack or [],
                "team_name": project_data.team_name,
                "looking_for": project_data.looking_for,
                "image_url": project_data.image_url,
                "creator_id": creator_id,
                "creator_name": creator.name,
                "likes_count": 0,
                "stars_count": 0,
                "created_at": project_doc["created_at"],
                "updated_at": project_doc["updated_at"]
            }
            
            # Return project response
            return ProjectResponse(**response_data)
            
        except HTTPException:
            # Re-raise HTTP exceptions as they already have proper error details
            raise
        except Exception as e:
            logger.error(f"Unexpected error creating project: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create project: {str(e)}"
            )
    
    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        """Get project by ID."""
        try:
            project_doc = await self.collection.find_one({"_id": ObjectId(project_id)})
            if project_doc:
                # Get creator name
                creator = await user_service.get_user_by_id(project_doc["creator_id"])
                creator_name = creator.name if creator else "Unknown"
                
                # Create response data with proper field mapping
                response_data = {
                    "id": str(project_doc["_id"]),  # Map _id to id
                    "title": project_doc["title"],
                    "description": project_doc["description"],
                    "category": project_doc["category"],
                    "tech_stack": project_doc.get("tech_stack", []),
                    "team_name": project_doc.get("team_name"),
                    "looking_for": project_doc.get("looking_for"),
                    "image_url": project_doc.get("image_url"),
                    "creator_id": project_doc["creator_id"],
                    "creator_name": creator_name,
                    "likes_count": project_doc.get("likes_count", 0),
                    "stars_count": project_doc.get("stars_count", 0),
                    "created_at": project_doc["created_at"],
                    "updated_at": project_doc["updated_at"]
                }
                
                return ProjectResponse(**response_data)
        except Exception as e:
            logger.error(f"Error getting project by ID {project_id}: {str(e)}")
        return None
    
    async def get_projects(
        self,
        skip: int = 0,
        limit: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at"
    ) -> ProjectListResponse:
        """Get projects with filtering and pagination."""
        # Build filter
        filter_query = {}
        if category:
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        if search:
            filter_query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"team_name": {"$regex": search, "$options": "i"}}
            ]
        
        # Build sort
        if sort_by in ["created_at", "likes_count", "stars_count"]:
            sort_direction = -1
        else:
            sort_direction = 1
        sort_query = [(sort_by, sort_direction)]
        
        # Get total count
        total = await self.collection.count_documents(filter_query)
        
        # Get projects
        cursor = self.collection.find(filter_query).sort(sort_query).skip(skip).limit(limit)
        projects = []
        
        async for project_doc in cursor:
            # Get creator name
            creator = await user_service.get_user_by_id(project_doc["creator_id"])
            creator_name = creator.name if creator else "Unknown"
            
            # Create response data with proper field mapping
            response_data = {
                "id": str(project_doc["_id"]),  # Map _id to id
                "title": project_doc["title"],
                "description": project_doc["description"],
                "category": project_doc["category"],
                "tech_stack": project_doc.get("tech_stack", []),
                "team_name": project_doc.get("team_name"),
                "looking_for": project_doc.get("looking_for"),
                "image_url": project_doc.get("image_url"),
                "creator_id": project_doc["creator_id"],
                "creator_name": creator_name,
                "likes_count": project_doc.get("likes_count", 0),
                "stars_count": project_doc.get("stars_count", 0),
                "created_at": project_doc["created_at"],
                "updated_at": project_doc["updated_at"]
            }
            
            projects.append(ProjectResponse(**response_data))
        
        return ProjectListResponse(
            projects=projects,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def update_project(self, project_id: str, project_data: ProjectUpdate, user_id: str) -> ProjectResponse:
        """Update project information."""
        # Check if user is the creator
        project = await self.get_project_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        if project.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this project"
            )
        
        update_data = project_data.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data to update"
            )
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Return updated project
        return await self.get_project_by_id(project_id)
    
    async def delete_project(self, project_id: str, user_id: str) -> dict:
        """Delete a project."""
        # Check if user is the creator
        project = await self.get_project_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        if project.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this project"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(project_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        return {"message": "Project deleted successfully"}
    
    async def like_project(self, project_id: str, user_id: str) -> dict:
        """Like a project."""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(project_id)},
                {"$inc": {"likes_count": 1}}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            return {"message": "Project liked successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to like project"
            )
    
    async def unlike_project(self, project_id: str, user_id: str) -> dict:
        """Unlike a project."""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(project_id)},
                {"$inc": {"likes_count": -1}}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            return {"message": "Project unliked successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to unlike project"
            )
    
    async def star_project(self, project_id: str, user_id: str) -> dict:
        """Star a project."""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(project_id)},
                {"$inc": {"stars_count": 1}}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            return {"message": "Project starred successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to star project"
            )
    
    async def unstar_project(self, project_id: str, user_id: str) -> dict:
        """Unstar a project."""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(project_id)},
                {"$inc": {"stars_count": -1}}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            return {"message": "Project unstarred successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to unstar project"
            )


project_service = ProjectService() 