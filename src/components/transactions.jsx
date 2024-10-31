// components/TransactionTable.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';

const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState('Deposit');
  const [showAll, setShowAll] = useState(false);

  // Sample transaction data
  const transactions = {
    Deposit: [
      { time: '3/08 18:00', action: 'Deposit', tradeNo: '240826094631tr446570527', amount: 5.00, status: 'Succeed', balance: 5.00 },
      { time: '3/08 18:05', action: 'Deposit', tradeNo: '240826094631tr446570528', amount: 10.00, status: 'Succeed', balance: 15.00 },
      { time: '3/08 18:10', action: 'Deposit', tradeNo: '240826094631tr446570529', amount: 7.50, status: 'Failed', balance: 7.50 },
      { time: '3/08 18:15', action: 'Deposit', tradeNo: '240826094631tr446570530', amount: 20.00, status: 'Succeed', balance: 27.50 },
      { time: '3/08 18:20', action: 'Deposit', tradeNo: '240826094631tr446570531', amount: 5.00, status: 'Succeed', balance: 32.50 },
      { time: '3/08 18:25', action: 'Deposit', tradeNo: '240826094631tr446570532', amount: 3.00, status: 'Pending', balance: 35.50 },
      { time: '3/08 18:30', action: 'Deposit', tradeNo: '240826094631tr446570533', amount: 12.00, status: 'Succeed', balance: 47.50 },
      { time: '3/08 18:35', action: 'Deposit', tradeNo: '240826094631tr446570534', amount: 15.00, status: 'Failed', balance: 32.50 },
      { time: '3/08 18:40', action: 'Deposit', tradeNo: '240826094631tr446570535', amount: 8.50, status: 'Succeed', balance: 41.00 },
      { time: '3/08 18:45', action: 'Deposit', tradeNo: '240826094631tr446570536', amount: 10.00, status: 'Succeed', balance: 51.00 },
    ],
    Withdraw: [
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      { time: '3/08 19:00', action: 'Withdraw', tradeNo: '240826094631tr446570537', amount: 5.00, status: 'Pending', balance: 46.00 },
      // additional transactions up to 10 for Withdraw
    ],
    Subscription: [
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      { time: '3/08 18:30', action: 'Subscription', tradeNo: '240826094631tr446570540', amount: 10.00, status: 'Active', balance: 41.00 },
      // additional transactions up to 10 for Subscription
    ]
  };

  const handleShowMore = () => setShowAll(!showAll);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f]">
      <Navbar />
      <div className="bg-[#282828] w-full max-w-[90%] md:max-w-[50%] p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4 text-center">Transactions</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {['Deposit', 'Withdraw', 'Subscription'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                activeTab === tab ? 'bg-[#282828] shadow-lg' : 'bg-[#1f1f1f]'
              } hover:bg-[#282828]`}
              onClick={() => {
                setActiveTab(tab);
                setShowAll(false); // reset showAll when switching tabs
              }}
            >
              {tab}
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
                <tr key={index}>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">{transaction.time}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-blue-400">{transaction.action}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">{transaction.tradeNo}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">${transaction.amount.toFixed(2)}</td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828]">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        transaction.status === 'Succeed' ? 'bg-green-500 text-black' :
                        transaction.status === 'Pending' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-black'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 bg-[#282828] text-gray-300">${transaction.balance.toFixed(2)}</td>
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
