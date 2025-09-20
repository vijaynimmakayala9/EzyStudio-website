import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTools, FaUserCircle, FaHeadset, FaArrowLeft, FaShieldAlt, FaFileContract } from "react-icons/fa";
import {
  FaUser,
  FaGear,
  FaGift,
  FaUsers,
  FaFileInvoice,
  FaBuilding,
  FaTrash,
  FaCircleQuestion,
  FaEnvelope,
  FaWandMagicSparkles,
  FaNoteSticky, // ✅ use this instead of FaRegStickyNote
  FaImage,
} from "react-icons/fa6";
import Navbar from './Navbar'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Account");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId") || "9573817475";
    const name = localStorage.getItem("userName") || "Julee Perween";
    setUserId(id);
    setUserName(name);
  }, []);

  // tools tab items
  const tools = [
    {
      name: "Background Remover",
      desc: "Remove image backgrounds instantly",
      route: "/background-remover",
      icon: <FaImage className="text-blue-500" />,
    },
    {
      name: "Caption Generator",
      desc: "Generate engaging captions",
      route: "/caption-generator",
      icon: <FaWandMagicSparkles className="text-green-500" />,
    },
    {
      name: "WhatsApp Stickers",
      desc: "Create custom stickers",
      route: "/stickers",
      icon: <FaNoteSticky className="text-pink-500" />, // ✅ fixed
    },
  ];

  // account tab items
  const account = [
    {
      name: "My Profile",
      desc: "Manage your personal information",
      route: "/profile",
      icon: <FaUser className="text-blue-500" />,
    },
    // {
    //   name: "Settings",
    //   desc: "App preferences and configuration",
    //   route: "/settings",
    //   icon: <FaGear className="text-gray-500" />,
    // },
    {
      name: "Refer & Earn",
      desc: "Invite friends and earn rewards",
      route: "/refer",
      icon: <FaGift className="text-yellow-500" />,
    },
    {
      name: "Add Customers",
      desc: "Manage your customer database",
      route: "/customer",
      icon: <FaUsers className="text-green-500" />,
    },
    {
      name: "Create Invoice",
      desc: "Generate professional invoices",
      route: "/invoice",
      icon: <FaFileInvoice className="text-purple-500" />,
    },
    {
      name: "Add Business",
      desc: "Register your business profile",
      route: "#",
      icon: <FaBuilding className="text-indigo-500" />,
    },
    {
      name: "Delete Account",
      desc: "Permanently remove your account",
      route: "/delete-account",
      icon: <FaTrash className="text-red-500" />,
    },
  ];

  // support tab items
  const support = [
    {
      name: "Contact Support",
      desc: "Get help from our team",
      route: "/contact",
      icon: <FaEnvelope className="text-green-500" />,
    },
    {
      name: "Privacy Policy",
      desc: "Read our privacy guidelines",
      route: "https://ezystudio.onrender.com/privacy-and-policy",
      icon: <FaShieldAlt className="text-blue-500" />,
    },
    {
      name: "Terms & Conditions",
      desc: "View terms and conditions",
      route: "https://ezystudio.onrender.com/terms-and-conditions",
      icon: <FaFileContract className="text-purple-500" />,
    },

  ];

  const getItems = () => {
    if (activeTab === "Tools") return tools;
    if (activeTab === "Support") return support;
    return account;
  };

  return (
    <>
    <Navbar/>
    <div className="p-4 max-w-md mx-auto mb-5">
      {/* Header with Back Arrow */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <FaArrowLeft className="text-xl text-gray-600" />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Tabs with Icons */}
      <div className="flex justify-around mb-4">
        {[
          { name: "Tools", icon: <FaTools /> },
          { name: "Account", icon: <FaUserCircle /> },
          { name: "Support", icon: <FaHeadset /> },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 mx-1 py-2 rounded-md font-medium flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${activeTab === tab.name
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="text-sm">{tab.name}</span>
          </button>

        ))}
      </div>

      {/* Blue Card for User */}
      {activeTab === "Account" && (
        <div
          className="bg-blue-500 rounded-xl shadow-md p-4 flex items-center space-x-3 text-white cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center text-blue-500 font-bold">
            {userName.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userName}</h2>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="mt-4 space-y-3">
        {getItems().map((item, i) => (
          <div
            key={i}
            className="rounded-xl shadow-md border p-3 bg-white hover:bg-gray-50 transition cursor-pointer flex items-center gap-3"
            onClick={() => {
              if (item.route.startsWith("http")) {
                window.open(item.route, "_blank", "noopener,noreferrer");
              } else {
                navigate(item.route);
              }
            }}
          >
            {item.icon}
            <div>
              <h2 className="font-semibold text-lg">{item.name}</h2>
              {item.desc && <p className="text-gray-500 text-sm">{item.desc}</p>}
            </div>
          </div>

        ))}
      </div>
    </div>
    </>
  );
}
