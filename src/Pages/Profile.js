import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      fetchProfile(id);
    }
  }, []);

  const fetchProfile = (id) => {
    axios
      .get(`http://194.164.148.244:4061/api/users/get-profile/${id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!newImage) return alert("Please select an image");
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("profileImage", newImage);

    try {
      setLoading(true);
      await axios.put(
        `http://194.164.148.244:4061/api/users/edit-profile/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Profile image updated!");
      setNewImage(null);
      fetchProfile(userId); // refresh profile data
    } catch (error) {
      console.error("Error uploading profile image", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <p className="p-4">Loading profile…</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex flex-col items-center">
        <img
          src={profile.profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
        />
        <h1 className="text-xl font-semibold mt-2">{profile.name}</h1>
        <p className="text-gray-500">{profile.email}</p>
        <p className="text-gray-500">{profile.mobile}</p>

        {/* File upload */}
        <div className="mt-4 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload New Image"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <p>
          <span className="font-semibold">DOB:</span> {profile.dob || "-"}
        </p>
        <p>
          <span className="font-semibold">Anniversary:</span>{" "}
          {profile.marriageAnniversaryDate || "-"}
        </p>
        <p>
          <span className="font-semibold">Wallet:</span> ₹{profile.wallet}
        </p>
      </div>

      {/* Plans Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Subscribed Plans</h2>

        {profile.subscribedPlans.length > 0 ? (
          <div className="space-y-3">
            {profile.subscribedPlans.map((plan) => (
              <div
                key={plan._id}
                className="border p-3 rounded-lg bg-gray-50 shadow-sm"
              >
                <h3 className="font-semibold text-indigo-600">{plan.name}</h3>
                <p className="text-sm text-gray-600">
                  Duration: {plan.duration}
                </p>
                <p className="text-sm text-gray-600">
                  Price:{" "}
                  <span className="line-through text-red-500 mr-1">
                    ₹{plan.originalPrice}
                  </span>
                  <span className="font-semibold text-green-600">
                    ₹{plan.offerPrice}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Discount: {plan.discountPercentage}%
                </p>
                <p className="text-sm text-gray-600">
                  Start Date: {new Date(plan.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  End Date: {new Date(plan.endDate).toLocaleDateString()}
                </p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="list-disc ml-5 text-sm text-gray-600 mt-2">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No plans subscribed</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
