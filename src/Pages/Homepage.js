import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoriesPage from "./CategoriesPage";
import RecentActivityPage from "./RecentActivityPage";
import DoctorBlogsPage from "./DoctorBlogs";

// Banner Images
const bannerImages = [
  "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
  "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
  "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const extendedBanners = [...bannerImages, bannerImages[0]]; // duplicate first image for seamless scroll

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000); // every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle seamless looping
  useEffect(() => {
    if (currentSlide === extendedBanners.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 2000);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [currentSlide]);

  return (
    <div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="pt-[90px] bg-gray-50"> {/* Adjust padding to navbar height */}
        {/* Banner Carousel */}
        <section className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitioning ? "transform 2000ms ease-in-out" : "none",
              width: `${extendedBanners.length * 100}%`,
            }}
          >
            {extendedBanners.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center px-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-white">
                    Quality Medical Care
                  </h2>
                  <p className="text-lg md:text-xl text-white max-w-2xl mt-2">
                    Your health is our priority. Experience the best medical services with our expert team.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide % bannerImages.length === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Other Sections */}
        <CategoriesPage />
        <RecentActivityPage />
        <DoctorBlogsPage />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
