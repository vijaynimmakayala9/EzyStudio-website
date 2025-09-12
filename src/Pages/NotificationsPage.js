import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Import Navbar
import Footer from "./Footer"; // Import Footer

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    // Retrieve staffId from localStorage
    const storedStaffId = localStorage.getItem("staffId");
    if (storedStaffId) {
      setStaffId(storedStaffId);
    } else {
      setError("Staff ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (staffId) {
      // Fetch notifications from API using the staffId
      axios
        .get(`http://31.97.206.144:4051/api/staff/notifications/${staffId}`)
        .then((response) => {
          if (response.data.notifications) {
            setNotifications(response.data.notifications);
          } else {
            setNotifications([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch notifications. Please try again later.");
          setLoading(false);
        });
    }
  }, [staffId]);

  const renderNotifications = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (notifications.length > 0) {
      return (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-gray-700">{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">No Notifications</h3>
          <p className="mt-4 text-gray-600 text-center">
            You have no new notifications at the moment.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Include the Navbar */}
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Notifications
        </h2>
        {renderNotifications()}
      </div>

      {/* Include the Footer */}
      <Footer />
    </div>
  );
};

export default NotificationsPage;
