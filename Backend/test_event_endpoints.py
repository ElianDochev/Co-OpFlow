#!/usr/bin/env python3
"""
Test script for events endpoints
"""
import asyncio
import aiohttp
import json
from datetime import datetime, timedelta, timezone

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"

async def get_auth_token(session, email, password):
    """Get authentication token"""
    login_data = {
        "email": email,
        "password": password
    }
    
    async with session.post(f"{BASE_URL}/api/v1/auth/login", json=login_data) as response:
        if response.status == 200:
            data = await response.json()
            return data.get("access_token")
        else:
            print(f"Login failed: {response.status}")
            return None

async def test_create_event(session, token):
    """Test creating an event"""
    print("\n=== Testing Create Event ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create event data
    event_data = {
        "title": "Test Event",
        "description": "This is a test event for testing purposes",
        "category": "workshop",
        "location_type": "online",
        "location": "Zoom Meeting",
        "start_date": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "end_date": (datetime.now(timezone.utc) + timedelta(days=7, hours=2)).isoformat(),
        "max_participants": 50,
        "tags": ["test", "workshop", "online"]
    }
    
    async with session.post(f"{BASE_URL}/api/v1/events/", json=event_data, headers=headers) as response:
        print(f"Status: {response.status}")
        response_text = await response.text()
        print(f"Response: {response_text}")
        
        if response.status == 201 or response.status == 200:
            try:
                data = await response.json()
                print("✅ Event created successfully!")
                print(f"Event ID: {data.get('id')}")
                print(f"Title: {data.get('title')}")
                print(f"Organizer: {data.get('organizer_name')}")
                return data.get('id')
            except json.JSONDecodeError:
                print(f"❌ Failed to parse JSON response: {response_text}")
                return None
        else:
            print(f"❌ Failed to create event: {response_text}")
            return None

async def test_get_events(session):
    """Test getting events list"""
    print("\n=== Testing Get Events ===")
    
    async with session.get(f"{BASE_URL}/api/v1/events/") as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Events retrieved successfully!")
            print(f"Total events: {data.get('total')}")
            print(f"Events in response: {len(data.get('events', []))}")
            return data.get('events', [])
        else:
            error_data = await response.text()
            print(f"❌ Failed to get events: {error_data}")
            return []

async def test_get_event_by_id(session, event_id):
    """Test getting a specific event"""
    print(f"\n=== Testing Get Event by ID: {event_id} ===")
    
    async with session.get(f"{BASE_URL}/api/v1/events/{event_id}") as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Event retrieved successfully!")
            print(f"Title: {data.get('title')}")
            print(f"Description: {data.get('description')}")
            print(f"Category: {data.get('category')}")
            print(f"Participants count: {data.get('participants_count')}")
            return data
        else:
            error_data = await response.text()
            print(f"❌ Failed to get event: {error_data}")
            return None

async def test_update_event(session, token, event_id):
    """Test updating an event"""
    print(f"\n=== Testing Update Event: {event_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "title": "Updated Test Event",
        "description": "This is an updated test event description",
        "tags": ["updated", "test", "workshop"]
    }
    
    async with session.put(f"{BASE_URL}/api/v1/events/{event_id}", json=update_data, headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Event updated successfully!")
            print(f"Updated title: {data.get('title')}")
            print(f"Updated description: {data.get('description')}")
            return data
        else:
            error_data = await response.text()
            print(f"❌ Failed to update event: {error_data}")
            return None

async def test_register_for_event(session, token, event_id):
    """Test registering for an event"""
    print(f"\n=== Testing Register for Event: {event_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.post(f"{BASE_URL}/api/v1/events/{event_id}/register", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Registered for event successfully!")
            print(f"Message: {data.get('message')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to register for event: {error_data}")
            return False

async def test_unregister_from_event(session, token, event_id):
    """Test unregistering from an event"""
    print(f"\n=== Testing Unregister from Event: {event_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.post(f"{BASE_URL}/api/v1/events/{event_id}/unregister", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Unregistered from event successfully!")
            print(f"Message: {data.get('message')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to unregister from event: {error_data}")
            return False

async def test_delete_event(session, token, event_id):
    """Test deleting an event"""
    print(f"\n=== Testing Delete Event: {event_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.delete(f"{BASE_URL}/api/v1/events/{event_id}", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Event deleted successfully!")
            print(f"Message: {data.get('message')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to delete event: {error_data}")
            return False

async def main():
    """Main test function"""
    print("🚀 Starting Events Endpoints Test")
    
    async with aiohttp.ClientSession() as session:
        # Get authentication token
        token = await get_auth_token(session, TEST_EMAIL, TEST_PASSWORD)
        if not token:
            print("❌ Authentication failed. Please make sure the server is running and the test user exists.")
            return
        
        print(f"✅ Authentication successful. Token: {token[:20]}...")
        
        # Test creating an event
        event_id = await test_create_event(session, token)
        if not event_id:
            print("❌ Cannot continue without a valid event ID")
            return
        
        # Test getting events list
        await test_get_events(session)
        
        # Test getting specific event
        await test_get_event_by_id(session, event_id)
        
        # Test updating event
        await test_update_event(session, token, event_id)
        
        # Test registering for event
        await test_register_for_event(session, token, event_id)
        
        # Test unregistering from event
        await test_unregister_from_event(session, token, event_id)
        
        # Test deleting event
        await test_delete_event(session, token, event_id)
        
        print("\n🎉 All tests completed!")

if __name__ == "__main__":
    asyncio.run(main()) 