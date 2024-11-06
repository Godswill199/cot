import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const EmailUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    sendToAll: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.sendToAll && selectedUsers.length === 0) {
      setError('Please select at least one user or choose "Send to All"');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/admin/email', {
        ...formData,
        recipients: formData.sendToAll ? 'all' : selectedUsers
      });

      setSuccess('Email sent successfully');
      setFormData({ subject: '', message: '', sendToAll: false });
      setSelectedUsers([]);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Email Users</h2>
      
      <div className="max-w-4xl bg-[#282828] rounded-lg shadow-lg p-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              placeholder="Enter email subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00]"
              placeholder="Enter your message"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendToAll"
              checked={formData.sendToAll}
              onChange={(e) => {
                setFormData({ ...formData, sendToAll: e.target.checked });
                if (e.target.checked) {
                  setSelectedUsers([]);
                }
              }}
              className="form-checkbox h-5 w-5 text-[#fece00] rounded border-gray-700 bg-[#1f1f1f] focus:ring-[#fece00]"
            />
            <label htmlFor="sendToAll" className="text-white">
              Send to All Users
            </label>
          </div>

          {!formData.sendToAll && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Recipients
              </label>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#fece00] focus:ring-1 focus:ring-[#fece00] mb-4"
              />
              <div className="max-h-60 overflow-y-auto bg-[#1f1f1f] rounded-lg p-2">
                {filteredUsers.map((user) => (
                  <label key={user._id} className="flex items-center p-2 hover:bg-[#282828] rounded">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user._id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-[#fece00] rounded border-gray-700 bg-[#1f1f1f] focus:ring-[#fece00]"
                    />
                    <span className="ml-2 text-white">
                      {user.firstName} {user.lastName} ({user.email})
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {selectedUsers.length} users selected
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#fece00] hover:bg-[#fad026] text-black rounded-lg font-medium transition-colors duration-200"
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailUsers; 