// components/PlanSelector.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PlanSelector = ({ plans, onPlanSelect, onStartSimulation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount.toString());
    setError('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (selectedPlan) {
      if (value < selectedPlan.minAmount) {
        setError(`Minimum amount is ₦${selectedPlan.minAmount.toLocaleString()}`);
      } else if (value > selectedPlan.maxAmount) {
        setError(`Maximum amount is ₦${selectedPlan.maxAmount.toLocaleString()}`);
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = () => {
    if (!error && selectedPlan) {
      onPlanSelect(selectedPlan);
      onStartSimulation(Number(amount));
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              rounded-2xl p-6 cursor-pointer transition-all duration-200
              ${selectedPlan?.id === plan.id
                ? 'bg-emerald-600 border-2 border-emerald-400'
                : 'bg-gray-800 border border-gray-700 hover:border-emerald-400'}
            `}
            onClick={() => handlePlanClick(plan)}
          >
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mb-4">{plan.rate}</p>
            <p className="text-sm text-gray-400 mb-4">
              ₦{plan.minAmount.toLocaleString()} - ₦{plan.maxAmount.toLocaleString()}
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mr-2 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Investment Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl
                text-white focus:outline-none focus:border-emerald-400 transition-colors"
              placeholder="Enter amount"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!!error || !amount}
            className={`
              w-full py-4 rounded-xl font-medium text-white shadow-lg
              transition-all duration-200 ease-in-out
              ${!error && amount
                ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'
                : 'bg-gray-600 cursor-not-allowed'}
            `}
          >
            Start Simulation
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PlanSelector;