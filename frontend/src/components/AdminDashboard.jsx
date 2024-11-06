import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  if (!user?.isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const adminMenuItems = [
    {
      title: 'Marketplace Management',
      description: 'Manage tips and betting codes',
      link: '/admin/marketplace',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      link: '/admin/users',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Transaction History',
      description: 'View all platform transactions',
      link: '/admin/transactions',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Statistics',
      description: 'Platform analytics and reports',
      link: '/admin/stats',
      bgColor: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1f1f1f] pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-[#282828] rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="text-gray-400">
              Welcome back, {user?.firstName}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Total Users</h3>
              <p className="text-white text-2xl font-bold">Loading...</p>
            </div>
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Active Tips</h3>
              <p className="text-white text-2xl font-bold">Loading...</p>
            </div>
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Today's Revenue</h3>
              <p className="text-white text-2xl font-bold">₦0.00</p>
            </div>
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Success Rate</h3>
              <p className="text-white text-2xl font-bold">0%</p>
            </div>
          </div>

          {/* Admin Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.link)}
                className={`${item.bgColor} p-6 rounded-lg text-left hover:opacity-90 transition-opacity`}
              >
                <h3 className="text-black font-bold mb-2">{item.title}</h3>
                <p className="text-black/80 text-sm">{item.description}</p>
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-white text-xl mb-4">Recent Activity</h2>
            <div className="bg-[#1f1f1f] rounded-lg p-4">
              <p className="text-gray-400">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 