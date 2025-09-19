import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SinglePoster = () => {
  const { posterId } = useParams();
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://194.164.148.244:4061/api/poster/singlecanvasposters/${posterId}`
        );
        setPoster(response.data.poster || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching poster:", err);
        setError("Failed to load poster");
        setLoading(false);
      }
    };

    fetchPoster();
  }, [posterId]);

  if (loading) return <p className="text-center mt-10">Loading poster...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!poster) return <p className="text-center mt-10">Poster not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img
          src={poster.posterImage?.url || "/placeholder.png"}
          alt={poster.name || "Poster"}
          className="w-full h-[500px] object-contain bg-gray-50"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold">{poster.name || "Untitled Poster"}</h2>
          <p className="text-gray-600 mt-2">
            Category: {poster.categoryName || "Uncategorized"}
          </p>
          {poster.description && (
            <p className="text-gray-700 mt-3">{poster.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePoster;
