from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Query
from fastapi.responses import FileResponse
import os
import aiofiles
from typing import Optional, List
from ..models.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from ..models.team import TeamResponse, TeamApplication, TeamInvitation
from ..services.user_service import user_service
from ..services.team_service import team_service
from ..auth.jwt import get_current_user
from ..config import settings
import logging

# Set up logging to file
log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../app.log')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in name or email"),
    skills: Optional[str] = Query(None, description="Comma-separated list of skills to filter by")
):
    """Get users with filtering and pagination."""
    try:
        skip = (page - 1) * limit
        skills_list = [s.strip() for s in skills.split(",")] if skills else None
        return await user_service.get_users(skip=skip, limit=limit, search=search, skills=skills_list)
    except Exception as e:
        logger.error(f"Error in get_users: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get users"
        )


# ME endpoints - must come before /{user_id} endpoints to avoid conflicts
@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user=Depends(get_current_user)):
    """Get current user's profile."""
    try:
        user = await user_service.get_user_response_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user profile"
        )


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    user_data: UserUpdate,
    current_user=Depends(get_current_user)
):
    """Update current user's profile."""
    try:
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        updated_user = await user_service.update_user(user.id, user_data)
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    """Upload user avatar."""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Validate file size
        if file.size and file.size > settings.max_file_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size too large"
            )
        
        # Create upload directory if it doesn't exist
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"avatar_{current_user.email}_{os.urandom(8).hex()}{file_extension}"
        file_path = os.path.join(settings.upload_dir, filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Update user avatar URL
        avatar_url = f"/uploads/{filename}"
        user = await user_service.get_user_by_email(current_user.email)
        if user:
            await user_service.update_user(user.id, UserUpdate(avatar_url=avatar_url))
        
        return {"avatar_url": avatar_url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload avatar"
        )


@router.get("/me/teams", response_model=List[TeamResponse])
async def get_user_teams(current_user=Depends(get_current_user)):
    """Get teams the authenticated user is a member of."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        teams = await team_service.get_user_teams(user.id)
        return teams
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user teams"
        )


@router.get("/me/team-invitations", response_model=List[TeamInvitation])
async def get_user_team_invitations(current_user=Depends(get_current_user)):
    """Get pending team invitations for the authenticated user."""
    try:
        invitations = await team_service.get_user_invitations(current_user.email)
        return invitations
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get team invitations"
        )


@router.post("/me/team-invitations/{invitation_id}/accept")
async def accept_team_invitation(
    invitation_id: str,
    current_user=Depends(get_current_user)
):
    """Accept a team invitation."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.accept_invitation(invitation_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to accept invitation"
        )


@router.post("/me/team-invitations/{invitation_id}/decline")
async def decline_team_invitation(
    invitation_id: str,
    current_user=Depends(get_current_user)
):
    """Decline a team invitation."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.decline_invitation(invitation_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to decline invitation"
        )


@router.get("/me/team-applications", response_model=List[TeamApplication])
async def get_user_team_applications(current_user=Depends(get_current_user)):
    """Get team applications submitted by the authenticated user."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        applications = await team_service.get_user_applications(user.id)
        return applications
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get team applications"
        )


# User ID endpoints - must come after /me endpoints
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get a specific user by ID."""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user"
        )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user=Depends(get_current_user)
):
    """Update a user."""
    try:
        # Get current user's full profile to get their ID
        current_user_profile = await user_service.get_user_by_email(current_user.email)
        if not current_user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Current user not found"
            )
        
        # Check if user is updating their own profile
        if current_user_profile.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this user"
            )
        
        user = await user_service.update_user(user_id, user_data)
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a user."""
    try:
        # Get current user's full profile to get their ID
        current_user_profile = await user_service.get_user_by_email(current_user.email)
        if not current_user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Current user not found"
            )
        
        # Check if user is deleting their own account
        if current_user_profile.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this user"
            )
        
        result = await user_service.delete_user(user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )


@router.get("/{user_id}/profile", response_model=UserResponse)
async def get_user_profile(user_id: str):
    """Get public user profile by ID."""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user profile"
        ) 