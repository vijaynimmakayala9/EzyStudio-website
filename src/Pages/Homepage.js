import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BannerCarousel from "./BannerCarousel"; // 👈 import new banner component
import StoryPage from "./StoryPage";
import FestivalPage from "./FestivalPage";
import PremiumPoster from "./PremiumPoster";
import CategoryWisePoster from "./CategoryWisePoster";
import ProfileHeader from "./ProfileHeader";
import Plans from "./Plans"; // Import the Plans component

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md mb-20">
        <Navbar />
      </div>

      <div className="pt-[90px] bg-gray-50 flex-1 mb-5">
        {/* Banner */}
        <ProfileHeader />
        <div className="my-2">
          <BannerCarousel />
        </div>

        {/* Other Sections */}
        <StoryPage />
        <FestivalPage />
        {/* <PremiumPoster /> */}
        <CategoryWisePoster />
      </div>

      {/* Footer */}
      {/* <div className="mt-auto">
        <Footer />
      </div> */}

      {/* Plans Modal Component */}
      <Plans />
    </div>
  );
};

export default HomePage;
