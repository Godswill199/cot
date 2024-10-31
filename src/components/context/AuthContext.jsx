import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [investments, setInvestments] = useState([]);


  const fetchWalletBalance = useCallback(async (userId) => {
    if (!userId) return;
    
    console.log('Fetching wallet balance for user:', userId);
    setWalletLoading(true);
    try {
      const response = await api.get(`/wallet/${userId}/balance`);
      console.log('Wallet balance response:', response.data);
      setWallet(prevWallet => ({ ...prevWallet, balance: response.data.balance }));
      setWalletLoading(false);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const [userResponse, walletResponse, notificationsResponse, investmentsResponse] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/wallet/${userId}`),
        api.get(`/notifications/${userId}`),
        api.get(`/investments/${userId}`)
      ]);
      
      if (!userResponse.data) throw new Error('No user data received');
      
      setUser(userResponse.data);
      setWallet(walletResponse.data);
      setNotifications(notificationsResponse.data);
      setInvestments(investmentsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle specific error cases
      if (error.response?.status === 404) {
        // Handle 404 specifically
        console.error('Resource not found');
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
      const token = localStorage.getItem('userAuthToken');
      
      if (token) {
        try {
          console.log('Verifying user token');
          const response = await api.get('/verify');
          console.log('User verified:', response.data.user);
          setUser(response.data.user);
          setIsUserLoggedIn(true);
          await fetchUserData(response.data.user.id);
          await fetchWalletBalance(response.data.user.id); // Fetch wallet balance immediately
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('userAuthToken');
          setUser(null);
          setIsUserLoggedIn(false);
          setWallet(null);
          setNotifications([]);
          setInvestments([]);
        }
      } else {
        console.log('No auth token found');
      }
      
      setLoading(false);
    };
  
    initializeAuth();
  }, [fetchUserData, fetchWalletBalance]);

  

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

  const userLogin = async ({ token, user }) => {
    try {
      localStorage.setItem('userAuthToken', token);
      setUser(user);
      setIsUserLoggedIn(true);
      await fetchUserData(user.id);
      await fetchWalletBalance(user.id);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('userAuthToken');
      setUser(null);
      setIsUserLoggedIn(false);
      setWallet(null);
      setNotifications([]);
      setInvestments([]);
    }
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