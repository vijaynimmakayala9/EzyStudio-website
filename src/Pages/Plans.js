import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated import for v6+

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all plans when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("http://194.164.148.244:4061/api/plans/getallplan");
        if (response.data && response.data.plans) {
          setPlans(response.data.plans);
          setIsModalOpen(true); // Automatically open the modal when plans are fetched
        }
      } catch (error) {
        console.error("Error fetching plans", error);
      }
    };

    fetchPlans();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Using useNavigate instead of useHistory
  const navigate = useNavigate();
  const handlePlanClick = (planId) => {
    navigate(`/singleplan/${planId}`); // Use navigate to redirect to the single plan page
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Modal for displaying all plans */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal} // Close the modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg w-96 overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicked inside
          >
            {/* Close button (cut button) */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-2xl"
            >
              &#10005; {/* Close button (×) */}
            </button>

            <h2 className="text-xl font-semibold mb-4">Available Plans</h2>

            {/* Display Plans */}
            <div className="grid grid-cols-1 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                  onClick={() => handlePlanClick(plan._id)}
                >
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p>Price: ₹{plan.offerPrice}</p>
                  <p>Duration: {plan.duration}</p>
                  <p>Discount: {plan.discountPercentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Plans;
