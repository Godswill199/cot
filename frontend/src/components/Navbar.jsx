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
import api from './utils/axiosConfig';
import { getCurrencyByLocation, getExchangeRates, formatCurrency } from '../utils/currencyUtils';
import Spinner from './common/Spinner';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const { 
    user, 
    wallet, 
    loading,
    walletLoading,
    isUserLoggedIn,
    refreshWalletBalance,
    refreshUserData,
    handleLogout 
  } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [localWalletLoading, setLocalWalletLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [localCurrency, setLocalCurrency] = useState({ code: 'NGN', country: 'Nigeria' });
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  // Initial data fetch and polling
  useEffect(() => {
    const initializeData = async () => {
      if (!isUserLoggedIn) {
        setLocalWalletLoading(false);
        setPageLoading(false);
        return;
      }

      try {
        await refreshUserData();
        await refreshWalletBalance();
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLocalWalletLoading(false);
        setPageLoading(false);
      }
    };

    initializeData();
  }, [isUserLoggedIn, refreshUserData, refreshWalletBalance]);

  // Handle wallet data updates
  useEffect(() => {
    if (wallet?.data?.balance !== undefined) {
      setWalletBalance(wallet.data.balance);
      setLocalWalletLoading(false);
    }
  }, [wallet]);

  // Polling for updates
  useEffect(() => {
    if (!isUserLoggedIn) return;

    const pollInterval = setInterval(async () => {
      try {
        await refreshWalletBalance();
      } catch (error) {
        console.error('Error polling wallet:', error);
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [isUserLoggedIn, refreshWalletBalance]);

  // Currency conversion
  useEffect(() => {
    const fetchCurrencyAndConvert = async () => {
      if (!isUserLoggedIn || !wallet?.data?.balance) return;

      try {
        // Default to NGN if conversion fails
        let convertedBalance = wallet.data.balance;
        let userCurrency = { code: 'NGN', country: 'Nigeria' };

        // Try to get cached currency preference
        const cachedCurrency = localStorage.getItem('userCurrency');
        if (cachedCurrency) {
          const parsed = JSON.parse(cachedCurrency);
          // Only use cache if it's less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            userCurrency = parsed;
          }
        }

        if (userCurrency.code !== 'NGN') {
          try {
            const response = await axios.get(
              `https://api.frankfurter.app/latest?amount=${wallet.data.balance}&from=NGN&to=${userCurrency.code}`
            );
            
            if (response.data && response.data.rates) {
              convertedBalance = response.data.rates[userCurrency.code];
              setWalletBalance(convertedBalance);
              setLocalCurrency(userCurrency);
            } else {
              throw new Error('Invalid response format');
            }
          } catch (conversionError) {
            console.error('Currency conversion error:', conversionError);
            // Fallback to NGN
            setWalletBalance(wallet.data.balance);
            setLocalCurrency({ code: 'NGN', country: 'Nigeria' });
          }
        } else {
          setWalletBalance(wallet.data.balance);
          setLocalCurrency(userCurrency);
        }

        // Cache the currency preference
        localStorage.setItem('userCurrency', JSON.stringify({
          ...userCurrency,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error('Currency handling error:', error);
        // Fallback to NGN
        setWalletBalance(wallet.data.balance);
        setLocalCurrency({ code: 'NGN', country: 'Nigeria' });
      }
    };

    fetchCurrencyAndConvert();
  }, [isUserLoggedIn, wallet?.data?.balance]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isUserLoggedIn) return;
      
      try {
        const response = await api.get('/users/notifications');
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Poll for new notifications every minute
    const pollInterval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(pollInterval);
  }, [isUserLoggedIn]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/users/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await api.delete('/users/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const renderWalletBalance = () => {
    if (!isUserLoggedIn) return null;

    // if (localWalletLoading || walletLoading) {
    //   return (
    //     <div className="text-white bg-[#1e1e1e] rounded-lg px-4 py-2">
    //       <Spinner size="small" color="white" />
    //     </div>
    //   );
    // }

    return (
      <div className="text-white bg-[#1e1e1e] rounded-lg px-4 py-2">
        {formatCurrency(walletBalance, localCurrency.code)}
      </div>
    );
  };

  const handleNavItemClick = (component) => {
    if (component === 'Logout') {
      onLogout();
      return;
    }

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

  useEffect(() => {
    const fetchWalletAndCurrency = async () => {
      if (!user?.id) {
        setIsLoading(false);
        setPageLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get user's location-based currency
        const { currency, country } = await getCurrencyByLocation();
        
        // Fetch wallet balance
        const walletResponse = await api.get('/wallet/balance-only');
        const balance = walletResponse.data.balance;
        const userCurrency = walletResponse.data.currency;

        // If currency is not NGN, convert the balance
        if (currency !== 'NGN') {
          const rates = await getExchangeRates('NGN');
          if (rates && rates[currency]) {
            const convertedBalance = balance * rates[currency];
            setWalletBalance(convertedBalance);
          } else {
            setWalletBalance(balance);
          }
        } else {
          setWalletBalance(balance);
        }

        setLocalCurrency({ 
          code: currency,
          country: country 
        });

        // Cache the result
        localStorage.setItem('userCurrency', JSON.stringify({
          code: currency,
          country: country,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error('Error fetching wallet data:', error);
        // Try to get cached currency data
        const cachedCurrency = localStorage.getItem('userCurrency');
        if (cachedCurrency) {
          const parsed = JSON.parse(cachedCurrency);
          setLocalCurrency(parsed);
        } else {
          setLocalCurrency({ code: 'NGN', country: 'Nigeria' });
        }
        setWalletBalance(wallet?.balance || 0);
      } finally {
        setIsLoading(false);
        setPageLoading(false);
      }
    };

    fetchWalletAndCurrency();
  }, [user?.id, wallet?.balance]);

  const onLogout = async () => {
    try {
      setShowDropdown(false); // Close dropdown
      setIsOpen(false); // Close hamburger menu
      
      // Clear all user-related data from localStorage
      localStorage.clear(); // This will clear all localStorage items
      
      // Clear all states
      setWalletBalance(0);
      setNotifications([]);
      setUnreadCount(0);
      setLocalWalletLoading(false);
      setActiveComponent(null);
      
      await handleLogout(); // Call the auth context logout
      
      // Force navigation to login page
      window.location.href = '/login'; // This will cause a full page reload
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to redirect to login
      navigate('/login');
    }
  };

  const navItems = [
    {label: '', component: 'Market' },
    { icon: <FaShoppingBag />, label: 'Marketplace', component: 'Market' },
    { icon: <AiOutlineDollarCircle />, label: 'Free Tips', component: 'Market' },
    { icon: <MdAccountCircle />, label: 'Account', component: 'Account' },
    { icon: <AiFillRobot />, label: 'Tipstar AI', component: 'Tips' },
    { icon: <FaWallet />, label: 'Wallet', component: 'Deposit' },
    { icon: <AiOutlineTransaction />, label: 'Transactions', component: 'Transactions' },
    ...(user ? [{ icon: <FaSignOutAlt />, label: 'Logout', component: 'Logout' }] : []),

    // Add admin item conditionally
    ...(user?.isAdmin ? [{
      icon: <MdAccountCircle />,
      label: 'Admin Marketplace',
      component: 'admin/marketplace'
    }] : [])
  ];

  useEffect(() => {
    document.body.style.overflow = (isMobile && isOpen) || showNotifications ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isMobile, isOpen, showNotifications]);

  // Add polling for wallet balance
  useEffect(() => {
    const pollWalletBalance = async () => {
      if (user?.id) {
        try {
          await refreshWalletBalance();
        } catch (error) {
          console.error('Error polling wallet balance:', error);
        }
      }
    };

    // Initial fetch
    pollWalletBalance();

    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(pollWalletBalance, 10000);

    return () => clearInterval(intervalId);
  }, [user?.id, refreshWalletBalance]);

  // Update local wallet balance when wallet changes
  useEffect(() => {
    if (wallet?.data?.balance !== undefined) {
      setWalletBalance(wallet.data.balance);
      setLocalWalletLoading(false);
    }
  }, [wallet]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      if (!user) {
        const token = localStorage.getItem('token');
        if (token) {
          await refreshUserData();
        } else {
          setLocalWalletLoading(false);
        }
      } else if (!wallet || wallet.data?.balance === undefined) {
        await refreshWalletBalance();
      }
    };

    initializeData();
  }, [user, wallet, refreshUserData, refreshWalletBalance]);

  // Polling for wallet updates
  useEffect(() => {
    if (!user) return;

    const pollInterval = setInterval(async () => {
      try {
        await refreshWalletBalance();
      } catch (error) {
        console.error('Error polling wallet:', error);
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [user, refreshWalletBalance]);

  // Currency conversion
  useEffect(() => {
    const fetchCurrencyAndConvert = async () => {
      if (!user || !wallet?.data?.balance) return;

      try {
        const { currency, country } = await getCurrencyByLocation();
        
        if (currency && currency !== 'NGN') {
          const rates = await getExchangeRates('NGN');
          if (rates && rates[currency]) {
            const convertedBalance = wallet.data.balance * rates[currency];
            setWalletBalance(convertedBalance);
            setLocalCurrency({ code: currency, country });
          }
        } else {
          setWalletBalance(wallet.data.balance);
        }
      } catch (error) {
        console.error('Currency conversion error:', error);
        setWalletBalance(wallet.data.balance);
      }
    };

    fetchCurrencyAndConvert();
  }, [user, wallet?.data?.balance]);

  // Update notification bell section
  const renderNotificationBell = () => {
    if (!isUserLoggedIn) return null;

    return (
      <button 
        className="relative mr-4" 
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <FaBell className="text-white text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    );
  };

  // Update notifications panel
  const renderNotificationsPanel = () => {
    if (!showNotifications) return null;

    return (
      <div className="fixed top-16 right-0 w-80 max-h-[80vh] bg-[#1e1e1e] shadow-lg rounded-l-lg overflow-hidden z-50 font-montserrat">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl text-white font-semibold">Notifications</h2>
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification._id}
                className={`p-4 border-b border-gray-700 hover:bg-[#282828] cursor-pointer
                  ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 
                    ${notification.read ? 'bg-gray-500' : 'bg-blue-500'}`} 
                  />
                  <div>
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-400 text-center">
              No notifications
            </div>
          )}
        </div>
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center z-50">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <>
    <nav className="bg-[#1e1e1e] fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          id="hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-0 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to={user ? '/dashboard' : '/'} className="text-white text-xl font-tomorrow font-bold ml-0">
          <img
            src="/logo.png"
            alt="Cashout Tips Logo"
            className="w-auto h-auto max-w-full max-h-[30vh] object-contain ml-0"
          />
        </Link>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
            {renderNotificationBell()}

            <div className="font-tomorrow mr-4">{renderWalletBalance()}</div>

            <button 
              onClick={() => navigate('/deposit')} 
              className="flex items-center bg-[#fad026] text-black px-2 py-1 sm:px-4 sm:py-2 rounded mr-2 sm:mr-4 font-montserrat text-xs sm:text-sm"
            >
              <FaWallet className="mr-1 sm:mr-2" /> Deposit
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <MdAccountCircle className="text-white text-2xl sm:text-3xl" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-lg py-1 z-50 font-montserrat">
                  <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Withdrawal</a>
                  <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Change Password</a>
                  <a href="/tips" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Subscriptions</a>
                  <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Upload Tips</a>
                  <a href="/transactions" className="block px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]">Transaction History</a>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1f1f1f]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2 font-montserrat">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-[#fad026] text-black px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="border border-[#fad026] text-[#fad026] px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>

    <aside 
      id="sidebar"
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#1e1e1e] flex flex-col items-center pt-4 
        transition-all duration-300 ease-in-out z-40 font-montserrat
        ${isOpen ? 'w-64' : 'w-0 sm:w-16'} 
        overflow-hidden`}
    >
      <div className="w-full px-4">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center w-full py-4 px-3 my-2 text-gray-400 rounded hover:text-white
              transition-colors duration-200
              ${isOpen ? 'bg-[#282828] hover:bg-[#3a3a3a]' : 'hover:bg-[#282828]'}
              ${!isOpen && 'sm:justify-center'}`}
            onClick={() => handleNavItemClick(item.component)}
          >
            <div className={`text-xl flex-shrink-0 ${isOpen ? '' : 'mx-auto'}`}>
              {item.icon}
            </div>
            {isOpen && 
              <span className="ml-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {item.label}
              </span>
            }
          </button>
        ))}
      </div>
    </aside>

    {showNotifications && (
      <div className="fixed top-16 right-0 w-80 max-h-[80vh] bg-[#1e1e1e] shadow-lg rounded-l-lg overflow-hidden z-50 font-montserrat">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl text-white font-semibold">Notifications</h2>
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification._id}
                className={`p-4 border-b border-gray-700 hover:bg-[#282828] cursor-pointer
                  ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 
                    ${notification.read ? 'bg-gray-500' : 'bg-blue-500'}`} 
                  />
                  <div>
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-400 text-center">
              No notifications
            </div>
          )}
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;
