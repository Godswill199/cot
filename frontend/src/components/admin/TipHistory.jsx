import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const TipHistory = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, won, lost, pending
  const [stats, setStats] = useState({
    total: 0,
    won: 0,
    lost: 0,
    pending: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchTips();
  }, [filter]);

  const fetchTips = async () => {
    try {
      const response = await api.get(`/api/admin/tips/history?status=${filter}`);
      setTips(response.data.tips);
      setStats(response.data.stats);
    } catch (error) {
      setError('Failed to fetch tip history');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (tipId, newStatus) => {
    try {
      await api.patch(`/api/admin/tips/${tipId}/status`, { status: newStatus });
      fetchTips();
    } catch (error) {
      setError('Failed to update tip status');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Tip History</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#282828] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Tips</h3>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Won</h3>
          <p className="text-2xl font-bold text-green-500">{stats.won}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Lost</h3>
          <p className="text-2xl font-bold text-red-500">{stats.lost}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Success Rate</h3>
          <p className="text-2xl font-bold text-[#fece00]">{stats.successRate}%</p>
        </div>
      </div>

      <div className="bg-[#282828] rounded-lg shadow-lg p-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['all', 'won', 'lost', 'pending'].map((status) => (
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

        {/* Tips Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="px-4 py-2 text-left">Start Time</th>
                <th className="px-4 py-2 text-left">End Time</th>
                <th className="px-4 py-2 text-left">Sports</th>
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip._id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{new Date(tip.startTime).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(tip.endTime).toLocaleString()}</td>
                  <td className="px-4 py-2">{tip.sports}</td>
                  <td className="px-4 py-2">{tip.team}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tip.type === 'free' ? 'bg-green-500' : 'bg-[#fece00] text-black'
                    }`}>
                      {tip.type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={tip.status}
                      onChange={(e) => handleStatusUpdate(tip._id, e.target.value)}
                      className={`rounded px-2 py-1 text-white border-2 border-[#fece00] ${
                        tip.status === 'won' ? 'bg-green-500' :
                        tip.status === 'lost' ? 'bg-red-500' :
                        'bg-[#1f1f1f]'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(tip._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TipHistory; 