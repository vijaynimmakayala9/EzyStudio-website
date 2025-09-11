import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import { FaPhoneAlt, FaWallet, FaShoppingCart } from "react-icons/fa"; // Added wallet and cart icons
import axios from "axios"; // For making API requests

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // For toggling profile dropdown
  const [walletBalance, setWalletBalance] = useState(null); // Store wallet balance
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Get staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  // Define toggleProfileMenu to toggle profile dropdown visibility
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen); // Toggle profile dropdown menu
  };

  // Fetch wallet data when staffId is available
  useEffect(() => {
    console.log("Fetched staffId:", staffId); // Debugging line

    if (staffId) {
      // Make API request to get wallet information
      axios
        .get(`http://31.97.206.144:4051/api/staff/wallet/${staffId}`)
        .then((response) => {
          console.log("Wallet data fetched:", response.data); // Debugging line
          setWalletBalance(response.data.wallet_balance); // Store wallet balance from response
        })
        .catch((error) => {
          console.error("Error fetching wallet data:", error);
        });
    } else {
      console.log("No staffId found in localStorage");
    }
  }, [staffId]);

  const closeMenuAndNavigate = (hash) => {
    if (location.pathname !== "/") {
      window.location.href = `/${hash}`;
    } else {
      document.getElementById(hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Navigate to MyBookings page when Bookings link is clicked
  const handleBookingsClick = () => {
    navigate("/mybookings"); // Navigate to the 'mybookings' page
  };

  return (
    <div>
      {/* Navbar Header with Custom Blue Background */}
      <header className="bg-gradient-to-r from-[#2E67F6] to-[#2E67F6] py-3 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-20">
          {/* Logo - Left aligned */}
          <div className="flex items-center">
            <img src="https://via.placeholder.com/150" alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          {/* Desktop navigation - Centered */}
          <div className="hidden md:flex space-x-8 items-center text-xl font-sans flex-1 justify-center">
            <a href="/" className="text-white font-semibold hover:text-[#2E67F6] transition duration-300">Home</a>
            <a
              href="#bookings"
              onClick={handleBookingsClick} // Use the handleBookingsClick function to navigate
              className="text-white font-semibold hover:text-[#2E67F6] transition duration-300"
            >
              Bookings
            </a>
            <a href="#medical-records" onClick={() => closeMenuAndNavigate("#medical-records")} className="text-white font-semibold hover:text-[#2E67F6] transition duration-300">Medical Records</a>
            <a href="#chats" onClick={() => closeMenuAndNavigate("#chats")} className="text-white font-semibold hover:text-[#2E67F6] transition duration-300">Chats</a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="text-white font-semibold hover:text-[#2E67F6] transition duration-300 flex items-center"
                onClick={toggleProfileMenu} // Here we're calling the function to toggle profile menu
              >
                Profile
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-48">
                  <ul>
                    <li>
                      <a href="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="/logout" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Wallet Link */}
            <a href="/wallet" className="text-white font-semibold hover:text-[#2E67F6] transition duration-300 flex items-center">
              <FaWallet size={20} className="mr-2" />
              Wallet
              {walletBalance !== null && (
                <span className="ml-2 text-xs bg-gray-800 text-white rounded-full px-2 py-1">{walletBalance}</span>
              )}
            </a>

            {/* Cart Link */}
            <a href="/cart" className="text-white font-semibold hover:text-[#2E67F6] transition duration-300 flex items-center">
              <FaShoppingCart size={20} className="mr-2" /> Cart
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
