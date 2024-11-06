import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const SubscriptionProcess = () => {
  const { user, wallet, refreshUserData  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const plan = location.state?.plan;

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError('');

    const planPrice = parseInt(plan.price.replace('₦', '').replace(',', ''));

    if (wallet.balance < planPrice) {
      setError('Insufficient balance. Please deposit funds.');
      setIsProcessing(false);
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // to process the subscription and update the user's account
      // For this example, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update wallet balance
      const newBalance = wallet.balance - planPrice;
      await updateWallet(newBalance);

      // Navigate to dashboard or confirmation page
      navigate('/dashboard', { state: { message: `Successfully subscribed to ${plan.title}!` } });
    } catch (err) {
      setError('An error occurred while processing your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <div className="bg-gray-900 text-white p-8 min-h-screen">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Subscribe to {plan.title}</h2>
        <p className="mb-4">Price: {plan.price}</p>
        <p className="mb-4">Your wallet balance: ₦{wallet?.balance.toLocaleString()}</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className={`w-full ${plan.buttonColor} text-gray-900 py-2 rounded-md font-semibold ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing...' : 'Confirm Subscription'}
        </button>
        {wallet?.balance < parseInt(plan.price.replace('₦', '').replace(',', '')) && (
          <button
            onClick={() => navigate('/deposit')}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold mt-4"
          >
            Deposit Funds
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionProcess;