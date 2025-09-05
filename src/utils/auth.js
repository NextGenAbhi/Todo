import { authAPI, isAuthenticated as apiIsAuthenticated, getCurrentUserEmail } from './api.js';

// Store user credentials securely (now handled by backend)
export const registerUser = async (email, password) => {
  try {
    const response = await authAPI.register(email, password);
    
    // Set authentication state after successful registration
    sessionStorage.setItem('todo_authenticated', 'true');
    sessionStorage.setItem('todo_user_email', email);
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Authenticate user (now handled by backend)
export const loginUser = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    
    if (response.access_token) {
      // Set authentication state after successful login
      sessionStorage.setItem('todo_authenticated', 'true');
      sessionStorage.setItem('todo_user_email', email);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Check if user is authenticated (check both session and API token)
export const isAuthenticated = () => {
  const sessionAuth = sessionStorage.getItem('todo_authenticated') === 'true';
  const tokenAuth = apiIsAuthenticated();
  return sessionAuth && tokenAuth;
};

// Get current user email
export const getCurrentUser = () => {
  // Try to get from session first, then from token
  const sessionEmail = sessionStorage.getItem('todo_user_email');
  const tokenEmail = getCurrentUserEmail();
  return sessionEmail || tokenEmail;
};

// Logout user (clear both session and API token)
export const logoutUser = () => {
  authAPI.logout();
  sessionStorage.removeItem('todo_authenticated');
  sessionStorage.removeItem('todo_user_email');
};

// Check if user is already registered (for UI state management)
export const isUserRegistered = () => {
  // Since we're using backend auth, we check if there's a stored session
  // This maintains the existing UI behavior
  return sessionStorage.getItem('todo_user_email') !== null;
};

// Verify authentication with backend
export const verifyAuthentication = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }
    
    const response = await authAPI.verifyToken();
    return response && response.valid;
  } catch (error) {
    console.error('Token verification failed:', error);
    logoutUser();
    return false;
  }
};

// Clear all user data (for development/testing)
export const clearAllData = () => {
  authAPI.logout();
  sessionStorage.clear();
  localStorage.clear();
};
