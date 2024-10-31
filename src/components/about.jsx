import React from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const About = () => {

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
            <img src="src/assets/about.png" alt="Sports fans" className="w-full h-auto object-cover rounded-lg" />
          </div>
          
          {/* Text content section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-5xl font-normal text-white mb-6 sm:mb-12">Who We Are</h2>
            <div className="h-1.5 w-24 bg-yellow-500 mb-6 sm:mb-12"></div>
            <p className="text-white mb-8 sm:mb-20 text-base sm:text-xl">
              Revolutionizing the betting industry, we're your ultimate platform for success. Empowering bettors with free tips, a dynamic marketplace, and investment opportunities, we're committed to helping you make informed decisions and maximize your winnings.
            </p>
           <div className="flex flex-row space-x-4">
              <button onClick={() => navigate('/about')} className="flex-1 bg-yellow-500 text-black px-4 sm:px-10 py-2 rounded font-semibold text-sm sm:text-base">Learn More</button>
              <button 
                onClick={() => user ? navigate('/market') : navigate('/register')}
                className="flex-1 px-4 sm:px-10 py-2 border border-[#ffc107] text-[#ffc107] font-semibold text-sm sm:text-base"
              >
                {user ? 'Join Market' : 'Join Now'}
              </button>
            </div>
          </div>
        </div>
        
        
        {/* Mission Section */}
        <div className="flex flex-col lg:flex-row text-white p-4 sm:p-8 rounded-lg max-w-6xl mx-auto">
          {/* Left section with image and overlays */}
          <div className="w-full lg:w-1/2 relative mb-8 lg:mb-0">
            <img 
              src="src/assets/about2.png" 
              alt="Man with phone and soccer ball" 
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute top-1/2 left-0 bg-green-900 p-2 sm:p-4 max-w-[45%] transform -translate-y-full">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <img 
                  src="src/assets/dart.png" 
                  alt="Dartboard icon" 
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain"
                />
              </div>
              <p className="flex items-center justify-center text-[10px] sm:text-xs lg:text-sm">To provide bettors with a one-stop shop for all their betting needs.</p>
            </div>
            <div className="absolute bottom-6 left-0 bg-yellow-500 p-2 sm:p-4 max-w-[45%]">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <img 
                  src="src/assets/trophy.png" 
                  alt="Trophy icon" 
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain"
                />
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm flex items-center justify-center text-black">To help bettors make informed decisions and increase their chances of winning.</p>
            </div>
          </div>

          {/* Right section with text content */}
          <div className="w-full lg:w-1/2 lg:pl-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-normal mb-4 sm:mb-6 lg:mb-12">Our mission <br/>is simple</h2>
            <div className="h-1 sm:h-1.5 w-16 sm:w-24 bg-yellow-500 mb-4 sm:mb-6 lg:mb-12"></div>
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex items-start">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 mr-2 text-yellow-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className='text-sm sm:text-base lg:text-xl'>To create a fair and transparent marketplace for buying and selling betting tips.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 mr-2 text-yellow-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className='text-sm sm:text-base lg:text-xl'>To offer a rewarding referral program that benefits both referrers and new users.</span>
              </li>
            </ul>
            <button onClick={() => user ? navigate('/market') : navigate('/register')}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded mt-4 sm:mt-6 self-start text-sm sm:text-base"
        >
          {user ? 'Enter Marketplace' : 'Register Instantly'}
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;