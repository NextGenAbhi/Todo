from typing import List
from fastapi import APIRouter, Depends, status
from app.controllers.task_controller import TaskController
from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user_email: str = Depends(get_current_user)
):
    """Create a new task"""
    return await TaskController.create_task(task_data, current_user_email)

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(current_user_email: str = Depends(get_current_user)):
    """Get all tasks for the current user"""
    return await TaskController.get_user_tasks(current_user_email)

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user_email: str = Depends(get_current_user)
):
    """Get a specific task by ID"""
    return await TaskController.get_task_by_id(task_id, current_user_email)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user_email: str = Depends(get_current_user)
):
    """Update a task"""
    return await TaskController.update_task(task_id, task_data, current_user_email)

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user_email: str = Depends(get_current_user)
):
    """Delete a task"""
    await TaskController.delete_task(task_id, current_user_email)
    return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: str,
    current_user_email: str = Depends(get_current_user)
):
    """Toggle task completion status"""
    return await TaskController.toggle_task(task_id, current_user_email)
