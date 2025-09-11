import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorCategoryPage = () => {
  const { category, type } = useParams(); // Get category and type from URL
  const [doctorCategoryData, setDoctorCategoryData] = useState([]);
  const [specialCategoryData, setSpecialCategoryData] = useState([]);
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch doctor category data
  useEffect(() => {
    axios
      .get("http://31.97.206.144:4051/api/admin/getallcategory")
      .then((response) => {
        setDoctorCategoryData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctor categories:", error);
        setLoading(false);
      });
  }, [category, type]);

  // Fetch special category data
  useEffect(() => {
    axios
      .get("http://31.97.206.144:4051/api/admin/getspecialcategory")
      .then((response) => {
        setSpecialCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching special categories:", error);
      });
  }, []);

  // Handle special category selection
  const handleSpecialCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSpecialCategories((prev) =>
      prev.includes(selectedValue)
        ? prev.filter((item) => item !== selectedValue)
        : [...prev, selectedValue]
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/categories"); // Redirect back to categories page
  };

  // Handle submit of selected special categories
  const handleSubmit = () => {
    if (selectedSpecialCategories.length === 0) {
      alert("Please select at least one special category.");
    } else {
      alert(`Selected Special Categories: ${selectedSpecialCategories.join(", ")}`);
      // You can perform additional actions here (e.g., submit to backend)
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/doctor-list/${categoryName}`); // Navigate to the doctor list page for this category
  };

  // Display loading or error state
  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {category} - {type === "visit-clinic" ? "Visit Clinic" : "Virtual Consultation"}
      </h1>

      {/* Display doctor category data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {doctorCategoryData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => handleCategoryClick(item.name)} // Navigate on category click
          >
            <div className="bg-blue-500 text-white p-6 flex justify-center items-center">
              <img
                src={`http://31.97.206.144:4051${item.image}`}
                alt={item.name}
                className="w-32 h-32 object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Special Categories Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Special Categories</h2>
        <div className="space-y-4">
          {specialCategoryData.map((specialCategory, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                value={specialCategory.name}
                onChange={handleSpecialCategoryChange}
                className="mr-2"
              />
              <label className="text-lg text-gray-800">{specialCategory.name}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {selectedSpecialCategories.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
            >
              Submit Selected Special Categories
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleBack}
          className="p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Back to Services
        </button>
      </div>
    </div>
  );
};

export default DoctorCategoryPage;
