import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/useAuth.js';
import ProtectedRoute from './components/ProtectedRoute';

// Import page components
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';

/**
 * AppRoutes Component
 * 
 * Handles all the routing logic for the application.
 * Separated from App component to have access to auth context.
 */
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes - redirect to dashboard if already logged in */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Registration />} 
      />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Default route */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      
      {/* Catch all route - redirect to appropriate page */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

/**
 * Main App Component
 * 
 * Sets up the main application structure with:
 * - React Router for navigation
 * - AuthProvider for authentication context
 * - Route protection and redirection logic
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
