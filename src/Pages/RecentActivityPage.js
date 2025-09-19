import React, { useState, useEffect } from "react";
import axios from "axios";

const RecentActivityPage = () => {
  const [doctorBooking, setDoctorBooking] = useState(null);
  const [packageBooking, setPackageBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const staffId = localStorage.getItem("staffId");

  // Fetch Doctor Booking
  const fetchDoctorBooking = async () => {
    try {
      const response = await axios.get(
        `http://31.97.206.144:4051/api/staff/recent-doctor-booking/${staffId}`
      );
      if (response.data.booking) {
        setDoctorBooking(response.data.booking);
      } else {
        setDoctorBooking(null);
      }
    } catch (err) {
      console.error("Error fetching doctor booking:", err);
      setError("No Recent Doctor Activities Available.");
    }
  };

  // Fetch Package Booking
  const fetchPackageBooking = async () => {
    try {
      const response = await axios.get(
        `http://31.97.206.144:4051/api/staff/recent-package-booking/${staffId}`
      );
      if (response.data.package) {
        setPackageBooking(response.data.package);
      } else {
        setPackageBooking(null);
      }
    } catch (err) {
      console.error("Error fetching package booking:", err);
      setError("No Recent Package Activities Available.");
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchDoctorBooking();
      fetchPackageBooking();
    } else {
      setError("Staff ID is missing. Please log in again.");
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    if (doctorBooking !== null || packageBooking !== null) {
      setLoading(false);
    }
  }, [doctorBooking, packageBooking]);

  return (
    <div className="bg-gray-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-left text-gray-800 mb-4">
          Recent Activity
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-600">
            Loading recent activity...
          </p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">{error}</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Doctor Booking Card */}
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
    {doctorBooking ? (
      <div className="flex items-center">
        {/* Doctor Image (small on left side) */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mr-4">
          <img
            src={`http://31.97.206.144:4051${doctorBooking.doctorId.image}`}
            alt={doctorBooking.doctorId.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Doctor Info */}
        <div className="flex flex-col">
          <p className="text-lg font-medium text-gray-800">
            <strong>{doctorBooking.doctorId.name}</strong>
          </p>
          <p className="text-sm text-gray-600">
            {doctorBooking.doctorId.specialization}
          </p>
          <p className="text-sm text-gray-600">
            {doctorBooking.doctorId.qualification}
          </p>
          <p className="text-sm text-gray-600">
            Date: {new Date(doctorBooking.date).toLocaleDateString()} at{" "}
            {doctorBooking.timeSlot}
          </p>
          <p className="text-sm text-gray-600">
            Payment Status:{" "}
            {doctorBooking.paymentStatus === "captured" ? "Paid" : "Pending"}
          </p>
          <p className="text-sm text-gray-600">
            Price: ₹{doctorBooking.totalPrice}
          </p>
          <p className="text-sm text-gray-600">Status: {doctorBooking.status}</p>
        </div>
      </div>
    ) : (
      <p className="text-gray-500">No recent doctor booking.</p>
    )}
  </div>


            {/* Package Booking Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              {packageBooking ? (
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-gray-800">
                    <strong>{packageBooking.name}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{packageBooking.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Tests: {packageBooking.totalTestsIncluded}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No recent package booking.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityPage;
