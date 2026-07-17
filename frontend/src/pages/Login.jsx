import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

/**
 * Login Page Component
 * 
 * This component renders a user login form with the following features:
 * - Email input field
 * - Password input field
 * - Basic form validation
 * - Responsive design using Tailwind CSS
 * 
 * Note: This is UI only - backend integration will be added later
 */
const Login = () => {
  // Get navigation function and auth methods
  const navigate = useNavigate();
  const { login } = useAuth();

  // State to manage form input values
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to manage form errors
  const [errors, setErrors] = useState({});

  // State to manage loading state (for future API calls)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input field changes
   * Updates the form data state when user types in input fields
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Basic form validation
   * Validates form fields and returns an object with any errors
   */
  const validateForm = () => {
    const newErrors = {};

    // Check if email is provided and valid
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Check if password is provided
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  /**
   * Handle form submission
   * Validates form and calls the login function from auth context
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});
    
    // Set loading state
    setIsLoading(true);

    try {
      // TODO: Replace this with actual API call later
      // For now, simulate a successful login for demo purposes
      const mockUser = {
        id: 1,
        name: 'Demo User',
        email: formData.email
      };
      const mockToken = 'demo-token-' + Date.now();

      const result = await login(mockUser, mockToken);

      if (result.success) {
        // Login successful, navigate to dashboard
        navigate('/dashboard');
      } else {
        // Login failed, show error
        setErrors({ submit: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl sm:rounded-3xl border border-gray-100">
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error Message */}
            {errors.submit && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-700 font-medium">
                  {errors.submit}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.email
                      ? '-top-3 text-sm bg-white px-2 text-indigo-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Email Address
                </label>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.password
                      ? '-top-3 text-sm bg-white px-2 text-indigo-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Password
                </label>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out border-b border-transparent hover:border-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-2xl text-white transition-all duration-300 transform ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <span className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {isLoading ? (
                  <span className="relative">Signing In...</span>
                ) : (
                  <span className="relative">Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Link to Registration */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/register')}
                className="group font-semibold text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                <span className="border-b-2 border-transparent group-hover:border-indigo-500 transition-colors duration-200">
                  Create account here
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;