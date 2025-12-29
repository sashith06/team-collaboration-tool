import { useContext } from 'react';
import { AuthContext } from './authContext.js';

/**
 * Custom hook to use the AuthContext
 * Provides easy access to authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};