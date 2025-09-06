from fastapi import APIRouter, Depends, HTTPException, status
from app.controllers.auth_controller import AuthController
from app.models.user import UserCreate, UserLogin, UserResponse, Token, TokenWithRefresh, RefreshTokenRequest
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=TokenWithRefresh, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user and return JWT tokens"""
    return await AuthController.register_user(user_data)

@router.post("/login", response_model=TokenWithRefresh)
async def login(user_data: UserLogin):
    """Login user and return JWT tokens"""
    return await AuthController.login_user(user_data)

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshTokenRequest):
    """Refresh access token using refresh token"""
    return await AuthController.refresh_access_token(refresh_data)

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user_email: str = Depends(get_current_user)):
    """Get current user profile"""
    return await AuthController.get_user_profile(current_user_email)

@router.post("/verify-token")
async def verify_token(current_user_email: str = Depends(get_current_user)):
    """Verify if token is valid"""
    return {"valid": True, "email": current_user_email}
