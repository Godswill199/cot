import React, { useState } from 'react';
import Navbar from './Navbar';

const Dashboard = () => {

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
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

      
    </div>
  );
};

export default Dashboard;