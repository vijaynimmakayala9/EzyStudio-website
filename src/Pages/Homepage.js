import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoriesPage from "./CategoriesPage";
import RecentActivityPage from "./RecentActivityPage";
import DoctorBlogsPage from "./DoctorBlogs";

// Banner Images
const bannerImages = [
  "https://static.vecteezy.com/system/resources/previews/023/417/426/original/medical-infographic-banner-background-clinic-pharmacy-laboratory-test-and-research-healthcare-concept-backdrop-illustration-vector.jpg",
  "https://static.vecteezy.com/system/resources/previews/023/417/426/original/medical-infographic-banner-background-clinic-pharmacy-laboratory-test-and-research-healthcare-concept-backdrop-illustration-vector.jpg", // Repeat image
  "https://static.vecteezy.com/system/resources/previews/023/417/426/original/medical-infographic-banner-background-clinic-pharmacy-laboratory-test-and-research-healthcare-concept-backdrop-illustration-vector.jpg", // Repeat image
];

const HomePage = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change banner every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(bannerInterval);
  }, []);

  return (
    <div>
      {/* Static Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Banner Section (Slideshow) */}
      <section
        className="relative w-full h-[300px] overflow-hidden mt-[80px]" // Adjusted height and margin-top for the navbar
      >
        {/* Sliding Banner Images */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000"
          style={{
            transform: `translateX(-${currentBanner * 100}%)`,
          }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="w-full h-full">
              <img
                src={image}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <CategoriesPage/>
      <RecentActivityPage/>
      <DoctorBlogsPage/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
