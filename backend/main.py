from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

# Add the backend directory to Python path for Vercel
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.routes import auth, tasks
from app.utils.database import connect_to_mongo, close_mongo_connection

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Todo App API",
    description="A secure todo application API with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
# Define allowed origins for different environments
origins = [
    "http://localhost:5173",  # Local Vite dev server
    "http://localhost:8001",  # Local backend
    "http://127.0.0.1:5173",  # Alternative local frontend
    "http://127.0.0.1:8001",  # Alternative local backend
]

# Add Vercel domains dynamically
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# Allow all Vercel deployment URLs
origins.extend([
    "https://*.vercel.app",
    "https://todo-nu-lemon.vercel.app",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("DEBUG", "False").lower() == "true" else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Todo App API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "localhost"),
        port=int(os.getenv("APP_PORT", 8000)),
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )
