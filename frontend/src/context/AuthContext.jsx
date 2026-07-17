import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './authContext.js';

// The base URL of your Express backend
// All API calls will be prefixed with this
const API_URL = 'http://localhost:5000/api';

/**
 * AuthProvider Component
 * Wraps the app and provides authentication functionality to all child components
 */
export const AuthProvider = ({ children }) => {
  // State to store current user information
  const [user, setUser] = useState(null);
  
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State to track if we're still checking authentication status
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is already logged in when app starts
   * Looks for stored user data in localStorage
   */
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check if there's a stored user in localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          // Parse the stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate a small delay to show loading state
    setTimeout(checkAuthStatus, 500);
  }, []);

  /**
   * Login function
   * Calls POST /api/auth/login on the backend
   * Backend will be built in the next phase (JWT)
   */
  const login = async (email, password) => {
    try {
      // Send credentials to the backend login route
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;

      // Persist the token and user in localStorage so they survive page refresh
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update React state
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('Login error:', message);
      return { success: false, error: message };
    }
  };

  /**
   * Logout function
   * Clears user data and redirects to login
   */
  const logout = () => {
    try {
      // Clear stored data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Failed to logout properly' };
    }
  };

  /**
   * Register function
   * Calls POST /api/auth/register on the backend
   * Saves the new user to MongoDB via Mongoose
   */
  const register = async ({ fullName, email, password, role }) => {
    try {
      // POST the form data to the backend registration endpoint
      // The backend will: validate → check duplicate → hash password → save to DB
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: fullName,   // backend field is "name", form field is "fullName"
        email,
        password,
        role: role || 'Member',
      });

      // If we reach here, the backend returned 201 (success)
      // The response body: { success: true, message: "User registered successfully" }
      return { success: true, message: response.data.message };
    } catch (error) {
      // error.response.data.message is the error message from the backend
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration error:', message);
      return { success: false, error: message };
    }
  };

  // Context value object
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Methods
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};