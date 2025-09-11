import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCartPlus } from 'react-icons/fa'; // Importing cart icon
import { useNavigate } from 'react-router-dom'; // For navigation
import Navbar from './Navbar';  // Adjust path if necessary
import Footer from './Footer';  // Adjust path if necessary

const ScanAndXRayPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedScan, setSelectedScan] = useState(null); // Selected scan for modal
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Retrieve staffId from localStorage
  const staffId = localStorage.getItem('staffId');

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get('http://31.97.206.144:4051/api/admin/getallxrays');  // API endpoint to fetch scans and x-rays
        if (response.data && response.data.length > 0) {
          setScans(response.data);  // Set the fetched scans
        } else {
          setError('No scans available');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  const openModal = (scan) => {
    setSelectedScan(scan); // Set the selected scan for the modal
    setIsModalOpen(true);  // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
    setSelectedScan(null);   // Reset selected scan
  };

  const addToCart = async () => {
    if (!staffId) {
      alert('Staff ID not found in localStorage!');
      return;
    }

    try {
      const response = await axios.post(
        `http://31.97.206.144:4051/api/staff/addcart/${staffId}`,
        {
          itemId: selectedScan._id,
          action: 'inc', // 'inc' means add to cart
        }
      );

      if (response.status === 200) {
        alert('Item added to cart successfully!');
        closeModal(); // Close the modal after adding to cart
        navigate('/cart'); // Redirect to cart page after successful addition
      } else {
        alert('Failed to add item to cart');
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      alert('Error adding item to cart');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar here */}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Scans & X-Rays
        </h1>

        {loading && <p className="text-center text-lg text-gray-600">Loading scans...</p>}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <div key={scan._id} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                {/* Image of the scan */}
                <img 
                  src={`http://31.97.206.144:4051${scan.image}`} 
                  alt={scan.title} 
                  className="w-full h-40 object-cover rounded-md mb-4"
                />

                {/* Scan Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{scan.title}</h2>

                {/* Scan Price */}
                <p className="text-lg text-gray-600 mb-2">Price: ₹{scan.price}</p>

                {/* Scan Preparation */}
                <p className="text-sm text-gray-500 mb-4"><strong>Preparation:</strong> {scan.preparation}</p>

                {/* Report Time */}
                <p className="text-sm text-gray-500 mb-4"><strong>Report in:</strong> {scan.reportTime} hours</p>

                {/* Add to Cart Icon */}
                <div className="flex justify-between mt-4">
                  <button 
                    className="text-white bg-[#2E67F6] p-3 rounded-full hover:bg-[#2559cc] transition duration-300"
                    onClick={() => openModal(scan)} // Open modal for adding to cart
                  >
                    <FaCartPlus size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500">No scans available.</p>
          )}
        </div>
      </div>

      {/* Modal for Add to Cart Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add to Cart</h2>
            <p className="text-lg text-gray-600 mb-4">Are you sure you want to add <strong>{selectedScan.title}</strong> to your cart?</p>

            <div className="flex justify-between">
              <button 
                className="text-white bg-gray-600 p-3 rounded-full hover:bg-gray-500 transition duration-300"
                onClick={closeModal} // Close modal
              >
                Cancel
              </button>

              <button 
                className="text-white bg-[#2E67F6] p-3 rounded-full hover:bg-[#2559cc] transition duration-300"
                onClick={addToCart} // Add scan to cart
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default ScanAndXRayPage;
