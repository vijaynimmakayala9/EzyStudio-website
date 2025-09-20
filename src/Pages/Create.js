import React, { useState } from "react";
import { FaPalette } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const CreativeStudio = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const tools = [
    {
      title: "Create Template",
      description: "Design custom posts with templates",
      iconBg: "bg-blue-100",
      icon: "🟦",
      route: "/custom",
    },
    {
      title: "Logo Design",
      description: "Create professional logos",
      iconBg: "bg-green-100",
      icon: "✏️",
      route: "/logo",
    },
    {
      title: "Image to Video",
      description: "Transform images into videos",
      iconBg: "bg-purple-100",
      icon: "🎥",
      route: "#", // Coming soon
    },
  ];

  const handleToolClick = (tool) => {
    if (tool.route === "#") {
      setModalText(`${tool.title} is coming soon!`);
      setShowModal(true);
    } else {
      navigate(tool.route);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-5 mb-5">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6 relative overflow-hidden">
          <div>
            <h1 className="text-2xl font-bold">Creative Studio</h1>
            <p className="mt-2 text-sm opacity-90">
              Create stunning designs with professional tools
            </p>
            <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
              Create Poster
            </button>
          </div>
          <div className="absolute top-5 right-5 bg-white bg-opacity-20 p-3 rounded-full">
            <FaPalette size={24} />
          </div>
        </div>

        {/* Choose Tool */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Choose Your Tool</h2>
          <p className="text-gray-500 text-sm">
            Select from our professional design tools
          </p>

          <div className="mt-4 space-y-4">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handleToolClick(tool)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl ${tool.iconBg}`}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{tool.title}</h3>
                    <p className="text-gray-500 text-sm">{tool.description}</p>
                  </div>
                </div>
                <FiChevronRight className="text-gray-400" size={22} />
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-blue-900/40 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg border border-white/30 flex flex-col items-center space-y-4 animate-modal-in">
              
              <div className="flex justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-center text-black drop-shadow-md">
                {modalText}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-500/60 transition-colors backdrop-blur-sm shadow-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreativeStudio;
