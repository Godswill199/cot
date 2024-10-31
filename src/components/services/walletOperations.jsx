import api from '../utils/axiosConfig';

export const submitDepositRequest = async (userId, amount, receiptImage) => {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('amount', amount);
    formData.append('receipt', receiptImage);

    const token = localStorage.getItem('userAuthToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const response = await api.post('/deposit', formData, { headers });

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
      bankName: bankDetails.bankName,
      accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName,
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
    throw error;
  }
};