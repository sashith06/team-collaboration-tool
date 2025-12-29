import { createContext } from 'react';

/**
 * Authentication Context
 * 
 * This context provides authentication state and methods throughout the app:
 * - User information (when logged in)
 * - Login status
 * - Login/logout methods
 * - Loading state during authentication checks
 * 
 * Note: Currently stores data in localStorage - will integrate with backend later
 */

// Create and export the context
export const AuthContext = createContext();