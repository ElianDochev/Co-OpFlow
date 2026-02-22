import pytest
from httpx import AsyncClient


class TestAuthEndpoints:
    """Test authentication endpoints."""
    
    async def test_register_success(self, client, clean_db, sample_user_data):
        """Test successful user registration."""
        response = await client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert "access_token" in data
        assert "token_type" in data
        assert "user" in data
        assert data["token_type"] == "bearer"
        
        # Check user data
        user = data["user"]
        assert user["email"] == sample_user_data["email"]
        assert user["name"] == sample_user_data["name"]
        assert user["account_type"] == sample_user_data["account_type"]
        assert "id" in user
        assert "created_at" in user
        assert "updated_at" in user
        assert user["is_active"] is True
        
        # Check that password is not returned
        assert "password" not in user
        assert "hashed_password" not in user
    
    async def test_register_duplicate_email(self, client, clean_db, sample_user_data):
        """Test registration with duplicate email."""
        # Register first user
        response1 = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert response1.status_code == 200
        
        # Try to register with same email
        response2 = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert response2.status_code == 400
        assert "Email already registered" in response2.json()["detail"]
    
    async def test_register_invalid_data(self, client, clean_db):
        """Test registration with invalid data."""
        # Missing required fields
        invalid_data = {"email": "test@example.com"}
        response = await client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422
        
        # Invalid email
        invalid_data = {
            "email": "invalid-email",
            "password": "password123",
            "name": "Test User",
            "account_type": "personal"
        }
        response = await client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422
        
        # Password too short
        invalid_data = {
            "email": "test@example.com",
            "password": "123",
            "name": "Test User",
            "account_type": "personal"
        }
        response = await client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422
    
    async def test_login_success(self, client, clean_db, sample_user_data):
        """Test successful login."""
        # Register user first
        register_response = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert register_response.status_code == 200
        
        # Login
        login_data = {
            "email": sample_user_data["email"],
            "password": sample_user_data["password"]
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert "access_token" in data
        assert "token_type" in data
        assert "user" in data
        assert data["token_type"] == "bearer"
        
        # Check user data
        user = data["user"]
        assert user["email"] == sample_user_data["email"]
        assert user["name"] == sample_user_data["name"]
    
    async def test_login_invalid_credentials(self, client, clean_db, sample_user_data):
        """Test login with invalid credentials."""
        # Register user first
        register_response = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert register_response.status_code == 200
        
        # Wrong password
        login_data = {
            "email": sample_user_data["email"],
            "password": "wrongpassword"
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
        
        # Non-existent email
        login_data = {
            "email": "nonexistent@example.com",
            "password": sample_user_data["password"]
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    async def test_logout(self, client, auth_headers):
        """Test logout endpoint."""
        response = await client.post("/api/v1/auth/logout", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Logged out successfully"
    
    async def test_get_current_user(self, client, auth_headers, sample_user_data):
        """Test getting current user information."""
        response = await client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        
        user = response.json()
        assert user["email"] == sample_user_data["email"]
        assert user["name"] == sample_user_data["name"]
        assert user["account_type"] == sample_user_data["account_type"]
        assert "id" in user
        assert "created_at" in user
        assert "updated_at" in user
    
    async def test_get_current_user_unauthorized(self, client):
        """Test getting current user without authentication."""
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401
    
    async def test_register_startup_account(self, client, clean_db):
        """Test registration with startup account type."""
        startup_data = {
            "email": "startup@example.com",
            "password": "startup123",
            "name": "Startup User",
            "account_type": "startup",
            "company_name": "Test Startup Inc."
        }
        
        response = await client.post("/api/v1/auth/register", json=startup_data)
        assert response.status_code == 200
        
        data = response.json()
        user = data["user"]
        assert user["account_type"] == "startup"
        assert user["company_name"] == "Test Startup Inc." 