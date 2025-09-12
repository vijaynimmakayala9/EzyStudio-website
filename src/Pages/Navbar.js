import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaWallet, FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId");

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    if (staffId) {
      axios
        .get(`http://31.97.206.144:4051/api/staff/wallet/${staffId}`)
        .then((response) => {
          setWalletBalance(response.data.wallet_balance);
        })
        .catch((error) => {
          console.error("Error fetching wallet data:", error);
        });
    }
  }, [staffId]);

  const closeMenuAndNavigate = (hash) => {
    if (location.pathname !== "/") {
      window.location.href = `/${hash}`;
    } else {
      document
        .getElementById(hash.replace("#", ""))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookingsClick = () => {
    navigate("/mybookings");
  };

  return (
    <header className="bg-white py-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-20">
        {/* ✅ Logo - Left */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 md:w-24 object-contain"
          />
          <h3 className="font-extrabold text-xl md:text-2xl text-gray-900">
            CrendentHealth
          </h3>
        </div>



        {/* ✅ Nav Items - Right */}
        <div className="hidden md:flex space-x-8 items-center text-xl font-sans">
          <a
            href="/"
            className="text-black font-semibold hover:text-gray-200 transition duration-300"
          >
            Home
          </a>
          <button
            onClick={handleBookingsClick}
            className="text-black font-semibold hover:text-gray-200 transition duration-300"
          >
            Bookings
          </button>
          <a
            href="/medicalrecord"
            onClick={() => closeMenuAndNavigate("#medical-records")}
            className="text-black font-semibold hover:text-gray-200 transition duration-300"
          >
            Medical Records
          </a>
          <a
            href="/chat"
            onClick={() => closeMenuAndNavigate("#chats")}
            className="text-black font-semibold hover:text-gray-200 transition duration-300"
          >
            Chats
          </a>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="text-black font-semibold hover:text-gray-200 transition duration-300 flex items-center"
              onClick={toggleProfileMenu}
            >
              Profile
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-48">
                <ul>
                  <li>
                    <a
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Login
                    </a>
                  </li>
                   <li>
                    <a
                      href="/family"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Family
                    </a>
                  </li>
                   <li>
                    <a
                      href="/address"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Address
                    </a>
                  </li>
                   <li>
                    <a
                      href="/notification"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Notification
                    </a>
                  </li>
                  <li>
                    <a
                      href="/logout"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Wallet */}
          <a
            href="/wallet"
            className="text-black font-semibold hover:text-gray-200 transition duration-300 flex items-center"
          >
            <FaWallet size={20} className="mr-2" />
            Wallet
            {walletBalance !== null && (
              <span className="ml-2 text-xs bg-black text-white rounded-full px-2 py-1">
                {walletBalance}
              </span>
            )}
          </a>

          {/* Cart */}
          <a
            href="/cart"
            className="text-black font-semibold hover:text-gray-200 transition duration-300 flex items-center"
          >
            <FaShoppingCart size={20} className="mr-2" /> Cart
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
