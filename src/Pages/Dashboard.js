import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    },
    {
      name: "Caption Generator",
      desc: "Generate engaging captions",
      route: "/caption-generator",
    },
    {
      name: "WhatsApp Stickers",
      desc: "Create custom stickers",
      route: "/stickers",
    },
  ];

  // account tab items
  const account = [
    { name: "My Profile", desc: "Manage your personal information", route: "/profile" },
    { name: "Settings", desc: "App preferences and configuration", route: "/settings" },
    { name: "Refer & Earn", desc: "Invite friends and earn rewards", route: "/refer" },
    { name: "Add Customers", desc: "Manage your customer database", route: "/customers/add" },
    { name: "Create Invoice", desc: "Generate professional invoices", route: "/invoice" },
    { name: "Add Business", desc: "Register your business profile", route: "/business/add" },
    { name: "Delete Account", desc: "Permanently remove your account", route: "/delete-account" },
  ];

  // support tab items
  const support = [
    { name: "FAQ", desc: "Frequently asked questions", route: "/faq" },
    { name: "Contact Support", desc: "Get help from our team", route: "/contact" },
  ];

  const getItems = () => {
    if (activeTab === "Tools") return tools;
    if (activeTab === "Support") return support;
    return account;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex justify-around mb-4">
        {["Tools", "Account", "Support"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 mx-1 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
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
            <p className="text-sm">{userId}</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="mt-4 space-y-3">
        {getItems().map((item, i) => (
          <div
            key={i}
            className="rounded-xl shadow-md border p-3 bg-white hover:bg-gray-50 transition cursor-pointer"
            onClick={() => navigate(item.route)}
          >
            <h2 className="font-semibold text-lg">{item.name}</h2>
            {item.desc && (
              <p className="text-gray-500 text-sm">{item.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
