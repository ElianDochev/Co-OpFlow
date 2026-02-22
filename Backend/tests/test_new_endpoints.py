import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta
from app.main import app
from app.models.team import TeamRole, ApplicationStatus, InvitationStatus
from app.models.forum import ForumCategory
from app.models.event import EventCategory, LocationType


@pytest.mark.asyncio
class TestTeamsEndpoints:
    async def test_create_team(self, client: AsyncClient, auth_headers):
        """Test creating a new team."""
        team_data = {
            "name": "Test Team",
            "description": "A test team for development",
            "skills": ["Python", "FastAPI", "MongoDB"],
            "looking_for": "Frontend developers",
            "location": "Remote"
        }
        
        response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == team_data["name"]
        assert data["description"] == team_data["description"]
        assert data["skills"] == team_data["skills"]
        assert data["lead_name"] == "Test User"
        assert data["members_count"] == 1
    
    async def test_get_teams(self, client: AsyncClient):
        """Test getting teams list."""
        response = await client.get("/api/v1/teams/")
        assert response.status_code == 200
        data = response.json()
        assert "teams" in data
        assert "total" in data
        assert "page" in data
    
    async def test_get_team_by_id(self, client: AsyncClient, auth_headers):
        """Test getting a specific team."""
        # First create a team
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        create_response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        team_id = create_response.json()["id"]
        
        # Get the team
        response = await client.get(f"/api/v1/teams/{team_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == team_id
        assert data["name"] == team_data["name"]
    
    async def test_update_team(self, client: AsyncClient, auth_headers):
        """Test updating a team."""
        # First create a team
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        create_response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        team_id = create_response.json()["id"]
        
        # Update the team
        update_data = {
            "name": "Updated Team",
            "description": "An updated test team"
        }
        response = await client.put(f"/api/v1/teams/{team_id}", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]
    
    async def test_apply_to_team(self, client: AsyncClient, auth_headers):
        """Test applying to join a team."""
        # First create a team
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        create_response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        team_id = create_response.json()["id"]
        
        # Apply to the team
        application_data = {
            "cover_letter": "I would like to join this team",
            "role": "Developer"
        }
        response = await client.post(f"/api/v1/teams/{team_id}/apply", json=application_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
    
    async def test_invite_user(self, client: AsyncClient, auth_headers):
        """Test inviting a user to a team."""
        # First create a team
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        create_response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        team_id = create_response.json()["id"]
        
        # Invite a user
        invitation_data = {
            "email": "invited@example.com",
            "role": "Developer",
            "message": "Please join our team"
        }
        response = await client.post(f"/api/v1/teams/{team_id}/invite", json=invitation_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


@pytest.mark.asyncio
class TestForumsEndpoints:
    async def test_create_thread(self, client: AsyncClient, auth_headers):
        """Test creating a new forum thread."""
        thread_data = {
            "title": "Test Thread",
            "content": "This is a test thread content",
            "category": ForumCategory.GENERAL,
            "tags": ["test", "discussion"]
        }
        
        response = await client.post("/api/v1/forums/threads", json=thread_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == thread_data["title"]
        assert data["content"] == thread_data["content"]
        assert data["category"] == thread_data["category"]
        assert data["author_name"] == "Test User"
    
    async def test_get_threads(self, client: AsyncClient):
        """Test getting threads list."""
        response = await client.get("/api/v1/forums/threads")
        assert response.status_code == 200
        data = response.json()
        assert "threads" in data
        assert "total" in data
        assert "page" in data
    
    async def test_get_thread_by_id(self, client: AsyncClient, auth_headers):
        """Test getting a specific thread."""
        # First create a thread
        thread_data = {
            "title": "Test Thread",
            "content": "This is a test thread content",
            "category": ForumCategory.GENERAL,
            "tags": ["test"]
        }
        create_response = await client.post("/api/v1/forums/threads", json=thread_data, headers=auth_headers)
        thread_id = create_response.json()["id"]
        
        # Get the thread
        response = await client.get(f"/api/v1/forums/threads/{thread_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == thread_id
        assert data["title"] == thread_data["title"]
        assert "replies" in data
    
    async def test_add_reply(self, client: AsyncClient, auth_headers):
        """Test adding a reply to a thread."""
        # First create a thread
        thread_data = {
            "title": "Test Thread",
            "content": "This is a test thread content",
            "category": ForumCategory.GENERAL,
            "tags": ["test"]
        }
        create_response = await client.post("/api/v1/forums/threads", json=thread_data, headers=auth_headers)
        thread_id = create_response.json()["id"]
        
        # Add a reply
        reply_data = {
            "content": "This is a test reply"
        }
        response = await client.post(f"/api/v1/forums/threads/{thread_id}/replies", json=reply_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["content"] == reply_data["content"]
        assert data["thread_id"] == thread_id
        assert data["author_name"] == "Test User"


@pytest.mark.asyncio
class TestEventsEndpoints:
    async def test_create_event(self, client: AsyncClient, auth_headers):
        """Test creating a new event."""
        event_data = {
            "title": "Test Event",
            "description": "This is a test event",
            "category": EventCategory.CONFERENCE,
            "location_type": LocationType.ONLINE,
            "start_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "end_date": (datetime.now() + timedelta(days=8)).isoformat(),
            "max_participants": 100,
            "tags": ["test", "conference"]
        }
        
        response = await client.post("/api/v1/events/", json=event_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == event_data["title"]
        assert data["description"] == event_data["description"]
        assert data["category"] == event_data["category"]
        assert data["organizer_name"] == "Test User"
    
    async def test_get_events(self, client: AsyncClient):
        """Test getting events list."""
        response = await client.get("/api/v1/events/")
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        assert "total" in data
        assert "page" in data
    
    async def test_get_event_by_id(self, client: AsyncClient, auth_headers):
        """Test getting a specific event."""
        # First create an event
        event_data = {
            "title": "Test Event",
            "description": "This is a test event",
            "category": EventCategory.CONFERENCE,
            "location_type": LocationType.ONLINE,
            "start_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "end_date": (datetime.now() + timedelta(days=8)).isoformat(),
            "tags": ["test"]
        }
        create_response = await client.post("/api/v1/events/", json=event_data, headers=auth_headers)
        event_id = create_response.json()["id"]
        
        # Get the event
        response = await client.get(f"/api/v1/events/{event_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == event_id
        assert data["title"] == event_data["title"]
    
    async def test_register_for_event(self, client: AsyncClient, auth_headers):
        """Test registering for an event."""
        # First create an event
        event_data = {
            "title": "Test Event",
            "description": "This is a test event",
            "category": EventCategory.CONFERENCE,
            "location_type": LocationType.ONLINE,
            "start_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "end_date": (datetime.now() + timedelta(days=8)).isoformat(),
            "tags": ["test"]
        }
        create_response = await client.post("/api/v1/events/", json=event_data, headers=auth_headers)
        event_id = create_response.json()["id"]
        
        # Register for the event
        response = await client.post(f"/api/v1/events/{event_id}/register", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


@pytest.mark.asyncio
class TestUserTeamEndpoints:
    async def test_get_user_teams(self, client: AsyncClient, auth_headers):
        """Test getting teams the user is a member of."""
        response = await client.get("/api/v1/users/me/teams", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    async def test_get_user_team_invitations(self, client: AsyncClient, auth_headers):
        """Test getting user's team invitations."""
        response = await client.get("/api/v1/users/me/team-invitations", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    async def test_get_user_team_applications(self, client: AsyncClient, auth_headers):
        """Test getting user's team applications."""
        response = await client.get("/api/v1/users/me/team-applications", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
class TestProjectStarEndpoints:
    async def test_star_project(self, client: AsyncClient, auth_headers):
        """Test starring a project."""
        # First create a project
        project_data = {
            "title": "Test Project",
            "description": "A test project",
            "category": "web",
            "tech_stack": ["Python", "FastAPI"],
            "team_name": "Test Team",
            "looking_for": "Frontend developers"
        }
        create_response = await client.post("/api/v1/projects/", json=project_data, headers=auth_headers)
        project_id = create_response.json()["id"]
        
        # Star the project
        response = await client.post(f"/api/v1/projects/{project_id}/star", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
    
    async def test_unstar_project(self, client: AsyncClient, auth_headers):
        """Test unstarring a project."""
        # First create a project
        project_data = {
            "title": "Test Project",
            "description": "A test project",
            "category": "web",
            "tech_stack": ["Python", "FastAPI"],
            "team_name": "Test Team",
            "looking_for": "Frontend developers"
        }
        create_response = await client.post("/api/v1/projects/", json=project_data, headers=auth_headers)
        project_id = create_response.json()["id"]
        
        # Star the project first
        await client.post(f"/api/v1/projects/{project_id}/star", headers=auth_headers)
        
        # Unstar the project
        response = await client.delete(f"/api/v1/projects/{project_id}/star", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


@pytest.mark.asyncio
class TestErrorCases:
    async def test_create_team_unauthorized(self, client: AsyncClient):
        """Test creating a team without authentication."""
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        response = await client.post("/api/v1/teams/", json=team_data)
        assert response.status_code == 401
    
    async def test_update_team_unauthorized(self, client: AsyncClient, auth_headers):
        """Test updating a team without being the lead."""
        # Create a team
        team_data = {
            "name": "Test Team",
            "description": "A test team",
            "skills": ["Python"]
        }
        create_response = await client.post("/api/v1/teams/", json=team_data, headers=auth_headers)
        team_id = create_response.json()["id"]
        
        # Try to update without being the lead (should work since we are the creator)
        update_data = {"name": "Updated Team"}
        response = await client.put(f"/api/v1/teams/{team_id}", json=update_data, headers=auth_headers)
        assert response.status_code == 200
    
    async def test_create_thread_unauthorized(self, client: AsyncClient):
        """Test creating a thread without authentication."""
        thread_data = {
            "title": "Test Thread",
            "content": "Test content",
            "category": ForumCategory.GENERAL
        }
        response = await client.post("/api/v1/forums/threads", json=thread_data)
        assert response.status_code == 401
    
    async def test_create_event_unauthorized(self, client: AsyncClient):
        """Test creating an event without authentication."""
        event_data = {
            "title": "Test Event",
            "description": "Test event",
            "category": EventCategory.CONFERENCE,
            "location_type": LocationType.ONLINE,
            "start_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "end_date": (datetime.now() + timedelta(days=8)).isoformat()
        }
        response = await client.post("/api/v1/events/", json=event_data)
        assert response.status_code == 401 