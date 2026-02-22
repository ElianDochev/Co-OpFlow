#!/usr/bin/env python3
"""
Test runner script for Co-OpFlow Backend API
"""

import subprocess
import sys
import os

def run_tests():
    """Run the test suite."""
    print("🧪 Running Co-OpFlow Backend API Tests...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("app"):
        print("❌ Error: 'app' directory not found. Make sure you're in the project root.")
        sys.exit(1)
    
    # Install test dependencies if needed
    try:
        import pytest
        import httpx
    except ImportError:
        print("📦 Installing test dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements-dev.txt"], check=True)
    
    # Run tests
    print("🚀 Starting test suite...")
    result = subprocess.run([
        sys.executable, "-m", "pytest",
        "--tb=short",
        "--cov=app",
        "--cov-report=term-missing",
        "--cov-report=html:htmlcov"
    ])
    
    if result.returncode == 0:
        print("\n✅ All tests passed!")
        print("📊 Coverage report generated in htmlcov/")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()