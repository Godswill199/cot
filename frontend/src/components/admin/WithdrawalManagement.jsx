import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({
    totalWithdrawals: 0,
    pendingAmount: 0,
    processedToday: 0
  });

  useEffect(() => {
    fetchWithdrawals();
    fetchStats();
  }, [filter]);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get(`/api/admin/withdrawals?status=${filter}`);
      setWithdrawals(response.data);
    } catch (error) {
      setError('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/withdrawals/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch withdrawal stats:', error);
    }
  };

  const handleApprove = async (withdrawalId) => {
    try {
      await api.post(`/api/admin/withdrawals/${withdrawalId}/approve`);
      setSuccess('Withdrawal approved successfully');
      fetchWithdrawals();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve withdrawal');
    }
  };

  const handleReject = async (withdrawalId) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      await api.post(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        reason: rejectionReason
      });
      setSuccess('Withdrawal rejected successfully');
      setSelectedWithdrawal(null);
      setRejectionReason('');
      fetchWithdrawals();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject withdrawal');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Withdrawal Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Withdrawals</h3>
          <p className="text-2xl font-bold text-white">₦{stats.totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Pending Amount</h3>
          <p className="text-2xl font-bold text-[#fece00]">₦{stats.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Processed Today</h3>
          <p className="text-2xl font-bold text-green-500">₦{stats.processedToday.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#282828] rounded-lg shadow-lg p-6">
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

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === status 
                  ? 'bg-[#fece00] text-black' 
                  : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Withdrawals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bank Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#fece00] flex items-center justify-center text-black font-bold text-sm">
                        {withdrawal.user.firstName[0]}{withdrawal.user.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {withdrawal.user.firstName} {withdrawal.user.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{withdrawal.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">₦{withdrawal.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{withdrawal.bankDetails.bankName}</div>
                      <div className="text-gray-400">{withdrawal.bankDetails.accountNumber}</div>
                      <div className="text-gray-400">{withdrawal.bankDetails.accountName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      withdrawal.status === 'pending' ? 'bg-yellow-500' :
                      withdrawal.status === 'approved' ? 'bg-green-500' :
                      'bg-red-500'
                    } text-white`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(withdrawal._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Reject Withdrawal</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection"
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border-2 border-[#fece00] focus:outline-none"
              rows={4}
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedWithdrawal._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement; 