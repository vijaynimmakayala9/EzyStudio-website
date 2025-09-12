import React, { useState, useEffect } from "react";
import axios from "axios";

const RecentActivityPage = () => {
  const [doctorBooking, setDoctorBooking] = useState(null);
  const [packageBooking, setPackageBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const staffId = localStorage.getItem("staffId");

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
      setError("Error fetching doctor booking.");
    }
  };

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
      setError("Error fetching package booking.");
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchDoctorBooking();
      fetchPackageBooking();
    } else {
      setError("Staff ID is not available.");
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    if (doctorBooking !== null || packageBooking !== null) {
      setLoading(false);
    }
  }, [doctorBooking, packageBooking]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
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
            {/* Recent Doctor Booking Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Recent Doctor Booking
              </h2>
              {doctorBooking ? (
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Doctor: {doctorBooking.doctorId.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Specialization: {doctorBooking.doctorId.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(doctorBooking.date).toLocaleDateString()} at{" "}
                    {doctorBooking.timeSlot}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment Status:{" "}
                    {doctorBooking.paymentStatus === "captured"
                      ? "Paid"
                      : "Pending"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Price: ₹{doctorBooking.totalPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Booking Status: {doctorBooking.status}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No recent doctor booking.</p>
              )}
            </div>

            {/* Recent Package Booking Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Recent Package Booking
              </h2>
              {packageBooking ? (
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Package: {packageBooking.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{packageBooking.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Tests Included: {packageBooking.totalTestsIncluded}
                  </p>
                  <p className="text-sm text-gray-600">
                    {packageBooking.description}
                  </p>

                  <div className="mt-4">
                    <p className="font-semibold text-gray-800">
                      Included Tests:
                    </p>
                    <ul className="list-disc pl-6">
                      {packageBooking.includedTests.map((test, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {test.name} ({test.subTestCount} sub-tests)
                          <ul className="list-inside pl-4">
                            {test.subTests.map((subTest, subIndex) => (
                              <li
                                key={subIndex}
                                className="text-sm text-gray-500"
                              >
                                - {subTest}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
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
