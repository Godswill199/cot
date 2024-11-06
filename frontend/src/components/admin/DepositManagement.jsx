import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const DepositManagement = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({
    totalDeposits: 0,
    pendingAmount: 0,
    processedToday: 0
  });

  useEffect(() => {
    fetchDeposits();
    fetchStats();
  }, [filter]);

  const fetchDeposits = async () => {
    try {
      const response = await api.get(`/api/admin/deposits?status=${filter}`);
      setDeposits(response.data);
    } catch (error) {
      setError('Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/deposits/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch deposit stats:', error);
    }
  };

  const handleApprove = async (depositId) => {
    try {
      await api.post(`/api/admin/deposits/${depositId}/approve`);
      setSuccess('Deposit approved successfully');
      fetchDeposits();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve deposit');
    }
  };

  const handleReject = async (depositId) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      await api.post(`/api/admin/deposits/${depositId}/reject`, {
        reason: rejectionReason
      });
      setSuccess('Deposit rejected successfully');
      setSelectedDeposit(null);
      setRejectionReason('');
      fetchDeposits();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject deposit');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Deposit Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Deposits</h3>
          <p className="text-2xl font-bold text-white">₦{stats.totalDeposits.toLocaleString()}</p>
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

        {/* Deposits Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {deposits.map((deposit) => (
                <tr key={deposit._id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#fece00] flex items-center justify-center text-black font-bold text-sm">
                        {deposit.user.firstName[0]}{deposit.user.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {deposit.user.firstName} {deposit.user.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{deposit.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">₦{deposit.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{deposit.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">{deposit.reference}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(deposit.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deposit.status === 'pending' ? 'bg-yellow-500' :
                      deposit.status === 'approved' ? 'bg-green-500' :
                      'bg-red-500'
                    } text-white`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deposit.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(deposit._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedDeposit(deposit)}
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
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Reject Deposit</h3>
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
                  setSelectedDeposit(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDeposit._id)}
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

export default DepositManagement; 