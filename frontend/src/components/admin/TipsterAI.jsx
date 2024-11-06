import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const TipsterAI = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalInvestments: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    totalRevenue: 0,
    weeklyProfits: []
  });

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, [filter]);

  const fetchInvestments = async () => {
    try {
      const response = await api.get(`/api/admin/investments?status=${filter}`);
      setInvestments(response.data);
    } catch (error) {
      setError('Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/investments/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch investment stats:', error);
    }
  };

  const handleStatusChange = async (investmentId, newStatus) => {
    try {
      await api.patch(`/api/admin/investments/${investmentId}/status`, {
        status: newStatus
      });
      fetchInvestments();
      fetchStats();
    } catch (error) {
      setError('Failed to update investment status');
    }
  };

  const filteredInvestments = investments.filter(inv => 
    inv.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Tipster AI Investments</h2>

      {/* Weekly Profits Chart */}
      <div className="bg-[#282828] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Weekly Profits</h3>
        <div className="grid grid-cols-7 gap-2 h-40">
          {stats.weeklyProfits.map((profit, index) => (
            <div key={index} className="flex flex-col justify-end">
              <div 
                className="bg-[#fece00] rounded-t"
                style={{ height: `${(profit / Math.max(...stats.weeklyProfits)) * 100}%` }}
              ></div>
              <p className="text-xs text-center text-gray-400 mt-1">
                ₦{profit.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Investments</h3>
          <p className="text-2xl font-bold text-white">{stats.totalInvestments}</p>
        </div>
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Active Investments</h3>
          <p className="text-2xl font-bold text-green-500">{stats.activeInvestments}</p>
        </div>
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Completed</h3>
          <p className="text-2xl font-bold text-[#fece00]">{stats.completedInvestments}</p>
        </div>
        <div className="bg-[#282828] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">₦{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#282828] rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-2">
            {['all', 'active', 'completed'].map((status) => (
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
          <input
            type="text"
            placeholder="Search by email, name, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border-2 border-[#fece00] focus:outline-none"
          />
        </div>

        {/* Investments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInvestments.map((investment) => (
                <tr key={investment._id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#fece00] flex items-center justify-center text-black font-bold text-sm">
                        {investment.user.firstName[0]}{investment.user.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {investment.user.firstName} {investment.user.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{investment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{investment.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₦{investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(investment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(investment.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-500">
                    ₦{investment.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={investment.status}
                      onChange={(e) => handleStatusChange(investment._id, e.target.value)}
                      className="bg-[#1f1f1f] text-white rounded px-2 py-1 border-2 border-[#fece00]"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
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

export default TipsterAI; 