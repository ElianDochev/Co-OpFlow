#!/usr/bin/env python3
"""
Test script to verify the new integer-based like and star system for projects.
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_project_likes_and_stars():
    """Test the new like and star system."""
    print("Testing project likes and stars system...")
    
    # First, register a user and get token
    register_data = {
        "email": "testuser@example.com",
        "password": "testpassword123",
        "name": "Test User",
        "account_type": "personal"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code != 200:
            print(f"Registration failed: {response.text}")
            return False
        
        token_data = response.json()
        access_token = token_data["access_token"]
        print("✅ User registered successfully")
        
        # Create a project
        project_data = {
            "title": "Test Project",
            "description": "This is a test project for testing likes and stars",
            "category": "web_app",
            "tech_stack": ["Python", "FastAPI", "MongoDB"],
            "team_name": "Test Team"
        }
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.post(f"{BASE_URL}/projects/", json=project_data, headers=headers)
        if response.status_code != 200:
            print(f"Project creation failed: {response.text}")
            return False
        
        project = response.json()
        project_id = project["id"]
        print(f"✅ Project created successfully with ID: {project_id}")
        print(f"Initial likes: {project['likes_count']}, stars: {project['stars_count']}")
        
        # Test liking the project
        response = requests.post(f"{BASE_URL}/projects/{project_id}/like", headers=headers)
        if response.status_code != 200:
            print(f"Like failed: {response.text}")
            return False
        print("✅ Project liked successfully")
        
        # Check the updated project
        response = requests.get(f"{BASE_URL}/projects/{project_id}")
        if response.status_code != 200:
            print(f"Get project failed: {response.text}")
            return False
        
        project = response.json()
        print(f"After like - likes: {project['likes_count']}, stars: {project['stars_count']}")
        
        # Test starring the project
        response = requests.post(f"{BASE_URL}/projects/{project_id}/star", headers=headers)
        if response.status_code != 200:
            print(f"Star failed: {response.text}")
            return False
        print("✅ Project starred successfully")
        
        # Check the updated project
        response = requests.get(f"{BASE_URL}/projects/{project_id}")
        if response.status_code != 200:
            print(f"Get project failed: {response.text}")
            return False
        
        project = response.json()
        print(f"After star - likes: {project['likes_count']}, stars: {project['stars_count']}")
        
        # Test unliking the project
        response = requests.delete(f"{BASE_URL}/projects/{project_id}/like", headers=headers)
        if response.status_code != 200:
            print(f"Unlike failed: {response.text}")
            return False
        print("✅ Project unliked successfully")
        
        # Check the updated project
        response = requests.get(f"{BASE_URL}/projects/{project_id}")
        if response.status_code != 200:
            print(f"Get project failed: {response.text}")
            return False
        
        project = response.json()
        print(f"After unlike - likes: {project['likes_count']}, stars: {project['stars_count']}")
        
        # Test unstarring the project
        response = requests.delete(f"{BASE_URL}/projects/{project_id}/star", headers=headers)
        if response.status_code != 200:
            print(f"Unstar failed: {response.text}")
            return False
        print("✅ Project unstarred successfully")
        
        # Check the final project state
        response = requests.get(f"{BASE_URL}/projects/{project_id}")
        if response.status_code != 200:
            print(f"Get project failed: {response.text}")
            return False
        
        project = response.json()
        print(f"Final state - likes: {project['likes_count']}, stars: {project['stars_count']}")
        
        # Verify final counts are 0
        if project['likes_count'] != 0 or project['stars_count'] != 0:
            print(f"❌ Final counts should be 0, but got likes: {project['likes_count']}, stars: {project['stars_count']}")
            return False
        
        print("✅ All tests passed! The integer-based like/star system is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

def main():
    """Main test function."""
    print("Starting project likes and stars tests...")
    
    success = test_project_likes_and_stars()
    
    if success:
        print("\n🎉 All tests passed! The new integer-based like/star system is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main() 