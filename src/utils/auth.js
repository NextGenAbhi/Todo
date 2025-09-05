import CryptoJS from 'crypto-js';

// Generate a unique key for this browser instance
const getSessionKey = () => {
  let sessionKey = sessionStorage.getItem('todo_session_key');
  if (!sessionKey) {
    sessionKey = CryptoJS.lib.WordArray.random(256/8).toString();
    sessionStorage.setItem('todo_session_key', sessionKey);
  }
  return sessionKey;
};

// Encrypt data before storing
const encryptData = (data) => {
  const sessionKey = getSessionKey();
  return CryptoJS.AES.encrypt(JSON.stringify(data), sessionKey).toString();
};

// Decrypt data after retrieving
const decryptData = (encryptedData) => {
  try {
    const sessionKey = getSessionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, sessionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

// Hash password for storage (additional security layer)
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// Store user credentials securely
export const registerUser = (email, password) => {
  const hashedPassword = hashPassword(password);
  const userData = {
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  const encryptedData = encryptData(userData);
  localStorage.setItem('todo_user_data', encryptedData);
  
  // Also set authentication state
  sessionStorage.setItem('todo_authenticated', 'true');
  sessionStorage.setItem('todo_user_email', email);
  
  return true;
};

// Authenticate user
export const loginUser = (email, password) => {
  const encryptedData = localStorage.getItem('todo_user_data');
  if (!encryptedData) {
    return false;
  }
  
  const userData = decryptData(encryptedData);
  if (!userData) {
    return false;
  }
  
  const hashedPassword = hashPassword(password);
  
  if (userData.email === email && userData.password === hashedPassword) {
    sessionStorage.setItem('todo_authenticated', 'true');
    sessionStorage.setItem('todo_user_email', email);
    return true;
  }
  
  return false;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return sessionStorage.getItem('todo_authenticated') === 'true';
};

// Get current user email
export const getCurrentUser = () => {
  return sessionStorage.getItem('todo_user_email');
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem('todo_authenticated');
  sessionStorage.removeItem('todo_user_email');
  sessionStorage.removeItem('todo_session_key');
};

// Check if user is already registered
export const isUserRegistered = () => {
  const encryptedData = localStorage.getItem('todo_user_data');
  return encryptedData !== null;
};

// Clear all user data (for development/testing)
export const clearAllData = () => {
  localStorage.removeItem('todo_user_data');
  localStorage.removeItem('todo_tasks_data');
  sessionStorage.clear();
};
