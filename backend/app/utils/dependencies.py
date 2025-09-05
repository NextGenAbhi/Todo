from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.auth import verify_token
from app.utils.database import get_database
from app.models.user import User

# Security scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current authenticated user"""
    token = credentials.credentials
    token_data = verify_token(token)
    return token_data["email"]

async def get_user_by_email(email: str) -> User:
    """Get user from database by email"""
    db = await get_database()
    user_doc = await db.users.find_one({"email": email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return User(**user_doc)
