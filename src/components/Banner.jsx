// src/components/Banner.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Banner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: false,
  };

  const loggedOutSlides = [
    {
      bgImage: 'src/assets/background.jpg',
      title: 'Beyond Stocks and Forex',
      subtitle: 'Unleash your potential in sports trading',
      description: 'Tired of traditional betting? Dive into the world of sports trading.',
      ctaText: 'Register Now',
      ctaAction: () => navigate('/register')
    },
    {
      bgImage: 'src/assets/background1.png',
      title: 'Connect with Like-minded Bettors',
      subtitle: 'Join our thriving community',
      description: 'Share strategies, insights, and maximize your winnings together.',
      ctaText: 'Join Community',
      ctaAction: () => navigate('/register')
    },
    {
      bgImage: 'src/assets/background2.png',
      title: 'Trade Booking Codes',
      subtitle: 'Revolutionize your betting experience',
      description: 'Access exclusive opportunities and elevate your game.',
      ctaText: 'Start Trading',
      ctaAction: () => navigate('/register')
    }
  ];

  const loggedInSlides = [
    {
      bgImage: 'src/assets/background.jpg',
      title: 'Gain valuable insights into various betting markets',
      subtitle: 'Welcome back to Cashout Tips',
      description: 'Explore our latest market trends and betting opportunities.',
      ctaText: 'View Markets',
      ctaAction: () => navigate('/markets')
    },
    {
      bgImage: 'src/assets/background1.png',
      title: 'Elevate Your Betting Game with Our Free Tips',
      subtitle: 'Access expert predictions',
      description: 'Check out our latest free tips from experienced tipsters.',
      ctaText: 'View Free Tips',
      ctaAction: () => navigate('/free-tips')
    },
    {
      bgImage: 'src/assets/background2.png',
      title: 'Start Your Winning Streak Today!',
      subtitle: 'Premium betting codes await',
      description: 'Browse our curated selection of premium betting codes from verified tipsters.',
      ctaText: 'View Premium Codes',
      ctaAction: () => navigate('/premium-codes')
    }
  ];

  const slides = user ? loggedInSlides : loggedOutSlides;

  return (
    <div className="w-full h-screen">
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-3000 ease-in-out slide-background"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-green-900 bg-opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 lg:space-y-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal font-['Tomorrow', sans-serif] text-white leading-tight">
                  {slide.title}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal font-['Tomorrow', sans-serif] text-white">
                  {slide.subtitle}
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal font-['Montserrat', sans-serif] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-white">
                  {slide.description}
                </p>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={slide.ctaAction}
                  className="bg-yellow-500 text-black px-6 py-3 font-semibold rounded-lg text-sm sm:text-base md:text-lg transition duration-300 ease-in-out hover:bg-yellow-600"
                >
                  {slide.ctaText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;