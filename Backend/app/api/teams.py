from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from ..models.team import (
    TeamCreate, TeamUpdate, TeamResponse, TeamListResponse,
    TeamApplicationCreate, TeamInvitationCreate, TeamApplication, TeamInvitation
)
from ..services.team_service import team_service
from ..services.user_service import user_service
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("/", response_model=TeamListResponse)
async def get_teams(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    skills: Optional[List[str]] = Query(None, description="Filter by skills"),
    location: Optional[str] = Query(None, description="Filter by location"),
    search: Optional[str] = Query(None, description="Search in name or description")
):
    """Get teams with filtering and pagination."""
    try:
        skip = (page - 1) * limit
        return await team_service.get_teams(
            skip=skip,
            limit=limit,
            skills=skills,
            location=location,
            search=search
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get teams"
        )


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: str):
    """Get a specific team by ID."""
    try:
        team = await team_service.get_team_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        return team
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get team"
        )


@router.post("/", response_model=TeamResponse)
async def create_team(
    team_data: TeamCreate,
    current_user=Depends(get_current_user)
):
    """Create a new team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        team = await team_service.create_team(team_data, user.id)
        return team
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create team"
        )


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: str,
    team_data: TeamUpdate,
    current_user=Depends(get_current_user)
):
    """Update a team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        team = await team_service.update_team(team_id, team_data, user.id)
        return team
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update team"
        )


@router.delete("/{team_id}")
async def delete_team(
    team_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.delete_team(team_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete team"
        )


@router.post("/{team_id}/apply")
async def apply_to_team(
    team_id: str,
    application_data: TeamApplicationCreate,
    current_user=Depends(get_current_user)
):
    """Apply to join a team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.apply_to_team(team_id, application_data, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to apply to team"
        )


@router.post("/{team_id}/invite")
async def invite_user(
    team_id: str,
    invitation_data: TeamInvitationCreate,
    current_user=Depends(get_current_user)
):
    """Invite a user to join a team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.invite_user(team_id, invitation_data, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to invite user"
        )


@router.post("/{team_id}/leave")
async def leave_team(
    team_id: str,
    current_user=Depends(get_current_user)
):
    """Leave a team."""
    try:
        # Get user ID from email
        user = await user_service.get_user_by_email(current_user.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        result = await team_service.leave_team(team_id, user.id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to leave team"
        ) 