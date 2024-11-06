import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const PricingPlans = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const plans = [
        {
          name: 'Basic',
          title: 'Rookie Bettor',
          price: '₦20,000',
          features: [
            'Make 12% (3% weekly) in profit',
            'Instant profit withdrawal every 7 Days',
          ],
          buttonText: 'Get Started',
          buttonColor: 'bg-yellow-400',
        },
        {
          name: 'Most Popular',
          title: 'Pro Predictor',
          price: '₦50,000',
          features: [
            'Make 14% (3.5% weekly) in profit',
            'Instant profit withdrawal every 7 Days',
            'Access to our exclusive insider group',
          ],
          buttonText: 'Upgrade Now',
          buttonColor: 'bg-[#00bc85]',
          highlighted: true,
        },
        {
          name: 'Premium',
          title: 'Betting Mastermind',
          price: '₦100,000',
          features: [
            'Make 16% (4% weekly) in profit',
            'Instant profit withdrawal every 7 Days',
          ],
          buttonText: 'Choose Plan',
          buttonColor: 'bg-yellow-400',
        },
    ];

    const handlePlanSelection = (plan) => {
        if (user) {
            navigate('/subscribe', { state: { plan } });
        } else {
            navigate('/login', { state: { from: '/pricing' } });
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-12">AI-Powered Betting Investment Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div key={index} className={`bg-gray-800 rounded-lg overflow-hidden shadow-xl ${plan.highlighted ? 'transform scale-105' : ''}`}>
                            <div className={`${plan.highlighted ? 'bg-[#00bc85]' : 'bg-yellow-400'} p-4`}>
                                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                            </div>
                            <div className="p-6">
                                <h4 className="text-2xl font-bold text-white mb-4">{plan.title}</h4>
                                <p className="text-3xl font-semibold text-white mb-6">{plan.price}<span className="text-sm font-normal"> / month</span></p>
                                <ul className="mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-300 mb-2">
                                            <FaStar className="text-yellow-400 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePlanSelection(plan)}
                                    className={`w-full ${plan.buttonColor} text-gray-900 py-2 rounded-md font-semibold`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPlans;