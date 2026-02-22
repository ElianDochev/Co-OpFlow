#!/usr/bin/env python3
"""
Test script for messaging and notification endpoints
"""
import asyncio
import aiohttp
import json
from datetime import datetime, timezone

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"
TEST_EMAIL_2 = "test2@example.com"
TEST_PASSWORD_2 = "testpassword123"

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
        else:
            print(f"❌ Failed to register user {email}: {response.status}")
            return False

async def test_create_chat(session, token, participant_ids):
    """Test creating a chat"""
    print("\n=== Testing Create Chat ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    chat_data = {
        "participant_ids": participant_ids,
        "is_group": False
    }
    
    async with session.post(f"{BASE_URL}/api/v1/messages/chats", json=chat_data, headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 201 or response.status == 200:
            data = await response.json()
            print("✅ Chat created successfully!")
            print(f"Chat ID: {data.get('id')}")
            print(f"Participants: {data.get('participant_names')}")
            return data.get('id')
        else:
            error_data = await response.text()
            print(f"❌ Failed to create chat: {error_data}")
            return None

async def test_get_chats(session, token):
    """Test getting user chats"""
    print("\n=== Testing Get Chats ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.get(f"{BASE_URL}/api/v1/messages/chats", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Chats retrieved successfully!")
            print(f"Total chats: {data.get('total')}")
            print(f"Chats in response: {len(data.get('chats', []))}")
            return data.get('chats', [])
        else:
            error_data = await response.text()
            print(f"❌ Failed to get chats: {error_data}")
            return []

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

async def test_get_messages(session, token, chat_id):
    """Test getting chat messages"""
    print(f"\n=== Testing Get Messages for Chat: {chat_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.get(f"{BASE_URL}/api/v1/messages/chats/{chat_id}/messages", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Messages retrieved successfully!")
            print(f"Total messages: {data.get('total')}")
            print(f"Messages in response: {len(data.get('messages', []))}")
            return data.get('messages', [])
        else:
            error_data = await response.text()
            print(f"❌ Failed to get messages: {error_data}")
            return []

async def test_get_notifications(session, token):
    """Test getting user notifications"""
    print("\n=== Testing Get Notifications ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.get(f"{BASE_URL}/api/v1/notifications/", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Notifications retrieved successfully!")
            print(f"Total notifications: {data.get('total')}")
            print(f"Unread notifications: {data.get('unread_count')}")
            print(f"Notifications in response: {len(data.get('notifications', []))}")
            return data.get('notifications', [])
        else:
            error_data = await response.text()
            print(f"❌ Failed to get notifications: {error_data}")
            return []

async def test_mark_notification_read(session, token, notification_id):
    """Test marking a notification as read"""
    print(f"\n=== Testing Mark Notification as Read: {notification_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.put(f"{BASE_URL}/api/v1/notifications/{notification_id}/read", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Notification marked as read successfully!")
            print(f"Notification ID: {data.get('id')}")
            print(f"Is read: {data.get('is_read')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to mark notification as read: {error_data}")
            return False

async def test_mark_all_notifications_read(session, token):
    """Test marking all notifications as read"""
    print("\n=== Testing Mark All Notifications as Read ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.put(f"{BASE_URL}/api/v1/notifications/mark-all-read", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ All notifications marked as read successfully!")
            print(f"Modified count: {data.get('modified_count')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to mark all notifications as read: {error_data}")
            return False

async def test_delete_notification(session, token, notification_id):
    """Test deleting a notification"""
    print(f"\n=== Testing Delete Notification: {notification_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.delete(f"{BASE_URL}/api/v1/notifications/{notification_id}", headers=headers) as response:
        print(f"Status: {response.status}")
        if response.status == 200:
            data = await response.json()
            print("✅ Notification deleted successfully!")
            print(f"Message: {data.get('message')}")
            return True
        else:
            error_data = await response.text()
            print(f"❌ Failed to delete notification: {error_data}")
            return False

async def main():
    """Main test function"""
    print("🚀 Starting Messaging and Notifications Endpoints Test")
    
    async with aiohttp.ClientSession() as session:
        # Register test users if needed
        await register_user(session, TEST_EMAIL, TEST_PASSWORD, "Test User")
        await register_user(session, TEST_EMAIL_2, TEST_PASSWORD_2, "Test User 2")
        
        # Get authentication tokens
        token1 = await get_auth_token(session, TEST_EMAIL, TEST_PASSWORD)
        token2 = await get_auth_token(session, TEST_EMAIL_2, TEST_PASSWORD_2)
        
        if not token1 or not token2:
            print("❌ Authentication failed. Cannot continue.")
            return
        
        print(f"✅ Authentication successful for both users")
        
        # Get user IDs for chat creation
        user1_id = None
        user2_id = None
        
        # Get user info to get IDs
        headers1 = {"Authorization": f"Bearer {token1}"}
        async with session.get(f"{BASE_URL}/api/v1/users/me", headers=headers1) as response:
            if response.status == 200:
                user1_data = await response.json()
                user1_id = user1_data.get('id')
        
        headers2 = {"Authorization": f"Bearer {token2}"}
        async with session.get(f"{BASE_URL}/api/v1/users/me", headers=headers2) as response:
            if response.status == 200:
                user2_data = await response.json()
                user2_id = user2_data.get('id')
        
        if not user1_id or not user2_id:
            print("❌ Could not get user IDs. Cannot continue.")
            return
        
        print(f"User 1 ID: {user1_id}")
        print(f"User 2 ID: {user2_id}")
        
        # Test messaging functionality
        chat_id = await test_create_chat(session, token1, [user1_id, user2_id])
        if not chat_id:
            print("❌ Cannot continue without a valid chat ID")
            return
        
        # Test getting chats
        await test_get_chats(session, token1)
        await test_get_chats(session, token2)
        
        # Test sending messages
        message1_id = await test_send_message(session, token1, chat_id, "Hello from User 1!")
        message2_id = await test_send_message(session, token2, chat_id, "Hello from User 2!")
        
        # Test getting messages
        await test_get_messages(session, token1, chat_id)
        await test_get_messages(session, token2, chat_id)
        
        # Test notifications functionality
        notifications1 = await test_get_notifications(session, token1)
        notifications2 = await test_get_notifications(session, token2)
        
        # Test marking notifications as read
        if notifications1:
            await test_mark_notification_read(session, token1, notifications1[0]['id'])
        
        if notifications2:
            await test_mark_notification_read(session, token2, notifications2[0]['id'])
        
        # Test marking all notifications as read
        await test_mark_all_notifications_read(session, token1)
        await test_mark_all_notifications_read(session, token2)
        
        # Test deleting notifications
        if notifications1:
            await test_delete_notification(session, token1, notifications1[0]['id'])
        
        if notifications2:
            await test_delete_notification(session, token2, notifications2[0]['id'])
        
        print("\n🎉 All messaging and notification tests completed!")

if __name__ == "__main__":
    asyncio.run(main()) 