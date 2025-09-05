from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.utils.database import get_database
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.models.user import UserCreate, UserLogin, User, UserResponse, Token
from fastapi import HTTPException
from fastapi.responses import JSONResponse

class AuthController:
    
    @staticmethod
    async def register_user(user_data: UserCreate) -> UserResponse:
        """Register a new user"""
        try:
            db = await get_database()
            
            if db is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database connection not available"
                )
            
            # Check if user already exists
            existing_user = await db.users.find_one({"email": user_data.email})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Hash password
            hashed_password = get_password_hash(user_data.password)
            
            # Create user document
            user_doc = {
                "email": user_data.email,
                "password": hashed_password,
                "created_at": datetime.utcnow()
            }
            
            # Insert user into database
            result = await db.users.insert_one(user_doc)
            
            # Return user response
            return UserResponse(
                id=str(result.inserted_id),
                email=user_data.email,
                created_at=user_doc["created_at"]
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )
    
    @staticmethod
    async def login_user(user_data: UserLogin) -> Token:
        """Authenticate user and return JWT token"""
        try:
            db = await get_database()
            
            # Find user by email
            user_doc = await db.users.find_one({"email": user_data.email})
            if not user_doc:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            # Verify password
            if not verify_password(user_data.password, user_doc["password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            # Create access token
            access_token_expires = timedelta(minutes=30)
            access_token = create_access_token(
                data={"sub": user_data.email}, 
                expires_delta=access_token_expires
            )
            
            return Token(access_token=access_token, token_type="bearer")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Login failed: {str(e)}"
            )
    
    @staticmethod
    async def get_user_profile(email: str) -> UserResponse:
        """Get user profile information"""
        try:
            db = await get_database()
            
            user_doc = await db.users.find_one({"email": email})
            if not user_doc:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            return UserResponse(
                id=str(user_doc["_id"]),
                email=user_doc["email"],
                created_at=user_doc["created_at"]
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch user profile: {str(e)}"
            )
