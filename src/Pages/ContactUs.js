import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactUs = () => {
  const [userId, setUserId] = useState(null);  // state to store userId
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    // Fetch the userId from localStorage when the component mounts
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId); // Set the userId from localStorage to state
    } else {
      setResponseMessage("User ID not found. Please log in first.");
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setResponseMessage("User ID is required.");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post(`http://194.164.148.244:4061/api/users/contact-us/${userId}`, formData);
      if (response.status === 200) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      setResponseMessage("Error sending message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
      {responseMessage && (
        <div className={`mb-4 ${responseMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
          {responseMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !userId}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
