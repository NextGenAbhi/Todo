// API base configuration
const API_BASE_URL = 'http://localhost:8001/api';

// Get auth token from sessionStorage
const getAuthToken = () => {
  return sessionStorage.getItem('todo_auth_token');
};

// Set auth token in sessionStorage
const setAuthToken = (token) => {
  sessionStorage.setItem('todo_auth_token', token);
};

// Remove auth token from sessionStorage
const removeAuthToken = () => {
  sessionStorage.removeItem('todo_auth_token');
};

// API request helper with authentication
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, config);
    
    // Handle authentication errors
    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE requests)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (email, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },
  
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },
  
  logout: () => {
    removeAuthToken();
  },
  
  verifyToken: async () => {
    try {
      const response = await apiRequest('/auth/verify-token', {
        method: 'POST',
      });
      return response;
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  },
  
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },
};

// Tasks API calls
export const tasksAPI = {
  getTasks: async () => {
    return await apiRequest('/tasks/');
  },
  
  createTask: async (text) => {
    return await apiRequest('/tasks/', {
      method: 'POST',
      body: JSON.stringify({ text, completed: false }),
    });
  },
  
  updateTask: async (taskId, updates) => {
    return await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deleteTask: async (taskId) => {
    return await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
  
  toggleTask: async (taskId) => {
    return await apiRequest(`/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get current user email from token (decode client-side for display purposes only)
export const getCurrentUserEmail = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Basic JWT decode (for display purposes only, not for security)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // email is stored in 'sub' field
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
