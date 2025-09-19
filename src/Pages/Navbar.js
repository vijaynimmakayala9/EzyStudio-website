import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoCartOutline,
  IoMenuOutline,
  IoAddOutline,
} from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";
import axios from "axios";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId");

  // Fetch Wallet Balance
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

  // Fetch Cart Count
  useEffect(() => {
    if (staffId) {
      axios
        .get(`http://31.97.206.144:4051/api/staff/mycart/${staffId}`)
        .then((response) => {
          if (response.data && response.data.items) {
            setCartCount(response.data.items.length); // Set items length
          }
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [staffId]);

  // Reusable Icon Wrapper
  const IconWrapper = ({ children }) => (
    <div className="bg-white shadow-md rounded-full p-2 flex items-center justify-center relative">
      {children}
    </div>
  );

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/home" className="flex items-center gap-2 no-underline">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
              <h3 className="font-bold text-xl text-gray-900">EDITEZY</h3>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Desktop Nav */}
            <div className="hidden lg:flex gap-6 text-gray-700 text-sm font-medium">
              <button onClick={() => navigate("/home")} className="flex items-center gap-1">
                <IoHomeOutline size={20} /> Home
              </button>
              <button onClick={() => navigate("/category")} className="flex items-center gap-1">
                <IoMenuOutline size={20} /> Category
              </button>
              <button onClick={() => navigate("/horoscope")} className="flex items-center gap-1">
                <IoAddOutline size={20} /> Horoscope
              </button>
              <button onClick={() => navigate("/create")} className="flex items-center gap-1">
                <IoAddOutline size={20} /> Create
              </button>
              <button onClick={() => navigate("/customers")} className="flex items-center gap-1">
                <IoPersonOutline size={20} /> Customers
              </button>
            </div>

            {/* Wallet */}
            {walletBalance !== null && (
              <div className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded">
                <IoWalletOutline size={20} />
                <span className="text-sm font-medium">₹{walletBalance}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t z-50">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button onClick={() => navigate("/home")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoHomeOutline size={22} />
            </IconWrapper>
            Home
          </button>

          {/* Category */}
          <button onClick={() => navigate("/categories")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoMenuOutline size={22} />
            </IconWrapper>
            Category
          </button>

          {/* Horoscope */}
          <button onClick={() => navigate("/horoscope")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoAddOutline size={22} />
            </IconWrapper>
            Horoscope
          </button>

          {/* Create */}
          <button onClick={() => navigate("/create")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoAddOutline size={22} />
            </IconWrapper>
            Create
          </button>

          {/* Customers */}
          <button onClick={() => navigate("/customer")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoPersonOutline size={22} />
            </IconWrapper>
            Customers
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
