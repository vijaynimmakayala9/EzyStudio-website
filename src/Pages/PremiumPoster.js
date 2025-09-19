import React, { useEffect, useState } from "react";
import axios from "axios";

const PremiumPoster = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posters from API
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posters"); // Replace with your API endpoint
        setPosters(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load Premium posters");
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  return (
    <div className="p-4">
      {/* Title always shows */}
 <h3 style={{ marginBottom: 4, fontWeight: 700 }}>Upcoming Festivals</h3>
      {/* Conditional content */}
      {loading ? (
        <div className="text-center mt-10">Loading posters...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : posters.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No posters available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posters.map((poster) => (
            <div
              key={poster._id}
              className="rounded-xl shadow-md overflow-hidden border hover:scale-105 transition-transform duration-200"
            >
              <img
                src={poster.posterImage?.url || "/placeholder.png"}
                alt={poster.name || "Poster"}
                className="w-full h-56 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumPoster;
