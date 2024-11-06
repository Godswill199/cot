import React, { useState } from 'react';
import api from '../utils/axiosConfig';

const TopUpSubAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    amount: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminDetails, setAdminDetails] = useState(null);

  const handleSearch = async () => {
    if (!formData.email) return;

    try {
      const response = await api.get(`/api/admin/sub-admin/search?email=${formData.email}`);
      if (!response.data.isSubAdmin) {
        setError('User is not a sub-admin');
        setAdminDetails(null);
        return;
      }
      setAdminDetails(response.data);
      setError('');
    } catch (error) {
      setError('Sub-admin not found');
      setAdminDetails(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/admin/topup-sub-admin', {
        adminId: adminDetails._id,
        amount: parseFloat(formData.amount),
        reason: formData.reason
      });

      setSuccess(`Successfully topped up ${adminDetails.firstName}'s account with ₦${parseFloat(formData.amount).toLocaleString()}`);
      setFormData({ ...formData, amount: '', reason: '' });
      
      // Refresh admin details to show updated balance
      handleSearch();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to top up account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Top Up Sub-Admin Account</h2>
      
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Sub-Admin Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              placeholder="Enter sub-admin email"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 bg-[#1f1f1f] text-white rounded-lg hover:bg-[#282828] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {adminDetails && (
          <div className="mb-6 p-4 bg-[#1f1f1f] rounded-lg">
            <h3 className="text-white font-medium mb-2">Sub-Admin Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{adminDetails.firstName} {adminDetails.lastName}</span>
              </div>
              <div>
                <span className="text-gray-400">Current Balance:</span>
                <span className="text-white ml-2">₦{adminDetails.wallet?.balance?.toLocaleString() || '0'}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className={`ml-2 ${adminDetails.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {adminDetails.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Role:</span>
                <span className="text-white ml-2">Sub-Admin</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              placeholder="Enter reason for top up"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !adminDetails}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 
              ${loading || !adminDetails 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-[#fece00] hover:bg-[#fad026] text-black'}`}
          >
            {loading ? 'Processing...' : 'Top Up Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopUpSubAdmin; 