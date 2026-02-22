#!/usr/bin/env python3
"""
Simple test script to verify user endpoints are working correctly.
This script will test the /me endpoint and user update functionality.
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_auth_endpoints():
    """Test authentication endpoints."""
    print("Testing authentication endpoints...")
    
    # Test registration
    register_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User",
        "account_type": "personal"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Register response: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data["access_token"]
            print(f"Access token: {access_token[:20]}...")
            return access_token
        else:
            print(f"Register failed: {response.text}")
            return None
    except Exception as e:
        print(f"Register error: {e}")
        return None

def test_me_endpoint(access_token):
    """Test the /me endpoint."""
    print("\nTesting /me endpoint...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"/me response: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            print(f"User data: {json.dumps(user_data, indent=2)}")
            return True
        else:
            print(f"/me failed: {response.text}")
            return False
    except Exception as e:
        print(f"/me error: {e}")
        return False

def test_update_profile(access_token):
    """Test updating user profile."""
    print("\nTesting profile update...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    update_data = {
        "name": "Updated Test User",
        "bio": "This is an updated bio",
        "location": "Test City"
    }
    
    try:
        response = requests.put(f"{BASE_URL}/users/me", json=update_data, headers=headers)
        print(f"Update response: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            print(f"Updated user data: {json.dumps(user_data, indent=2)}")
            return True
        else:
            print(f"Update failed: {response.text}")
            return False
    except Exception as e:
        print(f"Update error: {e}")
        return False

def main():
    """Main test function."""
    print("Starting user endpoint tests...")
    
    # Test authentication
    access_token = test_auth_endpoints()
    if not access_token:
        print("Authentication failed, cannot continue tests.")
        sys.exit(1)
    
    # Test /me endpoint
    me_success = test_me_endpoint(access_token)
    if not me_success:
        print("/me endpoint test failed.")
        sys.exit(1)
    
    # Test profile update
    update_success = test_update_profile(access_token)
    if not update_success:
        print("Profile update test failed.")
        sys.exit(1)
    
    print("\nAll tests passed! ✅")

if __name__ == "__main__":
    main() 