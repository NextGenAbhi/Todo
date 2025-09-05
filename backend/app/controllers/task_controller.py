from datetime import datetime
from typing import List
from fastapi import HTTPException, status
from bson import ObjectId
from app.utils.database import get_database
from app.models.task import TaskCreate, TaskUpdate, TaskResponse

class TaskController:
    
    @staticmethod
    async def create_task(task_data: TaskCreate, user_email: str) -> TaskResponse:
        """Create a new task for the user"""
        db = await get_database()
        
        # Create task document
        task_doc = {
            "text": task_data.text,
            "completed": task_data.completed,
            "user_email": user_email,
            "created_at": datetime.utcnow(),
            "updated_at": None
        }
        
        # Insert task into database
        result = await db.tasks.insert_one(task_doc)
        
        # Return task response
        return TaskResponse(
            id=str(result.inserted_id),
            text=task_data.text,
            completed=task_data.completed,
            created_at=task_doc["created_at"],
            updated_at=task_doc["updated_at"]
        )
    
    @staticmethod
    async def get_user_tasks(user_email: str) -> List[TaskResponse]:
        """Get all tasks for the user"""
        db = await get_database()
        
        # Find all tasks for the user
        cursor = db.tasks.find({"user_email": user_email}).sort("created_at", -1)
        tasks = await cursor.to_list(length=None)
        
        # Convert to response format
        return [
            TaskResponse(
                id=str(task["_id"]),
                text=task["text"],
                completed=task["completed"],
                created_at=task["created_at"],
                updated_at=task.get("updated_at")
            )
            for task in tasks
        ]
    
    @staticmethod
    async def get_task_by_id(task_id: str, user_email: str) -> TaskResponse:
        """Get a specific task by ID"""
        db = await get_database()
        
        # Validate ObjectId
        if not ObjectId.is_valid(task_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID"
            )
        
        # Find task by ID and user
        task_doc = await db.tasks.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })
        
        if not task_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return TaskResponse(
            id=str(task_doc["_id"]),
            text=task_doc["text"],
            completed=task_doc["completed"],
            created_at=task_doc["created_at"],
            updated_at=task_doc.get("updated_at")
        )
    
    @staticmethod
    async def update_task(task_id: str, task_data: TaskUpdate, user_email: str) -> TaskResponse:
        """Update a task"""
        db = await get_database()
        
        # Validate ObjectId
        if not ObjectId.is_valid(task_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID"
            )
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        if task_data.text is not None:
            update_data["text"] = task_data.text
        if task_data.completed is not None:
            update_data["completed"] = task_data.completed
        
        # Update task
        result = await db.tasks.update_one(
            {"_id": ObjectId(task_id), "user_email": user_email},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Get updated task
        updated_task = await db.tasks.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })
        
        return TaskResponse(
            id=str(updated_task["_id"]),
            text=updated_task["text"],
            completed=updated_task["completed"],
            created_at=updated_task["created_at"],
            updated_at=updated_task.get("updated_at")
        )
    
    @staticmethod
    async def delete_task(task_id: str, user_email: str) -> bool:
        """Delete a task"""
        db = await get_database()
        
        # Validate ObjectId
        if not ObjectId.is_valid(task_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID"
            )
        
        # Delete task
        result = await db.tasks.delete_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return True
    
    @staticmethod
    async def toggle_task(task_id: str, user_email: str) -> TaskResponse:
        """Toggle task completion status"""
        db = await get_database()
        
        # Validate ObjectId
        if not ObjectId.is_valid(task_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID"
            )
        
        # Get current task
        task_doc = await db.tasks.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })
        
        if not task_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Toggle completion status
        new_status = not task_doc["completed"]
        
        # Update task
        await db.tasks.update_one(
            {"_id": ObjectId(task_id), "user_email": user_email},
            {"$set": {"completed": new_status, "updated_at": datetime.utcnow()}}
        )
        
        # Get updated task
        updated_task = await db.tasks.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })
        
        return TaskResponse(
            id=str(updated_task["_id"]),
            text=updated_task["text"],
            completed=updated_task["completed"],
            created_at=updated_task["created_at"],
            updated_at=updated_task.get("updated_at")
        )
