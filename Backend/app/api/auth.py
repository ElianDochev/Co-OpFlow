from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from ..models.user import UserCreate, UserLogin, Token, UserResponse
from ..services.user_service import user_service
from ..auth.jwt import create_access_token, get_current_user, security
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user."""
    try:
        # Create user
        user = await user_service.create_user(user_data)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        return Token(access_token=access_token, user=user)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Add logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user."""
    try:
        # Authenticate user
        user = await user_service.authenticate_user(
            user_credentials.email, user_credentials.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        # Convert to response model
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            account_type=user.account_type,
            company_name=user.company_name,
            bio=user.bio,
            location=user.location,
            skills=user.skills,
            interests=user.interests,
            portfolio_links=user.portfolio_links,
            avatar_url=user.avatar_url,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )
        
        return Token(access_token=access_token, user=user_response)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to login"
        )


@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (client-side token removal is sufficient)."""
    # In a stateless JWT system, logout is typically handled client-side
    # by removing the token from storage
    return {"message": "Logged out successfully"} 