// src/components/CategoryWisePoster.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Navbar from "./Navbar";

const CategoryPoster = () => {
  const [postersByCategory, setPostersByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://194.164.148.244:4061/api/poster/canvasposters"
        );
        const posters = response.data.posters || [];

        const grouped = posters.reduce((acc, poster) => {
          const category = poster.categoryName || "Uncategorized";
          if (!acc[category]) acc[category] = [];
          acc[category].push(poster);
          return acc;
        }, {});

        setPostersByCategory(grouped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posters:", err);
        setError("Failed to load posters");
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  // Filter categories based on search term
  const filteredCategories = Object.entries(postersByCategory).filter(
    ([category]) =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <div className="p-4 mb-5">
      {/* Heading + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Categories</h1>
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-10">Loading posters...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No categories found
        </div>
      ) : (
        <>
          {filteredCategories.map(([category, posters]) => (
            <div key={category} className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{category}</h3>
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => navigate(`/category/${category}`)}
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posters.slice(0, 4).map((poster) => (
                  <div
                    key={poster._id}
                    className="rounded-xl shadow-md overflow-hidden border hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate(`/posters/${poster._id}`)}
                  >
                    <img
                      src={poster.posterImage?.url || "/placeholder.png"}
                      alt={poster.name || "Poster"}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
    </>
  );
};

export default CategoryPoster;
