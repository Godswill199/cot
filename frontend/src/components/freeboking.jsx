import React from 'react';
import { FaStar } from 'react-icons/fa';

const PricingPlans = () => {
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0">
        <img 
          src="src/assets/abg.png" 
          alt="Green circular background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0">
        <img 
          src="src/assets/abg1.png" 
          alt="Yellow circular background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay for blending */}
      <div className="absolute inset-0 bg-black bg-opacity-95 mix-blend-overlay"></div>
      
      {/* Content container */}
      <div className=" min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between">
        <div className="lg:w-1/3 mb-12 lg:mb-0 lg:mt-12">
          <h1 className="text-5xl font-normal mb-4">AI-Powered Betting<br />Investment Plans!</h1>
          <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
          <p className="mb-8">Turbocharge your profits with our<br />AI-driven betting investment plans.<br />No more site hopping; let our<br />technology do the work.</p>
          <div className="flex items-center mb-0">
            <div className="w-7 h-7 mr-2 flex-shrink-0"> <img src="src\assets\billbut.png" alt="Cashoutips subscriptions" /></div>
            <span>Billed monthly</span>
          </div>
          <div className="w-48 h-8  "><img src="src\assets\bill.png" alt="Subscriptions" /></div>
        </div>
        <div className="lg:w-2/3 relative">
          <div className="flex justify-center items-center h-full">
            {plans.map((plan, index) => (
              <div key={index} className={`w-64 transform transition-all duration-300 ${
                plan.highlighted 
                  ? 'scale-105 z-20' 
                  : index === 0 
                    ? '-translate-x-0 z-10' 
                    : 'translate-x-0 z-10'
              }`}>
                <div className={`${plan.highlighted ? 'bg-[#00442f] text-white' : 'bg-white text-gray-800'} rounded-lg overflow-hidden shadow-xl`}>
                  <div className={`${plan.highlighted ? 'bg-[#00bc85] text-black' : 'bg-yellow-400 text-black'} absolute rounded-lg top-0 left-7 -top-3 px-4 py-1 font-semibold`}>
                    {plan.name} {plan.highlighted && <FaStar className="inline ml-1" />}
                  </div>
                  <div className="p-6">
                    <div className="text-3xl font-semibold font-[tomorrow] mb-2">{plan.price}</div>
                    <div className={`${plan.highlighted ? 'text-gray-300' : 'text-gray-500'} mb-4`}>per month</div>
                    <h3 className="text-xl font-semibold font-[tomorrow] mb-4">{plan.title}</h3>
                    <ul className="mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="mb-2 text-sm">{feature}</li>
                      ))}
                    </ul>
                    <button className={`w-full ${plan.buttonColor} text-black py-2 rounded-md font-semibold`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PricingPlans;