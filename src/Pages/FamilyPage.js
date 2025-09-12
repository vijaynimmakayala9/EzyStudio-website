import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons

const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    fullName: "",
    mobileNumber: "",
    age: "",
    gender: "",
    DOB: "",
    height: "",
    weight: "",
    relation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Retrieve staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    if (staffId) {
      // Fetch all family members
      axios
        .get(`http://31.97.206.144:4051/api/staff/getallfamily/${staffId}`)
        .then((response) => {
          setFamilyMembers(response.data.family_members);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching family members");
          setLoading(false);
        });
    } else {
      setError("No staffId found in localStorage");
      setLoading(false);
    }
  }, [staffId]);

  const handleInputChange = (e) => {
    setNewFamilyMember({
      ...newFamilyMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode && selectedMember) {
      // Update family member API call
      axios
        .put(`http://31.97.206.144:4051/api/staff/update-family/${staffId}/${selectedMember._id}`, newFamilyMember)
        .then((response) => {
          const updatedFamilyMembers = familyMembers.map((member) =>
            member._id === selectedMember._id ? response.data.family_member : member
          );
          setFamilyMembers(updatedFamilyMembers);
          resetForm();
        })
        .catch((error) => {
          setError("Error updating family member");
        });
    } else {
      // Add new family member API call
      axios
        .post(`http://31.97.206.144:4051/api/staff/create-family/${staffId}`, newFamilyMember)
        .then((response) => {
          setFamilyMembers([...familyMembers, response.data.family_member]);
          resetForm();
        })
        .catch((error) => {
          setError("Error adding family member");
        });
    }
  };

  const resetForm = () => {
    setNewFamilyMember({
      fullName: "",
      mobileNumber: "",
      age: "",
      gender: "",
      DOB: "",
      height: "",
      weight: "",
      relation: "",
    });
    setEditMode(false);
    setSelectedMember(null);
  };

  const handleEdit = (member) => {
    setNewFamilyMember({
      fullName: member.fullName,
      mobileNumber: member.mobileNumber,
      age: member.age,
      gender: member.gender,
      DOB: member.DOB,
      height: member.height,
      weight: member.weight,
      relation: member.relation,
    });
    setEditMode(true);
    setSelectedMember(member);
  };

  const handleRemove = (memberId) => {
    // Add the API call for removing family member
    axios
      .delete(`http://31.97.206.144:4051/api/staff/remove-family/${staffId}/${memberId}`)
      .then(() => {
        setFamilyMembers(familyMembers.filter((member) => member._id !== memberId));
      })
      .catch((error) => {
        setError("Error removing family member");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-100 py-10">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Manage Family Members
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Full Name */}
              <input
                type="text"
                name="fullName"
                value={newFamilyMember.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Mobile Number */}
              <input
                type="text"
                name="mobileNumber"
                value={newFamilyMember.mobileNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Age */}
              <input
                type="number"
                name="age"
                value={newFamilyMember.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Gender */}
              <input
                type="text"
                name="gender"
                value={newFamilyMember.gender}
                onChange={handleInputChange}
                placeholder="Gender"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Date of Birth */}
              <input
                type="date"
                name="DOB"
                value={newFamilyMember.DOB}
                onChange={handleInputChange}
                placeholder="Date of Birth"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Height */}
              <input
                type="number"
                name="height"
                value={newFamilyMember.height}
                onChange={handleInputChange}
                placeholder="Height (cm)"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Weight */}
              <input
                type="number"
                name="weight"
                value={newFamilyMember.weight}
                onChange={handleInputChange}
                placeholder="Weight (kg)"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {/* Relation */}
              <input
                type="text"
                name="relation"
                value={newFamilyMember.relation}
                onChange={handleInputChange}
                placeholder="Relation"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
            >
              {editMode ? "Update Family Member" : "Add Family Member"}
            </button>
          </form>

          {loading && <p className="text-center text-gray-600 mt-6">Loading family members...</p>}
          {familyMembers.length === 0 && !loading && (
            <p className="text-center text-gray-600 mt-6">No family members found.</p>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Family Members</h3>
            <ul className="space-y-4">
              {familyMembers.map((member, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold text-gray-800">{member.fullName}</p>
                    <p className="text-sm text-gray-600">Relation: {member.relation}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEdit(member)} // Edit button logic
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit /> {/* Edit icon */}
                    </button>
                    <button
                      onClick={() => handleRemove(member._id)} // Remove button logic
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

export default FamilyPage;
