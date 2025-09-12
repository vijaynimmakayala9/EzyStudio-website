import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    addressType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Flag for edit mode
  const [selectedAddress, setSelectedAddress] = useState(null); // To store the selected address

  // Retrieve staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    if (staffId) {
      // Fetch all addresses for the staff member
      axios
        .get(`http://31.97.206.144:4051/api/staff/getaddresses/${staffId}`)
        .then((response) => {
          setAddresses(response.data.addresses);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching addresses");
          setLoading(false);
        });
    } else {
      setError("No staffId found in localStorage");
      setLoading(false);
    }
  }, [staffId]);

  // Handle input change for new or edited address
  const handleInputChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to add or update an address
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode && selectedAddress) {
      // Update address API call
      axios
        .put(
          `http://31.97.206.144:4051/api/staff/update-address/${staffId}/${selectedAddress._id}`,
          newAddress
        )
        .then((response) => {
          const updatedAddresses = addresses.map((address) =>
            address._id === selectedAddress._id ? response.data.address : address
          );
          setAddresses(updatedAddresses);
          resetForm();
        })
        .catch((error) => {
          setError("Error updating address");
        });
    } else {
      // Add new address API call
      axios
        .post(`http://31.97.206.144:4051/api/staff/create-address/${staffId}`, newAddress)
        .then((response) => {
          setAddresses([...addresses, response.data.address]);
          resetForm();
        })
        .catch((error) => {
          setError("Error adding address");
        });
    }
  };

  // Reset the form to initial state
  const resetForm = () => {
    setNewAddress({
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      addressType: "",
    });
    setEditMode(false); // Exit edit mode
    setSelectedAddress(null); // Clear selected address
  };

  // Set form data for editing
  const handleEdit = (address) => {
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType,
    });
    setEditMode(true);
    setSelectedAddress(address); // Store selected address for editing
  };

  // Handle address removal
  const handleRemove = (addressId) => {
    axios
      .delete(`http://31.97.206.144:4051/api/staff/remove-address/${staffId}/${addressId}`)
      .then(() => {
        setAddresses(addresses.filter((address) => address._id !== addressId));
      })
      .catch((error) => {
        setError("Error removing address");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-100 py-10">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Manage Addresses
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Street */}
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                placeholder="Street"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* City */}
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                placeholder="City"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* State */}
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                placeholder="State"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Country */}
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Postal Code */}
              <input
                type="text"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Address Type */}
              <input
                type="text"
                name="addressType"
                value={newAddress.addressType}
                onChange={handleInputChange}
                placeholder="Address Type (e.g. Home, Office)"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
            >
              {editMode ? "Update Address" : "Add Address"}
            </button>
          </form>

          {loading && <p className="text-center text-gray-600 mt-6">Loading addresses...</p>}
          {addresses.length === 0 && !loading && (
            <p className="text-center text-gray-600 mt-6">No addresses found.</p>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Addresses</h3>
            <ul className="space-y-4">
              {addresses.map((address, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold text-gray-800">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}, {address.country} - {address.addressType}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEdit(address)} // Edit button logic
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit /> {/* Edit icon */}
                    </button>
                    <button
                      onClick={() => handleRemove(address._id)} // Remove button logic
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt /> {/* Trash icon */}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddressPage;
