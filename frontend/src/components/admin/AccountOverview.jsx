import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosConfig';

const AccountOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats();
    fetchRecentActivity();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/api/admin/stats/overview');
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch admin statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get('/api/admin/activity');
      setRecentActivity(response.data);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Account Overview</h2>

      {/* Admin Profile Card */}
      <div className="bg-[#282828] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-[#fece00] flex items-center justify-center text-black text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h3>
            <p className="text-gray-400">{user?.email}</p>
            <div className="mt-2 px-3 py-1 bg-purple-500 text-white text-sm rounded-full inline-block">
              Super Admin
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#282828] rounded-lg shadow-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Total Users</h4>
          <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
          <p className="text-sm text-green-500 mt-2">
            +{stats?.newUsersToday || 0} today
          </p>
        </div>

        <div className="bg-[#282828] rounded-lg shadow-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-white">₦{stats?.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-sm text-green-500 mt-2">
            +₦{stats?.revenueToday?.toLocaleString() || 0} today
          </p>
        </div>

        <div className="bg-[#282828] rounded-lg shadow-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Active Tips</h4>
          <p className="text-2xl font-bold text-white">{stats?.activeTips || 0}</p>
          <p className="text-sm text-[#fece00] mt-2">
            {stats?.pendingTips || 0} pending
          </p>
        </div>

        <div className="bg-[#282828] rounded-lg shadow-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Success Rate</h4>
          <p className="text-2xl font-bold text-white">{stats?.successRate || 0}%</p>
          <p className="text-sm text-green-500 mt-2">
            Last 30 days
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#282828] rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg"
            >
              <div>
                <p className="text-white">{activity.description}</p>
                <p className="text-sm text-gray-400">{activity.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/marketplace')}
          className="px-4 py-3 bg-[#fece00] text-black rounded-lg hover:bg-[#e5bd22] transition-colors"
        >
          Manage Tips
        </button>
        <button
          onClick={() => navigate('/admin/withdrawals')}
          className="px-4 py-3 bg-[#282828] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
        >
          View Withdrawals
        </button>
        <button
          onClick={() => navigate('/admin/notifications')}
          className="px-4 py-3 bg-[#282828] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default AccountOverview; 