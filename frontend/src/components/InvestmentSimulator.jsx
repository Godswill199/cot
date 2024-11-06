import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from './utils/axiosConfig';

const InvestmentSimulator = () => {
  const { user, wallet, refreshWalletBalance, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeInvestment, setActiveInvestment] = useState(null);
  const [investmentData, setInvestmentData] = useState([]);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [eligibleToWithdraw, setEligibleToWithdraw] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const plans = {
    basic: { name: 'Rookie Bettor', min: 20000, max: 50000, rate: 0.03 },
    popular: { name: 'Pro Predictor', min: 50000, max: 100000, rate: 0.035 },
    premium: { name: 'Betting Mastermind', min: 100000, max: 200000, rate: 0.04 }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/investment-simulator' } });
    } else {
      refreshUserData();
    }
  }, [user, navigate, refreshUserData]);

  useEffect(() => {
    if (activeInvestment) {
      simulateInvestment(activeInvestment);
      const interval = setInterval(() => {
        simulateInvestment(activeInvestment);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [activeInvestment]);

  const handlePlanSelection = (planKey) => {
    setSelectedPlan(planKey);
    setError('');
  };

  const handleInvestment = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      if (!wallet || wallet.balance < plans[selectedPlan].min) {
        setError(`Insufficient funds. You need ₦${plans[selectedPlan].min.toLocaleString()} to invest in this plan.`);
        return;
      }

      const response = await api.post('/investments/create', {
        userId: user.id,
        planId: selectedPlan,
        amount: plans[selectedPlan].min
      });

      if (response.status === 201) {
        setActiveInvestment(response.data);
        setInvestedAmount(response.data.amount);
        simulateInvestment(response.data);
        
        await Promise.all([
          refreshWalletBalance(),
          refreshUserData()
        ]);
        
        setSelectedPlan(null);
        setSuccessMessage('Investment created successfully');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create investment');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateInvestment = (investment) => {
    if (!investment) return;

    const rate = plans[investment.plan].rate;
    const startDate = new Date(investment.startDate);
    const currentDate = new Date();
    const daysInvested = Math.max(0, Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)));
    
    const data = [];
    for (let day = 0; day <= daysInvested; day++) {
      const amount = investment.amount * Math.pow((1 + rate / 365), day);
      data.push({
        day,
        amount: Math.round(amount)
      });
    }

    setInvestmentData(data);
    const currentAmount = data[data.length - 1]?.amount || investment.amount;
    setEligibleToWithdraw(Math.round(currentAmount - investment.amount));
  };

  const handleWithdrawal = async () => {
    if (!activeInvestment) return;
  
    try {
      setError('');
      const response = await api.post(`/investments/${activeInvestment._id}/withdraw`);
      
      if (response.status === 200) {
        setActiveInvestment(null);
        setInvestmentData([]);
        setInvestedAmount(0);
        setEligibleToWithdraw(0);
  
        await Promise.all([
          refreshWalletBalance(),
          refreshUserData()
        ]);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError(error.response?.data?.message || 'Failed to withdraw investment');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">
              AI-Powered Betting Investment Plans
            </h2>
            <div className="text-white">
              Wallet Balance: ₦{wallet?.balance?.toLocaleString() || '0'}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-row md:flex-col justify-between md:justify-start gap-2 md:gap-4 md:w-1/3">
              {Object.entries(plans).map(([planKey, plan]) => (
                <button
                  key={planKey}
                  onClick={() => handlePlanSelection(planKey)}
                  className={`plan px-2 py-1 md:px-3 md:py-2 rounded text-xs md:text-sm
                  ${selectedPlan === planKey ? 'bg-[#fad026] text-gray-900' : 'bg-gray-800 text-white'}
                  transition-all duration-200 hover:bg-[#fad026] hover:text-gray-900
                  ${wallet && wallet.balance < plan.min ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!wallet || wallet.balance < plan.min || activeInvestment}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{plan.name}</span>
                    <span className="text-xs mt-1">
                      Min: ₦{plan.min.toLocaleString()}
                    </span>
                    <span className="text-xs">
                      Rate: {(plan.rate * 100).toFixed(1)}% daily
                    </span>
                  </div>
                </button>
              ))}
              {selectedPlan && !activeInvestment && (
                <button
                  onClick={handleInvestment}
                  className="bg-green-500 text-white px-2 py-1 md:px-3 md:py-2 rounded text-xs md:text-sm
                  hover:bg-green-600 transition-colors duration-200"
                >
                  Invest Now
                </button>
              )}
            </div>

            <div className="flex-1 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm md:text-base font-semibold mb-4 text-white">
                Investment Growth Over Time
              </h3>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={investmentData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="day" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="amount" stroke="#fad026" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="investment-details mt-4 space-y-2 text-white">
            <h3 className="text-sm md:text-base font-semibold">
              Invested Amount: ₦{investedAmount.toLocaleString()}
            </h3>
            <h3 className="text-sm md:text-base font-semibold">
              Eligible to Withdraw: ₦{eligibleToWithdraw.toLocaleString()}
            </h3>
            {activeInvestment && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleWithdrawal}
                  className="bg-[#fad026] text-gray-900 px-2 py-1 md:px-3 md:py-2 rounded text-xs md:text-sm
                  hover:bg-[#e5bd22] transition-colors duration-200"
                >
                  Withdraw Investment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;