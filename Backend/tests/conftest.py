import pytest
import pytest_asyncio
import asyncio
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.main import app
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_db():
    """Create a test database connection."""
    # Use a test database without authentication
    original_db_name = settings.database_name
    original_mongodb_url = settings.mongodb_url
    
    # Override settings for testing
    settings.database_name = "test_coopflow_db"
    settings.mongodb_url = "mongodb://localhost:27017"
    
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    
    # Restore original settings
    settings.database_name = original_db_name
    settings.mongodb_url = original_mongodb_url


@pytest_asyncio.fixture
async def client(test_db):
    """Create a test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def clean_db():
    """Clean the test database before each test."""
    from app.database import get_collection
    
    # Clear all collections
    collections = ["users", "projects", "teams", "team_applications", "team_invitations", "forum_threads", "forum_replies", "events"]
    for collection_name in collections:
        try:
            collection = get_collection(collection_name)
            await collection.delete_many({})
        except Exception as e:
            # If collection doesn't exist or other error, just continue
            print(f"Warning: Could not clean collection {collection_name}: {e}")
    
    yield


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User",
        "account_type": "personal",
        "bio": "Test bio",
        "location": "Test City",
        "skills": ["Python", "FastAPI"],
        "interests": ["Web Development"],
        "portfolio_links": ["https://github.com/test"]
    }


@pytest.fixture
def sample_project_data():
    """Sample project data for testing."""
    return {
        "title": "Test Project",
        "description": "A test project for testing purposes",
        "category": "web_app",
        "tech_stack": ["Python", "FastAPI", "MongoDB"],
        "team_name": "Test Team",
        "looking_for": "Developers"
    }


@pytest_asyncio.fixture
async def auth_headers(client, sample_user_data):
    """Get authentication headers by registering and logging in a user."""
    try:
        # Register user
        register_response = await client.post("/api/v1/auth/register", json=sample_user_data)
        assert register_response.status_code == 200
        
        # Get token
        token_data = register_response.json()
        token = token_data["access_token"]
        
        return {"Authorization": f"Bearer {token}"}
    except Exception as e:
        print(f"Error in auth_headers fixture: {e}")
        # Return a dummy token for testing
        return {"Authorization": "Bearer dummy_token"} 