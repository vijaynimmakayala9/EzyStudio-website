import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Doctor Consultation",
    image:
      "/category/doc.png", // replace with your doctor image
  },
  {
    name: "Lab Test & Packages",
    image:
      "/category/lab.png", // replace with your lab test image
  },
  {
    name: "HRA",
    image:
      "/category/hra.png", // replace with your HRA image
  },
];

const CategoriesPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "Doctor Consultation") {
      setSelectedCategory(categoryName);
      setShowPopup(true);
    } else if (categoryName === "Lab Test & Packages") {
      navigate("/lab-category");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleNavigateToDoctorCategory = (type) => {
    navigate(`/doctor-category/${selectedCategory}/${type}`);
    setShowPopup(false);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="bg-white p-6 flex justify-center items-center">
              <img
                src={category.image}
                alt={category.name}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handlePopupClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Choose Consultation Type
            </h3>

            <div className="space-y-4">
              {/* Visit Clinic Card */}
              <div
                onClick={() => handleNavigateToDoctorCategory("visit-clinic")}
                className="flex items-center justify-between p-4 border border-2 rounded-lg bg-light hover:shadow-lg cursor-pointer transition duration-300"
              >
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 flex-shrink-0">
                    <img
                      src="/images/clinic.png"
                      alt="Visit Clinic"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Visit Clinic</h4>
                    <p className="text-gray-600 text-sm">
                      Meet the doctor in person at the clinic.
                    </p>
                  </div>
                </div>
                {/* Right arrow */}
                <i className="fa-solid fa-chevron-right text-black"></i>
              </div>

              {/* Virtual Consultation Card */}
              <div
                onClick={() => handleNavigateToDoctorCategory("virtual-consultation")}
                className="flex items-center justify-between p-4 border border-2 rounded-lg bg-light  hover:shadow-lg cursor-pointer transition duration-300"
              >
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 flex-shrink-0">
                    <img
                      src="/images/virtual.png"
                      alt="Virtual Consultation"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Virtual Consultation</h4>
                    <p className="text-gray-600 text-sm">
                      Consult with the doctor online from your home.
                    </p>
                  </div>
                </div>
                {/* Right arrow */}
                <i className="fa-solid fa-chevron-right text-black"></i>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="mt-6 text-center">
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
