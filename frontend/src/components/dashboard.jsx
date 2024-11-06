import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Banner from './Banner';
import Navbar from './Navbar';

const Dashboard = () => {
  const { user, wallet } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1e1e1e]">
      <Navbar />
      {/* Background Images */}
      <div className="absolute inset-0">
        <img
          src="src/assets/abg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0">
        <img
          src="src/assets/abg1.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-80 mix-blend-overlay"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Welcome Banner */}
        <div className="h-[50vh]">
          <Banner />
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wallet Card */}
            <div className="bg-[#282828] rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Wallet Balance</h3>
              <p className="text-2xl text-[#fad026]">
                ₦{wallet?.balance?.toLocaleString() || '0'}
              </p>
            </div>

            {/* Active Investments Card */}
            <div className="bg-[#282828] rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Active Investments</h3>
              <p className="text-2xl text-[#fad026]">
                Coming Soon
              </p>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-[#282828] rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {wallet?.transactions?.slice(0, 3).map((transaction, index) => (
                  <div key={index} className="flex justify-between text-white">
                    <span>{transaction.type}</span>
                    <span>₦{transaction.amount.toLocaleString()}</span>
                  </div>
                )) || <p className="text-gray-400">No recent transactions</p>}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/deposit')}
              className="bg-[#fad026] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#e5bd22] transition-all duration-300"
            >
              Deposit
            </button>
            <button
              onClick={() => navigate('/market')}
              className="bg-[#282828] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-300"
            >
              Marketplace
            </button>
            <button
              onClick={() => navigate('/tips')}
              className="bg-[#282828] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-300"
            >
              Investment Plans
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-[#282828] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-300"
            >
              Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;