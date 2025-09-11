import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCartPlus } from 'react-icons/fa'; // Cart Icon (but you won't be using it for cart, only for booking)
import Navbar from './Navbar';  // Adjust path if necessary
import Footer from './Footer';  // Adjust path if necessary
import { useNavigate } from 'react-router-dom'; // For navigation

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const staffId = localStorage.getItem('staffId'); // Get staffId from localStorage
    if (!staffId) {
      setError('Staff ID not found');
      setLoading(false);
      return;
    }

    const fetchPackages = async () => {
      try {
        const response = await axios.get(`http://31.97.206.144:4051/api/staff/stafftestpackages/${staffId}`); // API to fetch staff-specific packages
        if (response.data.message === "✅ Packages fetched successfully.") {
          setPackages(response.data.myPackages); // Set the fetched packages
        } else {
          setError('Failed to fetch packages');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Function to handle booking of a package
  const handleBooking = (pkg) => {
    // Navigate to Diagnostic Center Page with package data as state
    navigate('/diagnostics', {
      state: { packageId: pkg.packageId, packageName: pkg.packageName, price: pkg.price }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar here */}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Packages</h1>

        {/* Loading and Error Messages */}
        {loading && <p className="text-center text-lg text-gray-600">Loading packages...</p>}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        {/* Package Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg._id} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                {/* Package Name */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{pkg.packageName}</h2>

                {/* Package Price */}
                <p className="text-lg text-gray-600 mb-2">Price: ₹{pkg.price}</p>

                {/* Total Tests Included */}
                <p className="text-sm text-gray-500 mb-2">Total Tests: {pkg.totalTestsIncluded}</p>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>

                {/* Precautions */}
                <p className="text-sm text-gray-500 mb-4"><strong>Precautions:</strong> {pkg.precautions}</p>

                {/* Included Tests */}
                <div className="mb-4">
                  <strong>Included Tests:</strong>
                  <ul className="list-disc pl-5 text-sm text-gray-500">
                    {pkg.includedTests.map((subTest, index) => (
                      <li key={index}>
                        {subTest.name} - {subTest.subTestCount} subtests
                        <ul className="list-disc pl-5">
                          {subTest.subTests.map((subTestName, subIndex) => (
                            <li key={subIndex}>{subTestName}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Button */}
                <div className="flex justify-between mt-4">
                  <button 
                    className="text-white bg-[#2E67F6] p-3 rounded-full hover:bg-[#2559cc] transition duration-300"
                    onClick={() => handleBooking(pkg)} // Handle direct booking
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500">No packages available.</p>
          )}
        </div>
      </div>

      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default PackagesPage;
