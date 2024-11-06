import React, { useState } from 'react';
import { FaCreditCard, FaMoneyBillAlt, FaHistory, FaUniversity, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import { submitDepositRequest, submitWithdrawalRequest } from './services/walletOperations';

const WalletComponent = () => {
  const { user, wallet, refreshWalletBalance } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState('deposit');
  const [activePaymentMethod, setActivePaymentMethod] = useState('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const bankAccounts = {
    uba: '1234567890',
    zenithbank: '0987654321'
  };

  const mainTabs = [
    { id: 'deposit', title: 'Deposit', icon: <FaMoneyBillAlt /> },
    { id: 'withdraw', title: 'Withdraw', icon: <FaUniversity /> },
    { id: 'history', title: 'History', icon: <FaHistory /> }
  ];

  const paymentTabs = [
    { id: 'bank', title: 'Bank Transfer', icon: <FaUniversity /> },
    { id: 'ussd', title: 'USSD', icon: <FaMoneyBillAlt /> },
    { id: 'card', title: 'Card', icon: <FaCreditCard /> }
  ];

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!receipt) {
      setError('Please upload a receipt');
      return;
    }

    try {
      setIsLoading(true);
      await submitDepositRequest(user.id, amount, receipt);
      await refreshWalletBalance();
      setAmount('');
      setReceipt(null);
      setSuccessMessage('Deposit request submitted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit deposit request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > wallet.balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      setIsLoading(true);
      await submitWithdrawalRequest(user.id, amount, {
        bankName,
        accountNumber,
        accountName
      });
      await refreshWalletBalance();
      setWithdrawalSubmitted(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDepositContent = () => (
    <div>
      <div className="text-gray-400 mb-4">
        Important: 
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Payment must be made from your personal bank account that matches your registration name on our platform</li>
          <li>We do not accept company name payments</li>
          <li>Third-party payments (including family and friends) are strictly not allowed</li>
          <li>Any payment not matching your registration name will be delayed or rejected</li>
        </ul>
      </div>
      <form onSubmit={handleDeposit}>
        <div className="mb-4">
          <label htmlFor="bank" className="block text-gray-400 mb-2">Select Bank</label>
          <select
            id="bank"
            className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <option value="">Select a bank</option>
            <option value="uba">UBA</option>
            <option value="zenithbank">Zenith Bank</option>
          </select>
        </div>

        {selectedBank && (
          <>
            <div className="mb-4 p-4 bg-[#2a2a2a] rounded-md">
              <p className="text-white mb-1">Account Number: {bankAccounts[selectedBank]}</p>
              <p className="text-white mb-1">Account Name: Cashout Tips</p>
              <p className="text-white">Bank: {selectedBank.toUpperCase()}</p>
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                id="amount"
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="receipt" className="block text-gray-400 mb-2">Upload Receipt</label>
              <input
                type="file"
                id="receipt"
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bankName" className="block text-gray-400 mb-2">Name on Bank Transfer</label>
              <input
                type="text"
                id="bankName"
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-[#ffc107] text-black font-bold px-4 py-2 rounded-md hover:bg-[#e6b000] transition duration-300">
              Submit Deposit
            </button>
          </>
        )}
      </form>
    </div>
  );

  const renderWithdrawContent = () => (
    <div>
      {withdrawalSubmitted ? (
        <div className="bg-green-800/20 border border-green-800 text-white p-4 rounded-md">
          <h3 className="font-bold mb-2">Withdrawal Request Submitted Successfully!</h3>
          <p>Your account will be credited shortly. Please be patient while we process your withdrawal.</p>
          <p className="mt-2 text-sm">Average processing time: 24-48 hours</p>
        </div>
      ) : (
        <form onSubmit={handleWithdraw}>
          <div className="mb-4">
            <label htmlFor="withdrawBank" className="block text-gray-400 mb-2">Bank Name</label>
            <input
              type="text"
              id="withdrawBank"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="accountNumber" className="block text-gray-400 mb-2">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="accountName" className="block text-gray-400 mb-2">Account Name</label>
            <input
              type="text"
              id="accountName"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="withdrawAmount" className="block text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              id="withdrawAmount"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-[#ffc107] text-black font-bold px-4 py-2 rounded-md hover:bg-[#e6b000] transition duration-300">
            Submit Withdrawal
          </button>
        </form>
      )}
    </div>
  );

  const renderHistoryContent = () => (
    <div className="space-y-4">
      {wallet && wallet.transactions && wallet.transactions.map((transaction, index) => (
        <div key={index} className="bg-[#2a2a2a] p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">{transaction.type}</p>
              <p className="text-gray-400 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</p>
            </div>
            <p className={transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1e1e1e]">
      <div className="bg-[#282828] shadow-lg rounded-md p-6 w-full max-w-md">
        <div className="flex items-center mb-6">
          <button className="text-gray-400 hover:text-white mr-4" onClick={() => window.history.back()}>
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-white text-2xl font-bold">Wallet</h2>
        </div>
        <div className="flex mb-6">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-1/3 p-2 rounded-md transition duration-300 ${
                activeMainTab === tab.id
                  ? 'bg-[#ffc107] text-black'
                  : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
              }`}
              onClick={() => setActiveMainTab(tab.id)}
            >
              {tab.icon}
              <span className="mt-1 text-xs">{tab.title}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-gray-600 pt-6">
          {activeMainTab === 'deposit' && renderDepositContent()}
          {activeMainTab === 'withdraw' && renderWithdrawContent()}
          {activeMainTab === 'history' && renderHistoryContent()}
        </div>
      </div>
    </div>
  );
};

export default WalletComponent;