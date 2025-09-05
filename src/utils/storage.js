import { tasksAPI } from './api.js';
import { getCurrentUser } from './auth.js';

// Get tasks for current user (now from backend API)
export const getTasks = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const tasks = await tasksAPI.getTasks();
    return tasks || [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// Save tasks (not needed anymore as backend handles persistence)
export const saveTasks = (tasks) => {
  // This function is kept for compatibility but not used with backend
  console.warn('saveTasks is deprecated with backend integration');
  return true;
};

// Add a new task (now via backend API)
export const addTask = async (taskText) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const newTask = await tasksAPI.createTask(taskText);
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

// Update a task (now via backend API)
export const updateTask = async (taskId, updates) => {
  try {
    const updatedTask = await tasksAPI.updateTask(taskId, updates);
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Delete a task (now via backend API)
export const deleteTask = async (taskId) => {
  try {
    await tasksAPI.deleteTask(taskId);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Toggle task completion (now via backend API)
export const toggleTask = async (taskId) => {
  try {
    const updatedTask = await tasksAPI.toggleTask(taskId);
    return updatedTask;
  } catch (error) {
    console.error('Error toggling task:', error);
    return false;
  }
};
