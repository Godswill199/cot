// components/TransactionTable.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import api from './utils/axiosConfig';
import { useAuth } from './context/AuthContext';
import { formatCurrency } from '../utils/currencyUtils';

const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState('Deposit');
  const [showAll, setShowAll] = useState(false);
  const [transactions, setTransactions] = useState({
    Deposit: [],
    Withdraw: [],
    Subscription: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, localCurrency } = useAuth();

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/transactions/history');
        
        // Group transactions by type
        const grouped = response.data.reduce((acc, transaction) => {
          const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
          if (!acc[type]) acc[type] = [];
          acc[type].push({
            time: new Date(transaction.createdAt).toLocaleString(),
            action: type,
            tradeNo: transaction.transactionId,
            amount: transaction.amount,
            status: transaction.status,
            balance: transaction.balanceAfter
          });
          return acc;
        }, {
          Deposit: [],
          Withdraw: [],
          Subscription: []
        });

        setTransactions(grouped);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id]);

  const handleShowMore = () => setShowAll(!showAll);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f]">
  //       <div className="text-white">Loading transactions...</div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f]">
      <Navbar />
      <div className="bg-[#282828] w-full max-w-[90%] md:max-w-[50%] p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4 text-center">Transactions</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {Object.keys(transactions).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                activeTab === tab ? 'bg-[#282828] shadow-lg' : 'bg-[#1f1f1f]'
              } hover:bg-[#282828]`}
              onClick={() => {
                setActiveTab(tab);
                setShowAll(false);
              }}
            >
              {tab} ({transactions[tab].length})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-xs md:text-sm text-white">
            <thead>
              <tr>
                {['Time', 'Action', 'Trade no.', 'Amount', 'Status', 'Balance'].map((heading) => (
                  <th key={heading} className="px-2 md:px-4 py-3 bg-[#1f1f1f] text-xs">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(showAll ? transactions[activeTab] : transactions[activeTab].slice(0, 5)).map((transaction, index) => (
                <tr key={transaction.tradeNo || index}>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">{transaction.time}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-blue-400">{transaction.action}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">{transaction.tradeNo}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">
                    {formatCurrency(transaction.amount, localCurrency?.code || 'NGN')}
                  </td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828]">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        transaction.status === 'success' ? 'bg-green-500 text-black' :
                        transaction.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-black'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">
                    {formatCurrency(transaction.balance, localCurrency?.code || 'NGN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More Button */}
        <div className="text-center mt-6">
          {transactions[activeTab].length > 5 && (
            <button 
              onClick={handleShowMore}
              className="px-4 md:px-6 py-2 md:py-3 bg-[#1f1f1f] text-white rounded-lg hover:bg-[#282828] transition-colors text-xs md:text-sm"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
