from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException, status
from ..database import get_collection
from ..models.team import (
    TeamCreate, TeamUpdate, TeamInDB, TeamResponse, TeamListResponse,
    TeamMember, TeamRole, TeamApplication, TeamInvitation,
    TeamApplicationCreate, TeamInvitationCreate, ApplicationStatus, InvitationStatus, TeamCategory
)
from ..services.user_service import user_service


class TeamService:
    @property
    def collection(self):
        return get_collection("teams")
    
    @property
    def applications_collection(self):
        return get_collection("team_applications")
    
    @property
    def invitations_collection(self):
        return get_collection("team_invitations")
    
    async def create_team(self, team_data: TeamCreate, creator_id: str) -> TeamResponse:
        """Create a new team."""
        print(f"[DEBUG] Incoming team_data: {team_data}")
        # Get creator info
        print(f"[DEBUG] Getting creator info for creator_id: {creator_id}")
        creator = await user_service.get_user_by_id(creator_id)
        if not creator:
            print("[ERROR] Creator not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        print(f"[DEBUG] Creator found: {creator}")
        
        # Create team document
        team_doc = {
            "name": team_data.name,
            "description": team_data.description,
            "skills": team_data.skills,
            "looking_for": team_data.looking_for,
            "location": team_data.location,
            "image_url": team_data.image_url,
            "category": team_data.category.value,
            "creator_id": creator_id,
            "lead_id": creator_id,
            "members": [
                {
                    "user_id": creator_id,
                    "user_name": creator.name,
                    "user_email": creator.email,
                    "role": TeamRole.LEAD.value,
                    "joined_at": datetime.now(timezone.utc)
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        print(f"[DEBUG] Constructed team_doc: {team_doc}")
        print("[DEBUG] Types in team_doc:")
        for k, v in team_doc.items():
            print(f"  {k}: {type(v)}")
        print("[DEBUG] Types in team_doc['members'][0]:")
        for k, v in team_doc['members'][0].items():
            print(f"  {k}: {type(v)}")
        try:
            print("[DEBUG] Inserting team_doc into MongoDB...")
            result = await self.collection.insert_one(team_doc)
            print(f"[DEBUG] Insert result: {result.inserted_id}")
        except Exception as e:
            print(f"[ERROR] Exception during insert_one: {e}")
            raise
        
        # Create response data with proper field mapping
        response_data = {
            "id": str(result.inserted_id),  # Map _id to id
            "name": team_data.name,
            "description": team_data.description,
            "skills": team_data.skills,
            "looking_for": team_data.looking_for,
            "location": team_data.location,
            "image_url": team_data.image_url,
            "category": team_data.category,
            "lead_id": creator_id,
            "lead_name": creator.name,
            "members_count": 1,
            "created_at": team_doc["created_at"].isoformat(),
            "updated_at": team_doc["updated_at"].isoformat()
        }
        print(f"[DEBUG] Returning TeamResponse: {response_data}")
        return TeamResponse(**response_data)
    
    async def get_team_by_id(self, team_id: str) -> Optional[TeamResponse]:
        """Get team by ID."""
        try:
            team_doc = await self.collection.find_one({"_id": ObjectId(team_id)})
            if team_doc:
                # Get lead name
                lead = await user_service.get_user_by_id(team_doc["lead_id"])
                lead_name = lead.name if lead else "Unknown"
                
                # Create response data with proper field mapping
                response_data = {
                    "id": str(team_doc["_id"]),  # Map _id to id
                    "name": team_doc["name"],
                    "description": team_doc["description"],
                    "skills": team_doc.get("skills", []),
                    "looking_for": team_doc.get("looking_for"),
                    "location": team_doc.get("location"),
                    "image_url": team_doc.get("image_url"),
                    "category": TeamCategory(team_doc["category"]) if not isinstance(team_doc["category"], TeamCategory) else team_doc["category"],
                    "lead_id": team_doc["lead_id"],
                    "lead_name": lead_name,
                    "members_count": len(team_doc.get("members", [])),
                    "created_at": team_doc["created_at"].isoformat(),
                    "updated_at": team_doc["updated_at"].isoformat()
                }
                
                return TeamResponse(**response_data)
        except Exception as e:
            print(f"Error getting team by ID {team_id}: {str(e)}")
        return None
    
    async def get_teams(
        self,
        skip: int = 0,
        limit: int = 10,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        search: Optional[str] = None,
        category: Optional[str] = None
    ) -> TeamListResponse:
        """Get teams with filtering and pagination."""
        # Build filter
        filter_query = {}
        if skills:
            filter_query["skills"] = {"$all": [{"$regex": skill, "$options": "i"} for skill in skills]}
        if location:
            filter_query["location"] = {"$regex": location, "$options": "i"}
        if search:
            filter_query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        if category:
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        
        # Get total count
        total = await self.collection.count_documents(filter_query)
        
        # Get teams
        cursor = self.collection.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        teams = []
        
        async for team_doc in cursor:
            # Get lead name
            lead = await user_service.get_user_by_id(team_doc["lead_id"])
            lead_name = lead.name if lead else "Unknown"
            
            # Create response data with proper field mapping
            response_data = {
                "id": str(team_doc["_id"]),  # Map _id to id
                "name": team_doc["name"],
                "description": team_doc["description"],
                "skills": team_doc.get("skills", []),
                "looking_for": team_doc.get("looking_for"),
                "location": team_doc.get("location"),
                "image_url": team_doc.get("image_url"),
                "category": TeamCategory(team_doc["category"]) if not isinstance(team_doc["category"], TeamCategory) else team_doc["category"],
                "lead_id": team_doc["lead_id"],
                "lead_name": lead_name,
                "members_count": len(team_doc.get("members", [])),
                "created_at": team_doc["created_at"].isoformat(),
                "updated_at": team_doc["updated_at"].isoformat()
            }
            
            teams.append(TeamResponse(**response_data))
        
        return TeamListResponse(
            teams=teams,
            total=total,
            page=skip // limit + 1,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=skip > 0
        )
    
    async def update_team(self, team_id: str, team_data: TeamUpdate, user_id: str) -> TeamResponse:
        """Update team information."""
        # Check if user is the team lead
        team = await self.get_team_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team.lead_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this team"
            )
        
        update_data = team_data.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data to update"
            )
        
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(team_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Return updated team
        return await self.get_team_by_id(team_id)
    
    async def delete_team(self, team_id: str, user_id: str) -> dict:
        """Delete a team."""
        # Check if user is the team lead
        team = await self.get_team_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team.lead_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this team"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(team_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        return {"message": "Team deleted successfully"}
    
    async def apply_to_team(self, team_id: str, application_data: TeamApplicationCreate, user_id: str) -> dict:
        """Apply to join a team."""
        # Check if team exists
        team = await self.get_team_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get user info
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if already applied
        existing_application = await self.applications_collection.find_one({
            "team_id": team_id,
            "user_id": user_id
        })
        
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already applied to this team"
            )
        
        # Create application
        application_doc = {
            "team_id": team_id,
            "user_id": user_id,
            "user_name": user.name,
            "user_email": user.email,
            "cover_letter": application_data.cover_letter,
            "role": application_data.role,
            "status": ApplicationStatus.PENDING,
            "created_at": datetime.now(timezone.utc)
        }
        
        await self.applications_collection.insert_one(application_doc)
        
        return {"message": "Application submitted successfully"}
    
    async def invite_user(self, team_id: str, invitation_data: TeamInvitationCreate, inviter_id: str) -> dict:
        """Invite a user to join a team."""
        # Check if user is the team lead
        team = await self.get_team_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team.lead_id != inviter_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to invite users to this team"
            )
        
        # Get inviter info
        inviter = await user_service.get_user_by_id(inviter_id)
        if not inviter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if already invited
        existing_invitation = await self.invitations_collection.find_one({
            "team_id": team_id,
            "invitee_email": invitation_data.email
        })
        
        if existing_invitation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already invited to this team"
            )
        
        # Create invitation
        invitation_doc = {
            "team_id": team_id,
            "team_name": team.name,
            "inviter_id": inviter_id,
            "inviter_name": inviter.name,
            "invitee_email": invitation_data.email,
            "role": invitation_data.role,
            "message": invitation_data.message,
            "status": InvitationStatus.PENDING,
            "created_at": datetime.now(timezone.utc)
        }
        
        await self.invitations_collection.insert_one(invitation_doc)
        
        return {"message": "Invitation sent successfully"}
    
    async def leave_team(self, team_id: str, user_id: str) -> dict:
        """Leave a team."""
        # Check if team exists
        team_doc = await self.collection.find_one({"_id": ObjectId(team_id)})
        if not team_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if user is the lead
        if team_doc["lead_id"] == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team lead cannot leave the team. Transfer leadership or delete the team."
            )
        
        # Remove user from members
        result = await self.collection.update_one(
            {"_id": ObjectId(team_id)},
            {"$pull": {"members": {"user_id": user_id}}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        return {"message": "Left team successfully"}
    
    async def get_user_teams(self, user_id: str) -> List[TeamResponse]:
        """Get teams the user is a member of."""
        cursor = self.collection.find({"members.user_id": user_id})
        teams = []
        
        async for team_doc in cursor:
            # Get lead name
            lead = await user_service.get_user_by_id(team_doc["lead_id"])
            lead_name = lead.name if lead else "Unknown"
            
            # Create response data with proper field mapping
            response_data = {
                "id": str(team_doc["_id"]),  # Map _id to id
                "name": team_doc["name"],
                "description": team_doc["description"],
                "skills": team_doc.get("skills", []),
                "looking_for": team_doc.get("looking_for"),
                "location": team_doc.get("location"),
                "image_url": team_doc.get("image_url"),
                "category": TeamCategory(team_doc["category"]) if not isinstance(team_doc["category"], TeamCategory) else team_doc["category"],
                "lead_id": team_doc["lead_id"],
                "lead_name": lead_name,
                "members_count": len(team_doc.get("members", [])),
                "created_at": team_doc["created_at"].isoformat(),
                "updated_at": team_doc["updated_at"].isoformat()
            }
            
            teams.append(TeamResponse(**response_data))
        
        return teams
    
    async def get_user_invitations(self, user_email: str) -> List[TeamInvitation]:
        """Get pending invitations for a user."""
        cursor = self.invitations_collection.find({
            "invitee_email": user_email,
            "status": InvitationStatus.PENDING
        })
        
        invitations = []
        async for invitation_doc in cursor:
            invitation_doc["_id"] = str(invitation_doc["_id"])
            invitations.append(TeamInvitation(**invitation_doc))
        
        return invitations
    
    async def accept_invitation(self, invitation_id: str, user_id: str) -> dict:
        """Accept a team invitation."""
        # Get invitation
        invitation_doc = await self.invitations_collection.find_one({"_id": ObjectId(invitation_id)})
        if not invitation_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found"
            )
        
        # Check if invitation is for this user
        user = await user_service.get_user_by_id(user_id)
        if not user or user.email != invitation_doc["invitee_email"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to accept this invitation"
            )
        
        # Check if invitation is still pending
        if invitation_doc["status"] != InvitationStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invitation is no longer pending"
            )
        
        # Add user to team
        await self.collection.update_one(
            {"_id": ObjectId(invitation_doc["team_id"])},
            {
                "$push": {
                    "members": {
                        "user_id": user_id,
                        "user_name": user.name,
                        "user_email": user.email,
                        "role": invitation_doc["role"],
                        "joined_at": datetime.now(timezone.utc)
                    }
                }
            }
        )
        
        # Update invitation status
        await self.invitations_collection.update_one(
            {"_id": ObjectId(invitation_id)},
            {"$set": {"status": InvitationStatus.ACCEPTED}}
        )
        
        return {"message": "Invitation accepted successfully"}
    
    async def decline_invitation(self, invitation_id: str, user_id: str) -> dict:
        """Decline a team invitation."""
        # Get invitation
        invitation_doc = await self.invitations_collection.find_one({"_id": ObjectId(invitation_id)})
        if not invitation_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found"
            )
        
        # Check if invitation is for this user
        user = await user_service.get_user_by_id(user_id)
        if not user or user.email != invitation_doc["invitee_email"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to decline this invitation"
            )
        
        # Update invitation status
        await self.invitations_collection.update_one(
            {"_id": ObjectId(invitation_id)},
            {"$set": {"status": InvitationStatus.DECLINED}}
        )
        
        return {"message": "Invitation declined successfully"}
    
    async def get_user_applications(self, user_id: str) -> List[TeamApplication]:
        """Get applications submitted by a user."""
        cursor = self.applications_collection.find({"user_id": user_id})
        
        applications = []
        async for application_doc in cursor:
            application_doc["_id"] = str(application_doc["_id"])
            applications.append(TeamApplication(**application_doc))
        
        return applications


team_service = TeamService() 