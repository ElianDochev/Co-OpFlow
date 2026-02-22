import pytest
from httpx import AsyncClient


class TestUserEndpoints:
    """Test user management endpoints."""
    
    async def test_get_my_profile(self, client, auth_headers, sample_user_data):
        """Test getting current user's profile."""
        response = await client.get("/api/v1/users/me", headers=auth_headers)
        assert response.status_code == 200
        
        user = response.json()
        assert user["email"] == sample_user_data["email"]
        assert user["name"] == sample_user_data["name"]
        assert user["account_type"] == sample_user_data["account_type"]
        assert user["bio"] == sample_user_data["bio"]
        assert user["location"] == sample_user_data["location"]
        assert user["skills"] == sample_user_data["skills"]
        assert user["interests"] == sample_user_data["interests"]
        assert user["portfolio_links"] == sample_user_data["portfolio_links"]
    
    async def test_get_my_profile_unauthorized(self, client):
        """Test getting profile without authentication."""
        response = await client.get("/api/v1/users/me")
        assert response.status_code == 401
    
    async def test_update_my_profile(self, client, auth_headers):
        """Test updating current user's profile."""
        update_data = {
            "name": "Updated Name",
            "bio": "Updated bio",
            "location": "Updated City",
            "skills": ["Python", "FastAPI", "Docker"],
            "interests": ["Web Development", "DevOps"],
            "portfolio_links": ["https://github.com/updated", "https://linkedin.com/updated"]
        }
        
        response = await client.put("/api/v1/users/me", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        
        user = response.json()
        assert user["name"] == update_data["name"]
        assert user["bio"] == update_data["bio"]
        assert user["location"] == update_data["location"]
        assert user["skills"] == update_data["skills"]
        assert user["interests"] == update_data["interests"]
        assert user["portfolio_links"] == update_data["portfolio_links"]
    
    async def test_update_my_profile_partial(self, client, auth_headers):
        """Test partial profile update."""
        update_data = {
            "name": "Partial Update Name"
        }
        
        response = await client.put("/api/v1/users/me", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        
        user = response.json()
        assert user["name"] == update_data["name"]
        # Other fields should remain unchanged
        assert "bio" in user
        assert "location" in user
    
    async def test_update_my_profile_empty(self, client, auth_headers):
        """Test profile update with empty data."""
        response = await client.put("/api/v1/users/me", json={}, headers=auth_headers)
        assert response.status_code == 400
        assert "No data to update" in response.json()["detail"]
    
    async def test_update_my_profile_unauthorized(self, client):
        """Test profile update without authentication."""
        update_data = {"name": "Test"}
        response = await client.put("/api/v1/users/me", json=update_data)
        assert response.status_code == 401
    
    async def test_upload_avatar(self, client, auth_headers):
        """Test avatar upload."""
        # Create a simple test image file
        files = {
            "file": ("test_avatar.jpg", b"fake image data", "image/jpeg")
        }
        
        response = await client.post("/api/v1/users/me/avatar", files=files, headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "avatar_url" in data
        assert data["avatar_url"].startswith("/uploads/")
    
    async def test_upload_avatar_invalid_file_type(self, client, auth_headers):
        """Test avatar upload with invalid file type."""
        files = {
            "file": ("test.txt", b"not an image", "text/plain")
        }
        
        response = await client.post("/api/v1/users/me/avatar", files=files, headers=auth_headers)
        assert response.status_code == 400
        assert "File must be an image" in response.json()["detail"]
    
    async def test_upload_avatar_unauthorized(self, client):
        """Test avatar upload without authentication."""
        files = {
            "file": ("test_avatar.jpg", b"fake image data", "image/jpeg")
        }
        
        response = await client.post("/api/v1/users/me/avatar", files=files)
        assert response.status_code == 401
    
    async def test_get_user_profile(self, client, clean_db, sample_user_data):
        """Test getting public user profile by ID."""
        # Register a user first
        register_response = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert register_response.status_code == 200
        
        user_id = register_response.json()["user"]["id"]
        
        # Get public profile
        response = await client.get(f"/api/v1/users/{user_id}")
        assert response.status_code == 200
        
        user = response.json()
        assert user["email"] == sample_user_data["email"]
        assert user["name"] == sample_user_data["name"]
        assert user["account_type"] == sample_user_data["account_type"]
        assert "id" in user
        assert "created_at" in user
        assert "updated_at" in user
    
    async def test_get_user_profile_not_found(self, client):
        """Test getting non-existent user profile."""
        fake_user_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but doesn't exist
        response = await client.get(f"/api/v1/users/{fake_user_id}")
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
    
    async def test_get_user_profile_invalid_id(self, client):
        """Test getting user profile with invalid ID."""
        response = await client.get("/api/v1/users/invalid-id")
        assert response.status_code == 404 