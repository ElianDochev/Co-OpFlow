import pytest
from httpx import AsyncClient


class TestProjectEndpoints:
    """Test project management endpoints."""
    
    async def test_create_project(self, client, auth_headers, sample_project_data):
        """Test creating a new project."""
        response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert response.status_code == 200
        
        project = response.json()
        assert project["title"] == sample_project_data["title"]
        assert project["description"] == sample_project_data["description"]
        assert project["category"] == sample_project_data["category"]
        assert project["tech_stack"] == sample_project_data["tech_stack"]
        assert project["team_name"] == sample_project_data["team_name"]
        assert project["looking_for"] == sample_project_data["looking_for"]
        assert "id" in project
        assert "creator_id" in project
        assert "creator_name" in project
        assert "likes_count" in project
        assert "stars_count" in project
        assert "created_at" in project
        assert "updated_at" in project
    
    async def test_create_project_unauthorized(self, client, sample_project_data):
        """Test creating project without authentication."""
        response = await client.post("/api/v1/projects/", json=sample_project_data)
        assert response.status_code == 401
    
    async def test_create_project_invalid_data(self, client, auth_headers):
        """Test creating project with invalid data."""
        # Missing required fields
        invalid_data = {"title": "Test Project"}
        response = await client.post("/api/v1/projects/", json=invalid_data, headers=auth_headers)
        assert response.status_code == 422
        
        # Title too short
        invalid_data = {
            "title": "",
            "description": "A test project",
            "category": "web_app"
        }
        response = await client.post("/api/v1/projects/", json=invalid_data, headers=auth_headers)
        assert response.status_code == 422
        
        # Invalid category
        invalid_data = {
            "title": "Test Project",
            "description": "A test project",
            "category": "invalid_category"
        }
        response = await client.post("/api/v1/projects/", json=invalid_data, headers=auth_headers)
        assert response.status_code == 422
    
    async def test_get_projects(self, client, clean_db, auth_headers, sample_project_data):
        """Test getting projects list."""
        # Create a project first
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        # Get projects
        response = await client.get("/api/v1/projects/")
        assert response.status_code == 200
        
        data = response.json()
        assert "projects" in data
        assert "total" in data
        assert "page" in data
        assert "limit" in data
        assert "has_next" in data
        assert "has_prev" in data
        
        projects = data["projects"]
        assert len(projects) == 1
        assert projects[0]["title"] == sample_project_data["title"]
        assert data["total"] == 1
        assert data["page"] == 1
        assert data["limit"] == 10
    
    async def test_get_projects_with_pagination(self, client, clean_db, auth_headers, sample_project_data):
        """Test getting projects with pagination."""
        # Create multiple projects
        for i in range(15):
            project_data = sample_project_data.copy()
            project_data["title"] = f"Project {i+1}"
            await client.post("/api/v1/projects/", json=project_data, headers=auth_headers)
        
        # Get first page
        response = await client.get("/api/v1/projects/?page=1&limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["projects"]) == 5
        assert data["total"] == 15
        assert data["page"] == 1
        assert data["limit"] == 5
        assert data["has_next"] is True
        assert data["has_prev"] is False
        
        # Get second page
        response = await client.get("/api/v1/projects/?page=2&limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["projects"]) == 5
        assert data["page"] == 2
        assert data["has_next"] is True
        assert data["has_prev"] is True
    
    async def test_get_projects_with_filtering(self, client, clean_db, auth_headers, sample_project_data):
        """Test getting projects with filtering."""
        # Create projects with different categories
        categories = ["web_app", "mobile_app", "ai_ml"]
        for i, category in enumerate(categories):
            project_data = sample_project_data.copy()
            project_data["title"] = f"Project {i+1}"
            project_data["category"] = category
            await client.post("/api/v1/projects/", json=project_data, headers=auth_headers)
        
        # Filter by category
        response = await client.get("/api/v1/projects/?category=web_app")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["projects"]) == 1
        assert data["projects"][0]["category"] == "web_app"
    
    async def test_get_projects_with_search(self, client, clean_db, auth_headers, sample_project_data):
        """Test getting projects with search."""
        # Create projects with different titles
        titles = ["Awesome Web App", "Mobile Game", "AI Chatbot"]
        for title in titles:
            project_data = sample_project_data.copy()
            project_data["title"] = title
            await client.post("/api/v1/projects/", json=project_data, headers=auth_headers)
        
        # Search for "Awesome"
        response = await client.get("/api/v1/projects/?search=Awesome")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["projects"]) == 1
        assert "Awesome" in data["projects"][0]["title"]
    
    async def test_get_project_by_id(self, client, clean_db, auth_headers, sample_project_data):
        """Test getting a specific project by ID."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Get the project
        response = await client.get(f"/api/v1/projects/{project_id}")
        assert response.status_code == 200
        
        project = response.json()
        assert project["id"] == project_id
        assert project["title"] == sample_project_data["title"]
        assert project["description"] == sample_project_data["description"]
    
    async def test_get_project_not_found(self, client):
        """Test getting non-existent project."""
        fake_project_id = "507f1f77bcf86cd799439011"
        response = await client.get(f"/api/v1/projects/{fake_project_id}")
        assert response.status_code == 404
        assert "Project not found" in response.json()["detail"]
    
    async def test_update_project(self, client, clean_db, auth_headers, sample_project_data):
        """Test updating a project."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Update the project
        update_data = {
            "title": "Updated Project Title",
            "description": "Updated project description",
            "tech_stack": ["React", "Node.js", "PostgreSQL"]
        }
        
        response = await client.put(f"/api/v1/projects/{project_id}", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        
        project = response.json()
        assert project["title"] == update_data["title"]
        assert project["description"] == update_data["description"]
        assert project["tech_stack"] == update_data["tech_stack"]
    
    async def test_update_project_unauthorized(self, client, clean_db, auth_headers, sample_project_data):
        """Test updating project without authentication."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Try to update without auth
        update_data = {"title": "Updated Title"}
        response = await client.put(f"/api/v1/projects/{project_id}", json=update_data)
        assert response.status_code == 401
    
    async def test_update_project_not_owner(self, client, clean_db, sample_project_data):
        """Test updating project by non-owner."""
        # Create first user and project
        user1_data = {
            "email": "user1@example.com",
            "password": "password123",
            "name": "User 1",
            "account_type": "personal"
        }
        
        register_response = await client.post("/api/v1/auth/register", json=user1_data)
        assert register_response.status_code == 200
        
        token1 = register_response.json()["access_token"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=headers1)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Create second user
        user2_data = {
            "email": "user2@example.com",
            "password": "password123",
            "name": "User 2",
            "account_type": "personal"
        }
        
        register_response2 = await client.post("/api/v1/auth/register", json=user2_data)
        assert register_response2.status_code == 200
        
        token2 = register_response2.json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        
        # Try to update project with second user
        update_data = {"title": "Updated Title"}
        response = await client.put(f"/api/v1/projects/{project_id}", json=update_data, headers=headers2)
        assert response.status_code == 403
        assert "Not authorized to update this project" in response.json()["detail"]
    
    async def test_delete_project(self, client, clean_db, auth_headers, sample_project_data):
        """Test deleting a project."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Delete the project
        response = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Project deleted successfully"
        
        # Verify project is deleted
        get_response = await client.get(f"/api/v1/projects/{project_id}")
        assert get_response.status_code == 404
    
    async def test_delete_project_unauthorized(self, client, clean_db, auth_headers, sample_project_data):
        """Test deleting project without authentication."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Try to delete without auth
        response = await client.delete(f"/api/v1/projects/{project_id}")
        assert response.status_code == 401
    
    async def test_like_project(self, client, clean_db, auth_headers, sample_project_data):
        """Test liking a project."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Like the project
        response = await client.post(f"/api/v1/projects/{project_id}/like", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Project liked successfully"
        
        # Check that likes count increased
        get_response = await client.get(f"/api/v1/projects/{project_id}")
        assert get_response.status_code == 200
        assert get_response.json()["likes_count"] == 1
    
    async def test_star_project(self, client, clean_db, auth_headers, sample_project_data):
        """Test starring a project."""
        # Create a project
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=auth_headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Star the project
        response = await client.post(f"/api/v1/projects/{project_id}/star", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Project starred successfully"
        
        # Check that stars count increased
        get_response = await client.get(f"/api/v1/projects/{project_id}")
        assert get_response.status_code == 200
        assert get_response.json()["stars_count"] == 1
    
    async def test_like_star_unauthorized(self, client, clean_db, sample_project_data):
        """Test like/star without authentication."""
        # Create a project without auth (this should fail, but let's test the like/star endpoints)
        # We'll need to create it with auth first
        user_data = {
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User",
            "account_type": "personal"
        }
        
        register_response = await client.post("/api/v1/auth/register", json=user_data)
        assert register_response.status_code == 200
        
        token = register_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        create_response = await client.post("/api/v1/projects/", json=sample_project_data, headers=headers)
        assert create_response.status_code == 200
        
        project_id = create_response.json()["id"]
        
        # Try to like without auth
        response = await client.post(f"/api/v1/projects/{project_id}/like")
        assert response.status_code == 401
        
        # Try to star without auth
        response = await client.post(f"/api/v1/projects/{project_id}/star")
        assert response.status_code == 401 