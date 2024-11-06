import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import api from './utils/axiosConfig';

const AdminMarketplace = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('freeTips');
  const [tips, setTips] = useState([]);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    sports: '',
    team: '',
    prediction: '',
    bookingCode: '',
    bookmaker: '',
    odds: '',
    probability: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchTips();
  }, [activeTab, page]);

  const fetchTips = async () => {
    try {
      const response = await api.get(`/api/marketplace/admin/tips`, {
        params: {
          type: activeTab.replace('Tips', '').toLowerCase(),
          page,
          limit: 10
        }
      });
      if (response.data && Array.isArray(response.data.tips)) {
        setTips(response.data.tips);
        setPagination(response.data.pagination);
      } else {
        console.error('Unexpected response format:', response.data);
        setTips([]);
      }
    } catch (error) {
      setError('Failed to fetch tips');
      console.error('Error:', error);
      setTips([]);
    }
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user || !user.isAdmin) {
    setError('You are not authorized to create tips');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const tipType = activeTab.replace('Tips', '').toLowerCase();
    const data = {
      ...formData,
      tipType
    };

    // Remove fields that are not needed for the specific tip type
    if (tipType === 'free') {
      delete data.endTime;
      delete data.bookingCode;
      delete data.bookmaker;
      delete data.probability;
      delete data.amount;
    } else if (tipType === 'premium') {
      delete data.endTime;
      delete data.bookingCode;
      delete data.bookmaker;
    }

    await api.post('/api/marketplace/tips', data);
    fetchTips();
    setFormData({
      startTime: '',
      endTime: '',
      sports: '',
      team: '',
      prediction: '',
      bookingCode: '',
      bookmaker: '',
      odds: '',
      probability: '',
      amount: ''
    });
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to create tip');
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const renderFormFields = () => {
    const commonClasses = "bg-[#1f1f1f] text-white rounded px-3 py-2";

    const commonFields = (
      <>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          className={commonClasses}
          required
        />
        <input
          placeholder="Sports"
          name="sports"
          value={formData.sports}
          onChange={handleInputChange}
          className={commonClasses}
          required
        />
        <input
          placeholder="Team"
          name="team"
          value={formData.team}
          onChange={handleInputChange}
          className={commonClasses}
          required
        />
      </>
    );

    switch (activeTab) {
      case 'freeTips':
        return (
          <>
            {commonFields}
            <input
              placeholder="Prediction"
              name="prediction"
              value={formData.prediction}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Odds"
              name="odds"
              value={formData.odds}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
          </>
        );

      case 'premiumTips':
        return (
          <>
            {commonFields}
            <input
              placeholder="Prediction"
              name="prediction"
              value={formData.prediction}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Odds"
              name="odds"
              value={formData.odds}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="1"
              placeholder="Probability (%)"
              name="probability"
              value={formData.probability}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
          </>
        );

      case 'premiumCodes':
        return (
          <>
            {commonFields}
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              placeholder="Booking Code"
              name="bookingCode"
              value={formData.bookingCode}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              placeholder="Bookmaker"
              name="bookmaker"
              value={formData.bookmaker}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Odds"
              name="odds"
              value={formData.odds}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="1"
              placeholder="Probability (%)"
              name="probability"
              value={formData.probability}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={commonClasses}
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (tipId, status) => {
    try {
      const type = activeTab.replace('Tips', '').toLowerCase();
      await api.patch(`/api/marketplace/${type}/${tipId}/status`, {
        status
      });
      fetchTips();
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (tipId) => {
    if (!window.confirm('Are you sure you want to delete this tip?')) return;

    try {
      await api.delete(`/api/marketplace/tips/${tipId}`, {
        params: { type: activeTab.replace('Tips', '').toLowerCase() }
      });
      fetchTips();
    } catch (error) {
      setError('Failed to delete tip');
    }
  };


  return (
    <div className="min-h-screen bg-[#1f1f1f] pt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-[#282828] rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl text-white mb-6">Admin Marketplace</h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
            {['freeTips', 'premiumTips', 'premiumCodes'].map((tab) => (
              <button
                key={tab}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg text-white text-xs md:text-sm
                  ${activeTab === tab ? 'bg-[#282828] shadow-lg' : 'bg-[#1f1f1f]'}
                  hover:bg-[#282828] transition-colors`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          {/* Create Tip Form */}
          <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormFields()}
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-[#fad026] text-black px-4 py-2 rounded hover:bg-[#e5bd22] transition-colors"
            >
              {loading ? 'Creating...' : 'Create Tip'}
            </button>
          </form>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Tips Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-[#1f1f1f]">
                <tr>
                  <th className="px-6 py-3">Sports</th>
                  <th className="px-6 py-3">Team</th>
                  <th className="px-6 py-3">Start Time</th>
                  {activeTab === 'premiumCodes' && <th className="px-6 py-3">End Time</th>}
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              {tips && tips.length > 0 ? (
                <tbody>
                  {tips.map((tip) => (
                    <tr key={tip._id} className="border-b border-[#1f1f1f]">
                      <td className="px-6 py-4">{tip.sports}</td>
                      <td className="px-6 py-4">{tip.team}</td>
                      <td className="px-6 py-4">{new Date(tip.startTime).toLocaleString()}</td>
                      {activeTab === 'premiumCodes' && <td className="px-6 py-4">{new Date(tip.endTime).toLocaleString()}</td>}
                      <td className="px-6 py-4">{tip.status}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(tip._id, 'won')}
                          className="text-green-500 hover:text-green-700"
                        >
                          Won
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(tip._id, 'lost')}
                          className="text-red-500 hover:text-red-700"
                        >
                          Lost
                        </button>
                        <button
                          onClick={() => handleDelete(tip._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">No tips available</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-[#1f1f1f] text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-white">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === pagination.pages}
                className="px-3 py-1 bg-[#1f1f1f] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplace;