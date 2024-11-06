import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [investments, setInvestments] = useState([]);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem('userAuthToken');
    if (!token) {
      setUser(null);
      setIsUserLoggedIn(false);
      return false;
    }
    return true;
  }, []);

  const fetchWalletBalance = useCallback(async (userId) => {
    if (!userId) return;
    
    setWalletLoading(true);
    try {
      const response = await api.get(`/api/wallet/${userId}/balance`);
      const newWallet = {
        balance: response.data.balance,
        lastUpdated: new Date().getTime()
      };
      setWallet(newWallet);
      localStorage.setItem('userWallet', JSON.stringify(newWallet));
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      const cachedWallet = localStorage.getItem('userWallet');
      if (cachedWallet) {
        setWallet(JSON.parse(cachedWallet));
      }
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const [userResponse, walletResponse, notificationsResponse] = await Promise.all([
        api.get(`/api/users/${userId}`),
        api.get(`/api/wallet/${userId}/balance`),
        api.get(`/api/notifications/${userId}`)
      ]);
      
      if (!userResponse.data) throw new Error('No user data received');
      
      setUser(userResponse.data);
      setWallet(walletResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      const cachedWallet = localStorage.getItem('userWallet');
      if (cachedWallet) {
        setWallet(JSON.parse(cachedWallet));
      }
    }
  }, []);

  

  const refreshUserData = useCallback(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  const refreshWalletBalance = useCallback(() => {
    if (user?.id) {
      fetchWalletBalance(user.id);
    }
  }, [user, fetchWalletBalance]);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      if (!checkToken()) {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('userAuthToken');
      const cachedWallet = localStorage.getItem('userWallet');
      
      if (token) {
        try {
          const response = await api.get('/verify');
          setUser(response.data.user);
          setIsUserLoggedIn(true);
          
          if (cachedWallet) {
            const parsedWallet = JSON.parse(cachedWallet);
            setWallet(parsedWallet);
          }
          
          await fetchWalletBalance(response.data.user.id);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('userAuthToken');
          localStorage.removeItem('userWallet');
          setUser(null);
          setIsUserLoggedIn(false);
          setWallet(null);
        }
      }
      
      setLoading(false);
    };
  
    initializeAuth();
  }, [checkToken]);

  

  useEffect(() => {
    if (user?.id) {
      console.log('User is set, fetching initial wallet balance');
      fetchWalletBalance(user.id);
      const interval = setInterval(() => {
        console.log('Polling wallet balance');
        fetchWalletBalance(user.id);
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, fetchWalletBalance]);

  useEffect(() => {
    const persistedWallet = localStorage.getItem('userWallet');
    if (persistedWallet) {
      const parsedWallet = JSON.parse(persistedWallet);
      if (new Date().getTime() - parsedWallet.lastUpdated < 300000) {
        setWallet(parsedWallet);
        setWalletLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      localStorage.setItem('userWallet', JSON.stringify(wallet));
    }
  }, [wallet]);

  const userLogin = async (data) => {
    try {
      const { token, user } = data;
      if (!token || !user) {
        throw new Error('Invalid login data');
      }

      localStorage.setItem('userAuthToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsUserLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const adminLogin = async (data) => {
    try {
      if (!data || !data.token || !data.user) {
        console.error('Invalid login data received:', data);
        return { success: false, error: 'Invalid login data' };
      }
  
      const { token, user } = data;
      
      if (!user.isAdmin) {
        console.error('User is not an admin:', user);
        return { success: false, error: 'Not authorized as admin' };
      }
  
      // Store token and user data
      localStorage.setItem('userAuthToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setUser(user);
      setIsUserLoggedIn(true);
      
      console.log('Admin login successful:', { user });
      
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      // Clean up any partial data
      localStorage.removeItem('userAuthToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsUserLoggedIn(false);
      return { success: false, error };
    }
  };

  const logout = () => {
    localStorage.removeItem('userAuthToken');
    localStorage.removeItem('userWallet');
    setUser(null);
    setIsUserLoggedIn(false);
    setWallet(null);
    setWalletLoading(false);
  };



  const checkUserPremium = useCallback(() => {
    return user?.isPremium || false;
  }, [user]);

  const purchasePremium = useCallback(async () => {
    try {
      const response = await api.post('/users/purchase-premium');
      setUser(prevUser => ({ ...prevUser, isPremium: true }));
      return response.data;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      throw error;
    }
  }, []);

  const contextValue = {
    user,
    isUserLoggedIn,
    userLogin,
    adminLogin,
    logout,
    loading,
    wallet,
    notifications,
    investments,
    refreshUserData,
    refreshWalletBalance,
    walletLoading,
    checkUserPremium,
    purchasePremium
  };

  console.log('AuthContext state:', contextValue);

   return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};