/**
 * API Utilities
 * 
 * This file contains utility functions for making API requests.
 * Currently set up as placeholders - will be implemented when backend is ready.
 */

// API base URL (will be configured later)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Create headers for authenticated requests
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Generic API request function
 * Will be used for all API calls once backend is implemented
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(),
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Authentication API functions
 * These will replace the mock functions in AuthContext
 */
export const authAPI = {
  /**
   * Login user
   */
  login: async (email, password) => {
    // TODO: Implement actual API call
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    // TODO: Implement actual API call
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    // TODO: Implement actual API call
    return apiRequest('/auth/profile');
  },

  /**
   * Logout user (if backend logout is needed)
   */
  logout: async () => {
    // TODO: Implement actual API call if needed
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  }
};

/**
 * Projects API functions
 * For future use when project management features are implemented
 */
export const projectsAPI = {
  /**
   * Get all user projects
   */
  getProjects: async () => {
    return apiRequest('/projects');
  },

  /**
   * Create new project
   */
  createProject: async (projectData) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  /**
   * Get project by ID
   */
  getProject: async (projectId) => {
    return apiRequest(`/projects/${projectId}`);
  }
};

/**
 * Tasks API functions
 * For future use when task management features are implemented
 */
export const tasksAPI = {
  /**
   * Get tasks for a project
   */
  getTasks: async (projectId) => {
    return apiRequest(`/projects/${projectId}/tasks`);
  },

  /**
   * Create new task
   */
  createTask: async (projectId, taskData) => {
    return apiRequest(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * Update task
   */
  updateTask: async (taskId, taskData) => {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }
};

export default {
  authAPI,
  projectsAPI,
  tasksAPI
};