import React from 'react';
import { FaFlask, FaStethoscope, FaXRay, FaFileUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';  // Adjust path if necessary
import Footer from './Footer';  // Adjust path if necessary

const LabCategoryPage = () => {
  const navigate = useNavigate();

  const cardData = [
    { name: "Lab Tests", icon: <FaFlask size={30} />, path: "/labtest" },
    { name: "Packages", icon: <FaStethoscope size={30} />, path: "/packages" },
    { name: "Scans & X-Rays", icon: <FaXRay size={30} />, path: "/scan&xrays" },
    { name: "Upload Prescription", icon: <FaFileUpload size={30} />, path: "/prescriptions" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar here */}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lab Test & Packages
        </h1>

        {/* Cards for Lab Test, Packages, Scans & X-rays, Upload Prescription */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {cardData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate(item.path)}  // Navigate to the respective page
            >
              <div className="flex justify-center items-center mb-4">
                {/* Circle background for icon */}
                <div className="bg-blue-500 text-white p-4 rounded-full">
                  {item.icon}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {item.name}
              </h2>
            </div>
          ))}
        </div>
      </div>

      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default LabCategoryPage;
