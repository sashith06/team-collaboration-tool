import { useAuth } from '../context/useAuth.js';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard Page Component
 * 
 * This is a placeholder component for the main dashboard where users will see:
 * - List of their projects
 * - Option to create new projects
 * - Quick access to recent tasks
 * 
 * Note: This is a placeholder - full dashboard features will be implemented later
 */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout
   * Calls logout function and redirects to login page
   */
  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Team Collaboration Tool
              </h1>
              {user && (
                <p className="mt-1 text-sm text-gray-600">
                  Welcome back, {user.name}!
                </p>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard!
            </h2>
            <p className="text-gray-600 mb-8">
              This is a placeholder for the main dashboard. Coming soon:
            </p>
            
            {/* Feature List */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Features
                </h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    View and manage your projects
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Create new projects and tasks
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Kanban boards with drag & drop
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Task comments and collaboration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Real-time updates
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;