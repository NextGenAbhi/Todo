import CryptoJS from 'crypto-js';
import { getCurrentUser } from './auth.js';

// Get session key for encryption
const getSessionKey = () => {
  return sessionStorage.getItem('todo_session_key');
};

// Encrypt data before storing
const encryptData = (data) => {
  const sessionKey = getSessionKey();
  if (!sessionKey) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), sessionKey).toString();
};

// Decrypt data after retrieving
const decryptData = (encryptedData) => {
  try {
    const sessionKey = getSessionKey();
    if (!sessionKey) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, sessionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

// Get tasks for current user
export const getTasks = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const encryptedData = localStorage.getItem('todo_tasks_data');
  if (!encryptedData) return [];
  
  const allTasks = decryptData(encryptedData);
  if (!allTasks || !allTasks[currentUser]) return [];
  
  return allTasks[currentUser];
};

// Save tasks for current user
export const saveTasks = (tasks) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Get existing data
  const encryptedData = localStorage.getItem('todo_tasks_data');
  let allTasks = {};
  
  if (encryptedData) {
    allTasks = decryptData(encryptedData) || {};
  }
  
  // Update tasks for current user
  allTasks[currentUser] = tasks;
  
  // Encrypt and save
  const newEncryptedData = encryptData(allTasks);
  if (newEncryptedData) {
    localStorage.setItem('todo_tasks_data', newEncryptedData);
    return true;
  }
  
  return false;
};

// Add a new task
export const addTask = (taskText) => {
  const currentTasks = getTasks();
  const newTask = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: taskText,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedTasks = [...currentTasks, newTask];
  return saveTasks(updatedTasks) ? newTask : null;
};

// Update a task
export const updateTask = (taskId, updates) => {
  const currentTasks = getTasks();
  const updatedTasks = currentTasks.map(task => 
    task.id === taskId 
      ? { ...task, ...updates, updatedAt: new Date().toISOString() }
      : task
  );
  
  return saveTasks(updatedTasks);
};

// Delete a task
export const deleteTask = (taskId) => {
  const currentTasks = getTasks();
  const updatedTasks = currentTasks.filter(task => task.id !== taskId);
  return saveTasks(updatedTasks);
};

// Toggle task completion
export const toggleTask = (taskId) => {
  const currentTasks = getTasks();
  const task = currentTasks.find(t => t.id === taskId);
  if (!task) return false;
  
  return updateTask(taskId, { completed: !task.completed });
};
