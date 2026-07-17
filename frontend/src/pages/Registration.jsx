import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

/**
 * Registration Page Component
 * 
 * This component renders a user registration form with the following features:
 * - Full name input field
 * - Email input field  
 * - Password input field
 * - Confirm password field
 * - Form validation (basic client-side)
 * - Responsive design using Tailwind CSS
 * 
 * Note: This is UI only - backend integration will be added later
 */
const Registration = () => {
  // Get navigation function and auth methods
  const navigate = useNavigate();
  const { register } = useAuth();

  // State to manage form input values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Check if full name is provided
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Check if email is provided and valid
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Check if password is provided and meets minimum requirements
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Check if passwords match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  /**
   * Handle form submission
   * Validates form and calls the register function from auth context
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
      // Call register() from AuthContext — this now POSTs to the backend
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        // Account created in MongoDB — redirect to login so the user can sign in
        navigate('/login');
      } else {
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Join Our Team
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create your account to start collaborating
          </p>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl sm:rounded-3xl border border-gray-100">
          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error Message */}
            {errors.submit && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-700 font-medium">
                  {errors.submit}
                </div>
              </div>
            )}

            {/* Full Name Field */}
            <div className="group">
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                    errors.fullName 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                <label
                  htmlFor="fullName"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.fullName
                      ? '-top-3 text-sm bg-white px-2 text-blue-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Full Name
                </label>
                {/* Focus ring */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

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
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.email
                      ? '-top-3 text-sm bg-white px-2 text-blue-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Email Address
                </label>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.password
                      ? '-top-3 text-sm bg-white px-2 text-blue-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Password
                </label>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.confirmPassword
                      ? '-top-3 text-sm bg-white px-2 text-blue-600 font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium'
                  }`}
                >
                  Confirm Password
                </label>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-2xl text-white transition-all duration-300 transform ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {/* Button background effect */}
                <span className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {isLoading ? (
                  <span className="relative">Creating Account...</span>
                ) : (
                  <span className="relative">Create Account</span>
                )}
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="group font-semibold text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                <span className="border-b-2 border-transparent group-hover:border-blue-500 transition-colors duration-200">
                  Sign in here
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;