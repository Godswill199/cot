import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from './utils/axiosConfig';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/register', formData);
      if (response.status === 201) {
        navigate('/admin/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create admin account';
      setError(errorMessage);
      console.error('Admin registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#282828] p-8 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create Admin Account
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              First Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Last Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <FaEyeSlash className="h-5 w-5 text-gray-400" /> : 
                  <FaEye className="h-5 w-5 text-gray-400" />
                }
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Admin Registration Key
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600"
              value={formData.adminKey}
              onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#ffc107] hover:bg-yellow-600"
          >
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister; 