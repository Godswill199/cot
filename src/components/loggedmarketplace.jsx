import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from './context/AuthContext';
import api from './utils/axiosConfig';

const LoggedMarketplace = () => {
  const [activeTab, setActiveTab] = useState('freeTips');
  const [showMore, setShowMore] = useState(false);
  const [tips, setTips] = useState([]);
  const { user, wallet, refreshWalletBalance } = useAuth();

  useEffect(() => {
    fetchTips();
  }, [activeTab]);

  const fetchTips = async () => {
    try {
      let response;
      switch (activeTab) {
        case 'freeTips':
          response = await api.get('/marketplace/free-tips');
          break;
        case 'premiumTips':
          response = await api.get('/marketplace/premium-tips');
          break;
        case 'premiumCodes':
          response = await api.get('/marketplace/premium-codes');
          break;
        default:
          return;
      }
      setTips(response.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const handlePurchase = async (tipId, tipType) => {
    try {
      await api.post('/marketplace/purchase', { tipId, tipType });
      refreshWalletBalance();
      fetchTips();
    } catch (error) {
      console.error('Error purchasing tip:', error);
    }
  };

  const renderTabContent = () => {
    const commonTableClasses = "w-full text-xs md:text-sm text-white";
    const commonHeaderClasses = "px-2 md:px-4 py-2 md:py-3 bg-[#1f1f1f] text-xs whitespace-nowrap";
    const commonCellClasses = "px-2 md:px-4 py-2 md:py-3 bg-[#282828] text-xs";

    const columns = {
      freeTips: ['Time', 'Sports', 'User', 'Team', 'Prediction', 'Status'],
      premiumTips: ['Time', 'Sports', 'User', 'Team', 'Prediction', 'Odds', 'Probability', 'Amount', 'Status', 'Actions'],
      premiumCodes: ['Time', 'Sports', 'User', 'Booking Code', 'Bookmaker', 'Odds', 'Probability', 'Amount', 'Status', 'Actions']
    };

    const visibleTips = showMore ? tips : tips.slice(0, 3);

    return (
      <div className="w-full">
        <table className={commonTableClasses}>
          <thead>
            <tr>
              {columns[activeTab].map((column) => (
                <th key={column} className={commonHeaderClasses}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleTips.map((tip) => (
              <tr key={tip._id}>
                <td className={commonCellClasses}>{tip.time}</td>
                <td className={commonCellClasses}>{tip.sports}</td>
                <td className={commonCellClasses}>{tip.user}</td>
                <td className={commonCellClasses}>{tip.team}</td>
                <td className={commonCellClasses}>
                  {activeTab === 'freeTips' || user.isPremium ? tip.prediction : '********'}
                </td>
                {(activeTab === 'premiumTips' || activeTab === 'premiumCodes') && (
                  <>
                    <td className={commonCellClasses}>{tip.odds}</td>
                    <td className={commonCellClasses}>{tip.probability}</td>
                    <td className={commonCellClasses}>{tip.amount}</td>
                  </>
                )}
                <td className={commonCellClasses}>
                  <span className={`px-2 py-1 rounded ${tip.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'} text-xs`}>
                    {tip.status}
                  </span>
                </td>
                {(activeTab === 'premiumTips' || activeTab === 'premiumCodes') && (
                  <td className={commonCellClasses}>
                    <button
                      className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-xs"
                      onClick={() => handlePurchase(tip._id, activeTab === 'premiumTips' ? 'premiumTip' : 'premiumCode')}
                      disabled={user.isPremium || wallet.balance < tip.amount}
                    >
                      {user.isPremium ? 'View' : 'BUY'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 flex justify-center">
        <div className="bg-[#282828] rounded-lg shadow-lg p-4 md:p-6 w-full">
          <h1 className="text-xl md:text-2xl text-white mb-4 md:mb-6">Marketplace</h1>
          
          <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
            {['freeTips', 'premiumTips', 'premiumCodes'].map((tab) => (
              <button
                key={tab}
                className={`
                  px-3 md:px-6 py-2 md:py-3 rounded-lg text-white text-xs md:text-sm
                  ${activeTab === tab ? 'bg-[#282828] shadow-lg' : 'bg-[#1f1f1f]'}
                  hover:bg-[#282828] transition-colors
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          <div className="rounded-lg overflow-x-auto">
            {renderTabContent()}
          </div>

          <button 
            className="mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 bg-[#1f1f1f] text-white rounded-lg hover:bg-[#282828] transition-colors text-xs md:text-sm"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoggedMarketplace;