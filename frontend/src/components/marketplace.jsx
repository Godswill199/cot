import React from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();




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
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
        {/* Who We Are section */}
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mb-8 sm:mb-16">
          {/* Image section */}
          <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <img src="src/assets/iphone.png" alt="iphone with trophy" className="w-full h-auto object-cover rounded-lg" />
          </div>
          
          {/* Text content section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-5xl font-normal text-white mb-6 sm:mb-12">Africa's #1 Ultimate Betting Marketplace</h2>
            <div className="h-1.5 w-24 bg-yellow-500 mb-6 sm:mb-12"></div>
            <p className="text-white mb-8 sm:mb-20 text-base sm:text-xl">
              Cashout Tips is Africa's leading platform for buying
              and selling betting codes. Whether you're a savvy
              bettor looking for winning tips or a tipster ready to
              monetize your expertise, we've got you covered. 
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-12">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-normal text-yellow-500">+100k</h2>
                <p className="text-white">Active Users</p>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-normal text-yellow-500">+10</h2>
                <p className="text-white">Daily Games</p>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-normal text-yellow-500">90%</h2>
                <p className="text-white">Accurate</p>
              </div>
            </div>
            <div className="flex flex-row space-x-4">
          <button onClick={() => navigate('/about-marketplace')} className="flex-1 bg-yellow-500 text-black px-4 sm:px-10 py-2 rounded font-semibold text-sm sm:text-base">Learn More</button>
          <button 
            onClick={() => user ? navigate('/market') : navigate('/register')}
            className="flex-1 px-4 sm:px-10 py-2 border border-[#ffc107] text-[#ffc107] font-semibold text-sm sm:text-base"
          >
            {user ? 'Enter Marketplace' : 'Join Now'}
          </button>
        </div>
          </div>
        </div>
        
        {/* Your Winning Playground section */}
        <div className="max-w-6xl mx-auto my-20">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-normal text-white mb-6 text-center">Your Winning <br/> Playground</h1>
            <div className="h-1 w-24 bg-yellow-500 mb-6"></div>
            <p className="text-xl max-w-2xl text-gray-300 text-center">
              We ensure a fair and secure marketplace through strict verification and monitoring.
              Join our community today and start winning!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-lg">
              <img src="src/assets/background1.png" alt="Crowd" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-between">
                <h2 className="text-yellow-400 font-semibold mb-4">HOW IT WORKS</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white"><strong>Betters:</strong> Discover and purchase verified betting codes from top tipsters.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white"><strong>Tipsters:</strong> Sell your winning codes and earn extra cash.</span>
                  </li>
                </ul>
              </div>
              <div className="absolute top-1/2 left-0 w-1 h-16 bg-yellow-400 transform -translate-y-1/2"></div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg">
              <img src="src/assets/background2.png" alt="Crowd" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-between">
                <h2 className="text-yellow-400 font-semibold mb-4">KEY BENEFITS</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Access to verified tips</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Opportunity to earn extra income</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Secure transactions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Strong community support</span>
                  </li>
                </ul>
              </div>
              <div className="absolute top-1/2 left-0 w-1 h-16 bg-yellow-400 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;