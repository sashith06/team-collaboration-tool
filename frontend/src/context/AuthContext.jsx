import { useState, useEffect } from 'react';
import { AuthContext } from './authContext.js';

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
   * Currently just stores user data locally - will connect to API later
   */
  const login = (userData, token) => {
    try {
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Failed to save login data' };
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
   * Currently just handles the data - will connect to API later
   */
  const register = (userData) => {
    try {
      // TODO: This will make an API call to register the user
      // For now, we'll just simulate a successful registration
      console.log('Registration data:', userData);
      
      // Simulate successful registration by auto-logging in the user
      const mockUser = {
        id: Date.now(), // Mock ID
        name: userData.fullName,
        email: userData.email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return login(mockUser, mockToken);
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'Registration failed' };
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