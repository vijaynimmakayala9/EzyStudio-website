import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaFlask, FaClipboardList } from "react-icons/fa";

const categories = [
  {
    name: "Doctor Consultation",
    icon: <FaStethoscope size={40} />,
  },
  {
    name: "Lab Test & Packages",
    icon: <FaFlask size={40} />,
  },
  {
    name: "HRA",
    icon: <FaClipboardList size={40} />,
  },
];

const CategoriesPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Function to handle when a category is clicked
  const handleCategoryClick = (categoryName) => {
    if (categoryName === "Doctor Consultation") {
      setSelectedCategory(categoryName);
      setShowPopup(true); // Show the popup for Doctor Consultation
    } else if (categoryName === "Lab Test & Packages") {
      // Navigate to Lab Category page directly for Lab Test & Packages
      navigate("/lab-category");
    }
  };

  // Function to handle closing the popup
  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // Function to navigate to the Doctor Category Page
  const handleNavigateToDoctorCategory = (type) => {
    // Navigate to the Doctor Category Page with the selected type
    navigate(`/doctor-category/${selectedCategory}/${type}`);
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => handleCategoryClick(category.name)} // Show popup when Doctor Consultation is clicked
          >
            <div className="bg-blue-500 text-white p-6 flex justify-center items-center">
              {category.icon}
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Show Popup if category is Doctor Consultation */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handlePopupClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing popup when clicking inside it
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Choose Consultation Type
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => handleNavigateToDoctorCategory("visit-clinic")}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Visit Clinic
              </button>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleNavigateToDoctorCategory("virtual-consultation")}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Virtual Consultation
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handlePopupClose}
                className="text-blue-500 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
