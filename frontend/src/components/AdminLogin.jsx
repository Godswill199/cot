// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import api from './utils/axiosConfig';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Clear any existing tokens before login
      localStorage.removeItem('userAuthToken');
      localStorage.removeItem('user');

      const response = await api.post('/admin/auth/login', credentials);
      console.log('Login response:', response.data);

      if (!response.data?.success) {
        throw new Error('Login failed');
      }

      const { token, user } = response.data.data;

      if (!user || !user.isAdmin) {
        setError('Access denied. Admin privileges required.');
        return;
      }

      const result = await adminLogin({ token, user });
      
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Invalid credentials'
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <div className="max-w-md w-full space-y-8 bg-[#282828] p-8 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Admin Login
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fece00] focus:border-transparent"
              placeholder="Email address"
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fece00] focus:border-transparent"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#fece00] hover:bg-[#fad026] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fece00] disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;