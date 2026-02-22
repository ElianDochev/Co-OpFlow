from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional
from ..models.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from ..services.project_service import project_service
from ..services.user_service import user_service
from ..auth.jwt import get_current_user
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=ProjectListResponse)
async def get_projects(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title, description, or team name"),
    sort_by: str = Query("created_at", description="Sort field")
):
    """Get projects with filtering and pagination."""
    try:
        skip = (page - 1) * limit
        return await project_service.get_projects(
            skip=skip,
            limit=limit,
            category=category,
            search=search,
            sort_by=sort_by
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get projects"
        )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a specific project by ID."""
    try:
        project = await project_service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get project"
        )


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user=Depends(get_current_user)
):
    """Create a new project."""
    try:
        logger.info(f"Creating project: {project_data.title} for user: {current_user.email}")
        
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            logger.error(f"User not found for email: {current_user.email}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User not found for email: {current_user.email}"
            )
        
        logger.info(f"Found user: {user.name} with ID: {user.id}")
        
        # Validate project data
        if not project_data.title or not project_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project title is required and cannot be empty"
            )
        
        if not project_data.description or not project_data.description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project description is required and cannot be empty"
            )
        
        if len(project_data.description) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project description must be at least 10 characters long"
            )
        
        # Create the project
        project = await project_service.create_project(project_data, user.id)
        logger.info(f"Successfully created project with ID: {project.id}")
        
        return project
        
    except HTTPException:
        # Re-raise HTTP exceptions as they already have proper error details
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating project: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user=Depends(get_current_user)
):
    """Update a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        project = await project_service.update_project(project_id, project_data, user.id)
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update project"
        )


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await project_service.delete_project(project_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete project"
        )


@router.post("/{project_id}/like")
async def like_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    """Like a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await project_service.like_project(project_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to like project"
        )


@router.delete("/{project_id}/like")
async def unlike_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    """Unlike a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await project_service.unlike_project(project_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unlike project"
        )


@router.post("/{project_id}/star")
async def star_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    """Star a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await project_service.star_project(project_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to star project"
        )


@router.delete("/{project_id}/star")
async def unstar_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    """Unstar a project."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await project_service.unstar_project(project_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unstar project"
        ) 