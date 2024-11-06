import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const PendingWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchWithdrawals();
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

  const handleApprove = async (withdrawalId) => {
    try {
      await api.post(`/api/admin/withdrawals/${withdrawalId}/approve`);
      setSuccess('Withdrawal approved successfully');
      fetchWithdrawals();
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
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject withdrawal');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Withdrawal Requests</h2>
      
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

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${filter === status 
                    ? `${getStatusColor(status)} text-white` 
                    : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

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
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(withdrawal.status)} text-white`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
    </div>
  );
};

export default PendingWithdrawals; 