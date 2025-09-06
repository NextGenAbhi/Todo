import { authAPI, isAuthenticated as apiIsAuthenticated, getCurrentUserEmail } from './api.js';

// Store user credentials securely (now handled by backend)
export const registerUser = async (email, password) => {
  try {
    const response = await authAPI.register(email, password);
    console.log('Registration response:', response);
    
    if (response.access_token && response.refresh_token) {
      console.log('Setting tokens after registration');
      // Set authentication state after successful registration
      sessionStorage.setItem('todo_authenticated', 'true');
      sessionStorage.setItem('todo_user_email', email);
      
      // Verify tokens are set
      console.log('Tokens set:', {
        access_token: !!sessionStorage.getItem('todo_auth_token'),
        refresh_token: !!sessionStorage.getItem('todo_refresh_token')
      });
      
      // Verify the token works by calling verify endpoint
      try {
        await authAPI.verifyToken();
        console.log('Token verification successful');
        return true;
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError);
        // Clear tokens if verification fails
        authAPI.logout();
        sessionStorage.removeItem('todo_authenticated');
        sessionStorage.removeItem('todo_user_email');
        throw new Error('Registration succeeded but authentication failed. Please try logging in.');
      }
    }
    
    console.log('Registration failed: missing tokens');
    return false;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Authenticate user (now handled by backend)
export const loginUser = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    
    if (response.access_token && response.refresh_token) {
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
export const logout = () => {
  authAPI.logout();
  sessionStorage.removeItem('todo_authenticated');
  sessionStorage.removeItem('todo_user_email');
};

// Legacy logout function for backward compatibility
export const logoutUser = logout;

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
