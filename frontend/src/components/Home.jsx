import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Banner from './Banner';
import About from './about';
import Marketplace from './marketplace';
import PricingPlans from './Tipstar';

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1e1e1e]">
      <Navbar />
      <div className="h-screen">
        <Banner />
      </div>
      <About />
      <Marketplace />
      <PricingPlans />
    </div>
  );
};

export default Home;