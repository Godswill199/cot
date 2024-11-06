import api from '../utils/axiosConfig';

export const submitDepositRequest = async (userId, amount, receiptImage) => {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('amount', amount);
    formData.append('receipt', receiptImage);

    const response = await api.post('/wallet/deposit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting deposit request:', error);
    throw error;
  }
};

export const submitWithdrawalRequest = async (userId, amount, bankDetails) => {
  try {
    const response = await api.post('/wallet/withdraw', {
      userId,
      amount,
      bankDetails
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
    throw error;
  }
};

export const getWalletBalance = async (userId) => {
  try {
    const response = await api.get(`/wallet/${userId}/balance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const getTransactionHistory = async (userId) => {
  try {
    const response = await api.get(`/wallet/${userId}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};