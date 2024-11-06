import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, replied

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/admin/messages?filter=${filter}`);
      setMessages(response.data);
    } catch (error) {
      setError('Failed to fetch messages');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !reply.trim()) return;

    setLoading(true);
    try {
      await api.post(`/api/admin/messages/${selectedMessage._id}/reply`, {
        reply
      });
      setSuccess('Reply sent successfully');
      setReply('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.patch(`/api/admin/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      setError('Failed to mark message as read');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">User Messages</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 bg-[#282828] rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Messages</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1f1f1f] text-white rounded px-3 py-1 border-2 border-[#fece00] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message._id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) markAsRead(message._id);
                }}
                className={`p-3 rounded cursor-pointer transition-colors
                  ${selectedMessage?._id === message._id ? 'bg-[#fece00] text-black' : 'bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]'}
                  ${!message.read ? 'border-l-4 border-[#fece00]' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{message.user.firstName} {message.user.lastName}</div>
                  <div className="text-xs opacity-75">{new Date(message.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-sm truncate">{message.subject}</div>
                <div className="text-xs mt-1 opacity-75">
                  {message.replied ? 'Replied' : message.read ? 'Read' : 'Unread'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content and Reply */}
        <div className="md:col-span-2 bg-[#282828] rounded-lg shadow-lg p-4">
          {selectedMessage ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">{selectedMessage.subject}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#1f1f1f] p-4 rounded text-white">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.reply && (
                <div>
                  <h4 className="text-md font-medium text-white mb-2">Your Reply</h4>
                  <div className="bg-[#1f1f1f] p-4 rounded text-white">
                    {selectedMessage.reply}
                  </div>
                </div>
              )}

              {!selectedMessage.replied && (
                <form onSubmit={handleReply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Reply
                    </label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border-2 border-[#fece00] focus:outline-none"
                      placeholder="Type your reply..."
                      rows={4}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-[#fece00] hover:bg-[#fad026] text-black rounded-lg font-medium transition-colors duration-200"
                  >
                    {loading ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a message to view
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 rounded bg-green-500/10 border border-green-500 text-green-500">
          {success}
        </div>
      )}
    </div>
  );
};

export default UserMessages; 