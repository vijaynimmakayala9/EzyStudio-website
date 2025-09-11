import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  // Get staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    if (staffId) {
      setLoading(true); 
      axios
        .get(`http://31.97.206.144:4051/api/staff/mycart/${staffId}`)
        .then((response) => {
          if (response.data.items && response.data.items.length > 0) {
            setCartItems(response.data.items);
            setGrandTotal(response.data.grandTotal);
          } else {
            setCartItems([]);
            setGrandTotal(0);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching cart data");
          setLoading(false); 
        });
    } else {
      setError("No staffId found in localStorage");
      setLoading(false);
    }
  }, [staffId]);

  // Navigate to Diagnostics Page on Checkout
  const handleRedirect = () => {
    navigate("/diagnostics"); // Redirect to diagnostics page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-100 py-10">
        <div className="bg-white p-8 rounded-lg w-96 mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Cart</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {cartItems.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center">
              <div className="empty-cart-container">
                <img
                  src="https://img.freepik.com/premium-vector/shopping-cart-with-cross-mark-wireless-paymant-icon-shopping-bag-failure-paymant-sign-online-shopping-vector_662353-912.jpg"
                  alt="Empty Cart"
                  className="w-48 h-48"
                />
                <p className="text-xl text-gray-600 mt-4">Your cart is empty!</p>
              </div>
              <button
                onClick={handleRedirect}
                className="mt-4 p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
              >
                Go to Home
              </button>
            </div>
          )}
          {cartItems.length > 0 && (
            <div>
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">Fasting Required: {item.fastingRequired ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600">Home Collection: {item.homeCollectionAvailable ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-800">₹{item.totalPayable}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between items-center font-semibold text-lg">
                <p>Total</p>
                <p>₹{grandTotal}</p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleRedirect} // Navigate to diagnostics page
                  className="p-3 bg-[#2E67F6] text-white font-semibold rounded-md hover:bg-[#2559cc] transition duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
