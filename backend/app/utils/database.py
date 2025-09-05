from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv
import logging
from urllib.parse import quote_plus

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

database = Database()

async def get_database():
    return database.database

async def connect_to_mongo():
    """Create database connection"""
    try:
        # Get MongoDB configuration from environment variables
        mongo_uri = os.getenv("MONGODB_URI")
        username = os.getenv("MONGODB_USERNAME")
        password = os.getenv("MONGODB_PASSWORD")
        
        if not mongo_uri:
            raise ValueError("MONGODB_URI environment variable is not set")
        if not username:
            raise ValueError("MONGODB_USERNAME environment variable is not set")
        if not password or password == "your_mongodb_password_here":
            raise ValueError("MONGODB_PASSWORD environment variable is not set or contains placeholder value. Please set your actual MongoDB password.")
        
        # URL encode the credentials to handle special characters
        encoded_username = quote_plus(username)
        encoded_password = quote_plus(password)
        
        # Replace placeholders with actual encoded credentials
        mongo_uri = mongo_uri.replace("<username>", encoded_username)
        mongo_uri = mongo_uri.replace("<password>", encoded_password)
        
        logger.info("Attempting to connect to MongoDB...")
        database.client = AsyncIOMotorClient(mongo_uri)
        
        # Test the connection
        await database.client.admin.command('ping')
        
        # Get database name from environment or use default
        db_name = os.getenv("DATABASE_NAME", "todo_app")
        database.database = database.client[db_name]
        
        logger.info("Connected to MongoDB successfully")
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")
