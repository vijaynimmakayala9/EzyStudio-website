import React, { useEffect, useState } from "react";

const ReferAndPay = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://194.164.148.244:4061/api/users/wallet/${userId}`);
      const data = await response.json();
      setWalletBalance(data.wallet);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Fetch referral code
  const fetchReferralCode = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://194.164.148.244:4061/api/users/refferalcode/${userId}`);
      const data = await response.json();
      setReferralCode(data.referralCode);
    } catch (error) {
      console.error("Error fetching referral code:", error);
    }
  };

  // Copy referral code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied!");
  };

  // Share referral code (assuming a basic share link functionality)
  const handleShare = () => {
    const referralLink = `https://your-app.com/referral/${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join our platform!',
        text: `Use my referral code: ${referralCode} to get benefits.`,
        url: referralLink,
      });
    } else {
      alert(`Share this link: ${referralLink}`);
    }
  };

  // Redeem request
  const handleRedeem = async () => {
    const { accountHolderName, accountNumber, ifscCode, bankName } = bankDetails;
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      alert("Please fill in all the details.");
      return;
    }

    try {
      const response = await fetch(`http://194.164.148.244:4061/api/redeem/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountHolderName,
          accountNumber,
          ifscCode,
          bankName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Redeem successful!");
        setIsModalOpen(false); // Close the modal after successful redemption
      } else {
        alert("Error during redemption. Please try again.");
      }
    } catch (error) {
      console.error("Error during redeem:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Call APIs to fetch wallet and referral data
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchWalletBalance();
      fetchReferralCode();
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md w-80">
      {/* Wallet Balance Section */}
      <div className="bg-white p-4 rounded-lg text-center mb-6">
        <h3 className="text-xl font-semibold">Wallet Balance: ₹{walletBalance}</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          Redeem Now
        </button>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white p-4 rounded-lg text-center">
        <h4 className="text-lg font-semibold">Your Referral Code:</h4>
        <p className="text-2xl font-bold text-indigo-600">{referralCode}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Copy Referral Code
          </button>
          <button
            onClick={handleShare}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
          >
            Share Referral Code
          </button>
        </div>
      </div>

      {/* Redeem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Redeem Now</h3>
            <div className="mb-4">
              <label htmlFor="accountHolderName" className="block font-medium">Account Holder Name</label>
              <input
                type="text"
                id="accountHolderName"
                className="mt-1 p-2 border rounded-lg w-full"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="accountNumber" className="block font-medium">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                className="mt-1 p-2 border rounded-lg w-full"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ifscCode" className="block font-medium">IFSC Code</label>
              <input
                type="text"
                id="ifscCode"
                className="mt-1 p-2 border rounded-lg w-full"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bankName" className="block font-medium">Bank Name</label>
              <input
                type="text"
                id="bankName"
                className="mt-1 p-2 border rounded-lg w-full"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                className="bg-green-500 text-white py-2 px-6 rounded-lg"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferAndPay;
