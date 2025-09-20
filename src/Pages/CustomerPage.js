// src/components/CustomerPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // store userId in localStorage before

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    gender: '',
    dob: '',
    marriageAnniversaryDate: '',
    address: ''
  });
  const [editId, setEditId] = useState(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://194.164.148.244:4061/api/users/allcustomers/${userId}`
      );
      setCustomers(res.data.customers || res.data || []);
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle add or edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://194.164.148.244:4061/api/users/update-customers/${userId}/${editId}`,
          { customer: form }
        );
      } else {
        await axios.post(
          `http://194.164.148.244:4061/api/users/addcustomer/${userId}`,
          { customer: form }
        );
      }
      setShowModal(false);
      setForm({
        name: '',
        mobile: '',
        email: '',
        gender: '',
        dob: '',
        marriageAnniversaryDate: '',
        address: ''
      });
      setEditId(null);
      fetchCustomers();
    } catch (err) {
      alert('Error saving customer');
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(
        `http://194.164.148.244:4061/api/users/delete-customers/${userId}/${id}`
      );
      fetchCustomers();
    } catch (err) {
      alert('Error deleting customer');
    }
  };

  return (
    <>
      <Navbar/>
      <div className="bg-gray-50 min-h-screen">
        {/* Header with Back Arrow */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaArrowLeft 
              className="text-white text-xl cursor-pointer"
              onClick={() => navigate(-1)} // go back
            />
            <h1 className="text-white text-lg font-bold">Add Your Customer</h1>
          </div>
          <button
            onClick={() => {
              setEditId(null);
              setForm({
                name: '',
                mobile: '',
                email: '',
                gender: '',
                dob: '',
                marriageAnniversaryDate: '',
                address: ''
              });
              setShowModal(true);
            }}
            className="bg-white text-purple-600 px-3 py-1 rounded-lg font-bold text-lg"
          >
            +
          </button>
        </div>

        {/* Total Customers */}
        <div className="m-4 bg-white rounded-xl shadow p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-3">
              👥
            </div>
            <div>
              <p className="font-bold">{customers.length} Total Customers</p>
              <p className="text-gray-500 text-sm">
                Manage and organize your customer base
              </p>
            </div>
          </div>
        </div>

        {/* Customer Cards */}
        <div className="space-y-3 px-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {customers.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-gray-500">
                    📧 {c.email || 'No Email'}
                  </p>
                  <p className="text-sm text-gray-500">📞 {c.mobile}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditId(c._id);
                    setForm({
                      name: c.name,
                      mobile: c.mobile,
                      email: c.email,
                      gender: c.gender,
                      dob: c.dob,
                      marriageAnniversaryDate: c.marriageAnniversaryDate,
                      address: c.address
                    });
                    setShowModal(true);
                  }}
                  className="bg-green-100 text-green-600 p-2 rounded-lg"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteCustomer(c._id)}
                  className="bg-red-100 text-red-600 p-2 rounded-lg"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <h2 className="text-xl font-bold">
                  {editId ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  Please fill in the customer information below
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* ... form fields remain unchanged ... */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      {editId ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerPage;
