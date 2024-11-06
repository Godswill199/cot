import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../utils/axiosConfig';

const AddSubAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissions: {
      canManageTips: false,
      canManageUsers: false,
      canManageWithdrawals: false,
      canSendNotifications: false,
      canEmailUsers: false,
      canTopUpAccounts: false
    }
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const permissionsList = [
    { key: 'canManageTips', label: 'Manage Tips & Codes' },
    { key: 'canManageUsers', label: 'Manage Users' },
    { key: 'canManageWithdrawals', label: 'Manage Withdrawals' },
    { key: 'canSendNotifications', label: 'Send Notifications' },
    { key: 'canEmailUsers', label: 'Email Users' },
    { key: 'canTopUpAccounts', label: 'Top Up Accounts' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/admin/sub-admin/create', {
        ...formData,
        isSubAdmin: true
      });

      if (response.status === 201) {
        setSuccess('Sub-admin created successfully');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          permissions: {
            canManageTips: false,
            canManageUsers: false,
            canManageWithdrawals: false,
            canSendNotifications: false,
            canEmailUsers: false,
            canTopUpAccounts: false
          }
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create sub-admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Add Sub-Admin</h2>
      
      <div className="max-w-2xl bg-[#282828] rounded-lg shadow-lg p-6">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 rounded bg-green-500/10 border border-green-500 text-green-500">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-4">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionsList.map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    checked={formData.permissions[key]}
                    onChange={(e) => setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        [key]: e.target.checked
                      }
                    })}
                    className="form-checkbox h-5 w-5 text-[#fece00] rounded border-gray-700 bg-[#1f1f1f] focus:ring-[#fece00]"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#fece00] hover:bg-[#fad026] text-black rounded-lg font-medium transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create Sub-Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubAdmin; 