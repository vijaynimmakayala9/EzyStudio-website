import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To navigate to the new page
import axios from "axios";

const HraPage = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [hraData, setHraData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendMessage, setBackendMessage] = useState(""); // Store backend message

  // Base URL for images
  const BASE_URL = "http://31.97.206.144:4051";

  // Fetch staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  // Hook for navigating to HRA Questions page
  const navigate = useNavigate();

  useEffect(() => {
    if (staffId) {
      setLoading(true);
      axios
        .get(`http://31.97.206.144:4051/api/staff/allhracat/${staffId}`)
        .then((response) => {
          if (response.data.message) {
            setBackendMessage(response.data.message); // Set the backend message
          }
          if (response.data.hras && response.data.hras.length > 0) {
            setHraData(response.data.hras); // Store the fetched HRA data
          } else {
            setHraData([]); // Set an empty array if no HRA data
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching HRA data");
          setLoading(false);
        });
    } else {
      setError("Staff ID not found.");
      setLoading(false);
    }
  }, [staffId]);

  const handleStart = () => {
    setShowMessage(false); // Hide the initial message and show HRA data
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate to the new page that will show questions based on the category
    navigate(`/hra-questions?category=${categoryName}`);
  };

  const renderHraData = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // If there are HRAs, display them
    if (hraData && hraData.length > 0) {
      return (
        <div className="mt-6 space-y-4">
          {hraData.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-100 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick(item.hraName)} // Handle click event
            >
              {/* Image on the left side */}
              <img
                src={BASE_URL + item.hraImage} // Prepend base URL to image path
                alt={item.hraName}
                className="w-20 h-20 object-cover rounded-full mr-4" // Circle image with margin to the right
              />
              {/* HRA Name beside the image */}
              <p className="text-lg font-semibold text-blue-600">{item.hraName}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return <p>No health risk data available.</p>;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {showMessage ? (
        <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Know Your Health Risk</h2>
          <p className="text-gray-700 mb-4">
            <strong className="text-blue-600">What's This?</strong>
            <br />
            A quick, evidence-based questionnaire that spots potential health risks and gives you an instant overview of your current health risk.
          </p>
          <p className="text-gray-700 mb-4">
            <strong className="text-blue-600">Why Take It?</strong>
            <br />
            - Insight in 5 minutes - snapshot of your current health risk.
            <br />
            - Preventive focus - catch early warning signs before they develop.
            <br />
            - Actionable tips- simple next steps you can start today.
          </p>
          <p className="text-gray-700 mb-4">
            Note: This is not a medical diagnosis and is for educational purposes only. Your answers stay private and will be used for analysis to get you a score.
          </p>

          {/* Display backend message */}
          {backendMessage && (
            <p className="text-green-500 text-center font-semibold">{backendMessage}</p>
          )}

          <button
            onClick={handleStart}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          >
            OK, Let's Start
          </button>
        </div>
      ) : (
        renderHraData()
      )}
    </div>
  );
};

export default HraPage;
