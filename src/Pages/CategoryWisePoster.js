import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryWisePoster = () => {
  const [postersByCategory, setPostersByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://194.164.148.244:4061/api/poster/canvasposters"
        );
        const posters = response.data.posters || [];

        // Group posters by categoryName
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
        setError("Failed to load Premium posters");
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center mt-10">Loading posters...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : Object.keys(postersByCategory).length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No posters available
        </div>
      ) : (
        <>
          {Object.entries(postersByCategory).map(([category, posters]) => (
            <div key={category} className="mb-8">
              {/* Category Title */}
              <h3 className="mb-2 font-bold text-lg">{category}</h3>

              {/* Posters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posters.map((poster) => (
                  <div
                    key={poster._id}
                    onClick={() => navigate(`/posters/${poster._id}`)}
                    className="cursor-pointer rounded-xl shadow-md overflow-hidden border hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={poster.posterImage?.url || "/placeholder.png"}
                      alt={poster.name || poster.title || "Poster"}
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
  );
};

export default CategoryWisePoster;
