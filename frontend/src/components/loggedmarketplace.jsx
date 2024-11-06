import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import api from './utils/axiosConfig';

const LoggedMarketplace = () => {
  const [activeTab, setActiveTab] = useState('freeTips');
  const [showMore, setShowMore] = useState(false);
  const [tips, setTips] = useState({
    freeTips: [],
    premiumTips: [],
    premiumCodes: []
  });
  const { user, wallet, refreshWalletBalance } = useAuth();

  useEffect(() => {
    fetchTips();
  }, [activeTab]);

  const fetchTips = async () => {
    try {
      let endpoint = `/api/marketplace/${activeTab.toLowerCase()}`;
      const response = await api.get(endpoint);
      
      if (response.data && Array.isArray(response.data)) {
        setTips(prevTips => ({
          ...prevTips,
          [activeTab]: response.data
        }));
      } else {
        console.error('Unexpected response format:', response.data);
        setTips(prevTips => ({
          ...prevTips,
          [activeTab]: []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch tips:', error);
      setTips(prevTips => ({
        ...prevTips,
        [activeTab]: []
      }));
    }
  };


  const handlePurchase = async (tipId) => {
    try {
      if (!user.isPremium && activeTab !== 'freeTips') {
        console.error('You need a premium subscription to access this tip');
        return;
      }

      if (activeTab !== 'freeTips') {
        const response = await api.post('/api/marketplace/purchase', {
          tipId,
          tipType: activeTab === 'premiumTips' ? 'tip' : 'code'
        });

        if (response.status === 200) {
          await refreshWalletBalance();
          fetchTips();
        }
      }
    } catch (error) {
      console.error('Failed to purchase tip:', error);
    }
  };

  const renderTabContent = () => {
  const commonTableClasses = "w-full text-xs md:text-sm text-white";
  const commonHeaderClasses = "px-2 md:px-4 py-2 md:py-3 bg-[#1f1f1f] text-xs whitespace-nowrap";
  const commonCellClasses = "px-2 md:px-4 py-2 md:py-3 bg-[#282828] text-xs";

  const columns = {
    freeTips: ['Start Time', 'Sports', 'Team', 'Prediction', 'Status'],
    premiumTips: ['Start Time', 'Sports', 'Team', 'Prediction', 'Odds', 'Probability', 'Amount', 'Status', 'Actions'],
    premiumCodes: ['Start Time', 'End Time', 'Sports', 'Booking Code', 'Bookmaker', 'Odds', 'Probability', 'Amount', 'Status', 'Actions']
  };

  const currentTips = tips[activeTab] || [];
  const visibleTips = showMore ? currentTips : currentTips.slice(0, 3);

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
              <td className={commonCellClasses}>{new Date(tip.startTime).toLocaleString()}</td>
              {activeTab === 'premiumCodes' && (
                <td className={commonCellClasses}>{new Date(tip.endTime).toLocaleString()}</td>
              )}
              <td className={commonCellClasses}>{tip.sports}</td>
              <td className={commonCellClasses}>{tip.team}</td>
              {activeTab === 'freeTips' && (
                <td className={commonCellClasses}>{tip.prediction}</td>
              )}
              {(activeTab === 'premiumTips' || activeTab === 'premiumCodes') && (
                <>
                  <td className={commonCellClasses}>
                    {user.isPremium ? (activeTab === 'premiumTips' ? tip.prediction : tip.bookingCode) : '********'}
                  </td>
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
                    onClick={() => handlePurchase(tip._id)}
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
    <div className="min-h-screen bg-[#1f1f1f] pt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-[#282828] rounded-lg shadow-lg p-4 md:p-6">
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

          <div className="overflow-x-auto rounded-lg">
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