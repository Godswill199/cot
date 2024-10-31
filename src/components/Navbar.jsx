// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  FaShoppingBag, FaWallet, FaSignOutAlt, FaHistory, FaBell, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AiOutlineDollarCircle, AiOutlineTransaction, AiFillRobot } from 'react-icons/ai';
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const { user, logout, wallet, notifications, loading, walletLoading, refreshUserData, refreshWalletBalance } = useAuth();
  const [localWalletLoading, setLocalWalletLoading] = useState(true);



  useEffect(() => {
    console.log('Navbar useEffect - User:', user?.id);
    console.log('Navbar useEffect - Wallet:', wallet);
    console.log('Navbar useEffect - WalletLoading:', walletLoading);
  
    if (user?.id) {
      if (!wallet || wallet.balance === undefined) {
        console.log('Triggering wallet balance refresh from Navbar');
        refreshWalletBalance();
      } else {
        console.log('Wallet balance available:', wallet.balance);
        setLocalWalletLoading(false);
      }
    } else {
      console.log('User not set in Navbar');
    }
  }, [user, wallet, walletLoading, refreshWalletBalance]);



  const handleNavItemClick = (component) => {
    if (!user && ['Market', 'History', 'Account', 'Wallet', 'Transactions'].includes(component)) {
      navigate('/login', { state: { from: `/${component.toLowerCase()}` } });
    } else {
      setActiveComponent(component);
      navigate(`/${component.toLowerCase()}`);
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Keep menu open on desktop, closed on mobile
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add click handler to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (isMobile && isOpen && 
          sidebar && !sidebar.contains(event.target) && 
          hamburgerButton && !hamburgerButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // wallet and transactions

  useEffect(() => {
    if (user && !wallet) {
      refreshUserData();
    }
  }, [user, wallet, refreshUserData]);


  // only wallet balance
  useEffect(() => {
    if (user && (!wallet || wallet.balance === undefined)) {
      refreshWalletBalance();
    }
  }, [user, wallet, refreshWalletBalance]);

  const navItems = [
    {label: '', component: 'Market' },
    { icon: <FaShoppingBag />, label: 'Marketplace', component: 'Market' },
    { icon: <AiOutlineDollarCircle />, label: 'Free Tips', component: 'Market' },
    { icon: <MdAccountCircle />, label: 'Account', component: 'Account' },
    { icon: <AiFillRobot />, label: 'Tipstar AI', component: 'Tips' },
    { icon: <FaWallet />, label: 'Wallet', component: 'Deposit' },
    { icon: <AiOutlineTransaction />, label: 'Transactions', component: 'Transactions' },
    { icon: <FaSignOutAlt />, label: 'Logout', component: 'Logout' },
  ];

  useEffect(() => {
    document.body.style.overflow = (isMobile && isOpen) || showNotifications ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isMobile, isOpen, showNotifications]);

  if (loading) {
    return (
      <nav className="bg-[#1e1e1e] fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <>
       <nav className="bg-[#1e1e1e] fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          {/* Hamburger menu button - show on both mobile and desktop */}
          <button
            id="hamburger-button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to={user ? '/market' : '/'} className="text-white text-xl font-bold ml-4">
            <img
              src="src/assets/logo.png"
              alt="Cashout Tips Logo"
              className="w-auto h-auto max-w-full max-h-[30vh] object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center">
          {user ? (
            <>
              <button 
                className="relative mr-4" 
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <FaBell className="text-white text-xl" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
                )}
              </button>

              {user ? (
                  <div className="text-white mr-4">
                    {localWalletLoading || walletLoading ? 'Loading...' : `₦${wallet?.balance || 0}`}
                  </div>
                ) : (
                  <div className="text-white mr-4">Not logged in</div>
              )}

              <button 
                onClick={() => navigate('/deposit')} 
                className="flex items-center bg-[#fad026] text-black px-4 py-2 rounded mr-4"
              >
                <FaWallet className="mr-2" /> Deposit
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="focus:outline-none"
                  aria-label="User menu"
                >
                  <MdAccountCircle className="text-white text-3xl" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-lg py-1 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Withdrawal</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Change Password</a>
                    <a href="/tips" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Subscriptions</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Upload Tips</a>
                    <a href="/transactions" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Transaction History</a>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigate('/login')} className="bg-[#fad026] text-black px-4 py-2 rounded mr-2">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="border border-[#fad026] text-[#fad026] px-4 py-2 rounded">
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <aside 
        id="sidebar"
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#1e1e1e] flex flex-col items-center pt-4 
          transition-all duration-300 ease-in-out z-40
          ${isMobile ? (isOpen ? 'w-64' : 'w-0') : (isOpen ? 'w-64' : 'w-16')} 
          overflow-hidden`}
      >
        <div className="w-full px-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center w-full py-4 px-3 my-2 text-gray-400 rounded hover:text-white
                transition-colors duration-200
                ${(isMobile ? isOpen : isOpen) ? 'bg-[#282828] hover:bg-[#3a3a3a]' : 'hover:bg-[#282828]'}
                ${isMobile && !isOpen ? 'hidden' : ''}`}
              onClick={() => handleNavItemClick(item.component)}
            >
              <div className={`text-xl flex-shrink-0 ${(isMobile ? isOpen : isOpen) ? '' : 'mx-auto'}`}>
                {item.icon}
              </div>
              {(isMobile ? isOpen : isOpen) && 
                <span className="ml-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              }
            </button>
          ))}
        </div>
      </aside>

      <div
        className={`fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-[#1e1e1e] z-40
          transition-transform duration-300 ease-in-out
          ${showNotifications ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-4 text-white">
          <h2 className="text-xl mb-4">Notifications</h2>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="bg-[#282828] p-2 rounded mb-2">
                {notification.message}
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
        <button 
          onClick={() => setShowNotifications(false)} 
          className="absolute top-4 right-4 text-white text-2xl"
        >
          <FaTimes />
        </button>
      </div>
    </>
  );
};

export default Navbar;