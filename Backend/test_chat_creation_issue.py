#!/usr/bin/env python3
"""
Test script to reproduce the chat creation issue
"""
import asyncio
import aiohttp
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"

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
            print(f"Login failed for {email}: {response.status}")
            return None

async def register_user(session, email, password, name):
    """Register a new user"""
    register_data = {
        "email": email,
        "password": password,
        "name": name,
        "account_type": "personal"
    }
    
    async with session.post(f"{BASE_URL}/api/v1/auth/register", json=register_data) as response:
        if response.status == 201:
            print(f"✅ User {email} registered successfully")
            return True
        elif response.status == 400:
            print(f"⚠️ User {email} already exists")
            return True
        else:
            print(f"❌ Failed to register user {email}: {response.status}")
            return False

async def get_user_id(session, token, email):
    """Get user ID by email"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # First login with the email to get a token
    login_data = {"email": email, "password": "testpassword123"}
    async with session.post(f"{BASE_URL}/api/v1/auth/login", json=login_data) as response:
        if response.status == 200:
            login_data = await response.json()
            user_token = login_data.get("access_token")
            
            # Get user info
            headers = {"Authorization": f"Bearer {user_token}"}
            async with session.get(f"{BASE_URL}/api/v1/users/me", headers=headers) as response:
                if response.status == 200:
                    user_data = await response.json()
                    return user_data.get('id')
    return None

async def test_create_chat_with_valid_users(session, token, user1_id, user2_id):
    """Test creating a chat with valid user IDs"""
    print("\n=== Testing Create Chat with Valid Users ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a chat with the two valid user IDs
    chat_data = {
        "name": "Test Chat",
        "is_group": False,
        "participant_ids": [user1_id, user2_id]
    }
    
    print(f"Request payload: {json.dumps(chat_data, indent=2)}")
    
    async with session.post(f"{BASE_URL}/api/v1/messages/chats", json=chat_data, headers=headers) as response:
        print(f"Status: {response.status}")
        
        try:
            response_text = await response.text()
            print(f"Response body: {response_text}")
            
            if response.status == 201 or response.status == 200:
                data = json.loads(response_text)
                print("✅ Chat created successfully!")
                print(f"Chat ID: {data.get('id')}")
                print(f"Participants: {data.get('participant_names')}")
                return data.get('id')
            else:
                print(f"❌ Failed to create chat: {response_text}")
                return None
        except Exception as e:
            print(f"❌ Error parsing response: {str(e)}")
            return None

async def test_create_chat_with_exact_payload_format(session, token, user1_id, user2_id):
    """Test creating a chat with the exact payload format from the user"""
    print("\n=== Testing Create Chat with Exact Payload Format ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Exact payload format from the user but with valid user IDs
    chat_data = {
        "name": "Clown",
        "is_group": False,
        "participant_ids": [user1_id, user2_id]
    }
    
    print(f"Request payload: {json.dumps(chat_data, indent=2)}")
    
    async with session.post(f"{BASE_URL}/api/v1/messages/chats", json=chat_data, headers=headers) as response:
        print(f"Status: {response.status}")
        print(f"Response headers: {dict(response.headers)}")
        
        try:
            response_text = await response.text()
            print(f"Response body: {response_text}")
            
            if response.status == 201 or response.status == 200:
                data = json.loads(response_text)
                print("✅ Chat created successfully!")
                print(f"Chat ID: {data.get('id')}")
                print(f"Participants: {data.get('participant_names')}")
                return data.get('id')
            else:
                print(f"❌ Failed to create chat: {response_text}")
                return None
        except Exception as e:
            print(f"❌ Error parsing response: {str(e)}")
            return None

async def test_send_message(session, token, chat_id, content):
    """Test sending a message"""
    print(f"\n=== Testing Send Message to Chat: {chat_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    message_data = {
        "content": content,
        "message_type": "text"
    }
    
    async with session.post(f"{BASE_URL}/api/v1/messages/chats/{chat_id}/messages", json=message_data, headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 201 or response.status == 200:
            data = await response.json()
            print("✅ Message sent successfully!")
            print(f"Message ID: {data.get('id')}")
            print(f"Content: {data.get('content')}")
            print(f"Sender: {data.get('sender_name')}")
            return data.get('id')
        else:
            error_data = await response.text()
            print(f"❌ Failed to send message: {error_data}")
            return None

async def main():
    """Main test function"""
    print("🚀 Starting Chat Creation Issue Test")
    
    async with aiohttp.ClientSession() as session:
        # Register test users
        user1_email = "user1@example.com"
        user2_email = "user2@example.com"
        password = "testpassword123"
        
        await register_user(session, user1_email, password, "User One")
        await register_user(session, user2_email, password, "User Two")
        
        # Get authentication token for user1
        token = await get_auth_token(session, user1_email, password)
        
        if not token:
            print("❌ Authentication failed. Cannot continue.")
            return
        
        print(f"✅ Authentication successful")
        
        # Get user IDs
        user1_id = await get_user_id(session, token, user1_email)
        user2_id = await get_user_id(session, token, user2_email)
        
        if not user1_id or not user2_id:
            print("❌ Could not get user IDs. Cannot continue.")
            return
        
        print(f"User 1 ID: {user1_id}")
        print(f"User 2 ID: {user2_id}")
        
        # Test with exact payload format but valid user IDs
        chat_id = await test_create_chat_with_exact_payload_format(session, token, user1_id, user2_id)
        
        if chat_id:
            # Test sending a message
            await test_send_message(session, token, chat_id, "Hello from User One!")
        
        # Test with different format
        chat_id2 = await test_create_chat_with_valid_users(session, token, user1_id, user2_id)
        
        if chat_id2:
            # Test sending a message
            await test_send_message(session, token, chat_id2, "Hello from User One again!")
        
        print("\n🎉 Chat creation tests completed!")

if __name__ == "__main__":
    asyncio.run(main()) 