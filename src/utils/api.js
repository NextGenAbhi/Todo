// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

// Get auth token from sessionStorage
const getAuthToken = () => {
  return sessionStorage.getItem('todo_auth_token');
};

// Get refresh token from sessionStorage
const getRefreshToken = () => {
  return sessionStorage.getItem('todo_refresh_token');
};

// Set auth token in sessionStorage
const setAuthToken = (token) => {
  sessionStorage.setItem('todo_auth_token', token);
};

// Set refresh token in sessionStorage
const setRefreshToken = (token) => {
  sessionStorage.setItem('todo_refresh_token', token);
};

// Remove auth token from sessionStorage
const removeAuthToken = () => {
  sessionStorage.removeItem('todo_auth_token');
  sessionStorage.removeItem('todo_refresh_token');
};

// Refresh token function
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    setAuthToken(data.access_token);
    return data.access_token;
  } catch (error) {
    removeAuthToken();
    throw error;
  }
};

// API request helper with authentication and auto-refresh
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  console.log(`API Request to ${endpoint}:`, {
    hasToken: !!token,
    retryCount,
    tokenStart: token ? token.substring(0, 20) + '...' : 'none'
  });
  
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
    
    // Handle authentication errors with token refresh
    if (response.status === 401 && retryCount === 0) {
      try {
        // Try to refresh the token
        await refreshAccessToken();
        // Retry the request with the new token
        return await apiRequest(endpoint, options, 1);
      } catch (refreshError) {
        removeAuthToken();
        throw new Error('Authentication failed. Please login again.');
      }
    }
    
    // Handle forbidden errors (403)
    if (response.status === 403) {
      removeAuthToken();
      throw new Error('Not authenticated');
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
    
    if (response.access_token && response.refresh_token) {
      setAuthToken(response.access_token);
      setRefreshToken(response.refresh_token);
    }
    
    return response;
  },
  
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token && response.refresh_token) {
      setAuthToken(response.access_token);
      setRefreshToken(response.refresh_token);
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
