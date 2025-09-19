import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]); // State to store fetched banners
  const [loading, setLoading] = useState(true); // State to show loading indicator
  
  // Fetch banners from the API
  useEffect(() => {
    axios
      .get("http://194.164.148.244:4061/api/poster/getbanners")
      .then((response) => {
        setBanners(response.data); // Set the fetched banners
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      interval={4000}
      controls={false}
      indicators={false}
      wrap={true}
      pause={false}
      className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
    >
      {banners.map((banner, index) => (
        <Carousel.Item key={index}>
          <div
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${banner.images[0]})` }} // Use the first image from the response
          >
            {/* Text on left */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-6 md:pl-12 lg:pl-16">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {banner.title || "Default Title"} {/* Use default if title is missing */}
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white mt-2">
                  {banner.description || "Default description"} {/* Use default if description is missing */}
                </p>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
