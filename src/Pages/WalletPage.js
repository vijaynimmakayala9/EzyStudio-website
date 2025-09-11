import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCreditCard, FaHistory, FaMoneyBillWave } from 'react-icons/fa'; // Icons for wallet
import Navbar from './Navbar';  // Adjust path if necessary
import Footer from './Footer';  // Adjust path if necessary

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get staffId from localStorage
  const staffId = localStorage.getItem('staffId');

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!staffId) {
        setError('Staff ID not found!');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://31.97.206.144:4051/api/staff/wallet/${staffId}`);
        if (response.data) {
          setWalletData(response.data);
        } else {
          setError('No wallet data found');
        }
      } catch (err) {
        setError('Error fetching wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [staffId]);

  if (loading) return <div className="text-center text-lg text-gray-600">Loading wallet data...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar here */}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Wallet</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaCreditCard size={30} className="text-[#2E67F6]" />
              <span className="ml-3 text-xl font-semibold">Wallet Balance</span>
            </div>
            <span className="text-2xl font-bold">₹{walletData.wallet_balance}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaMoneyBillWave size={30} className="text-[#28a745]" />
              <span className="ml-3 text-xl font-semibold">Total Credit</span>
            </div>
            <span className="text-xl">₹{walletData.total_credit}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaMoneyBillWave size={30} className="text-[#dc3545]" />
              <span className="ml-3 text-xl font-semibold">Total Debit</span>
            </div>
            <span className="text-xl">₹{walletData.total_debit}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaHistory size={30} className="text-[#ffc107]" />
              <span className="ml-3 text-xl font-semibold">Total Amount</span>
            </div>
            <span className="text-xl">₹{walletData.totalAmount}</span>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>

          {walletData.transaction_history.length > 0 ? (
            walletData.transaction_history.map((transaction, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-semibold">{transaction.from}</span>
                  <span className={`text-lg ${transaction.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.type === 'debit' ? '-' : '+'} ₹{transaction.totalAmount}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span><strong>To:</strong> {transaction.to || '-'}</span>
                </div>

                <div className="text-sm text-gray-500">
                  <span><strong>For Tests:</strong> ₹{transaction.forTests}</span><br />
                  <span><strong>For Doctors:</strong> ₹{transaction.forDoctors}</span><br />
                  <span><strong>For Packages:</strong> ₹{transaction.forPackages}</span>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  <span>{transaction.time_ago}</span><br />
                  <span><strong>Description:</strong> {transaction.description}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500">No transactions available.</p>
          )}
        </div>
      </div>

      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default WalletPage;
