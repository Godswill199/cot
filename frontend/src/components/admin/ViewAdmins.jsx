import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const ViewAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/api/admin/list');
      setAdmins(response.data);
    } catch (error) {
      setError('Failed to fetch admin list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">View Admins</h2>
      
      <div className="bg-[#282828] rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-[#1f1f1f]">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#fad026] flex items-center justify-center text-black font-bold">
                        {admin.firstName[0]}{admin.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {admin.firstName} {admin.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.isSuperAdmin ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(admin.lastActive).toLocaleDateString()}
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

export default ViewAdmins; 