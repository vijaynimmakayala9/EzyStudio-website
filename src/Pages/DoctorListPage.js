import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";

const DoctorListPage = () => {
  const { categoryName } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
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
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [consultationType, setConsultationType] = useState("online");
  const [walletData, setWalletData] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");

  // Fetch doctors based on the category
  useEffect(() => {
    axios
      .get(`http://31.97.206.144:4051/api/admin/getdoctors?categories=${categoryName}`)
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, [categoryName]);

  // Fetch family members of the staff
  useEffect(() => {
    if (staffId) {
      axios
        .get(`http://31.97.206.144:4051/api/staff/getallfamily/${staffId}`)
        .then((response) => {
          setFamilyMembers(response.data.family_members);
        })
        .catch((error) => {
          console.error("Error fetching family members:", error);
        });
    }
  }, [staffId]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    console.log("Fetching wallet data for staffId:", staffId);
    try {
      const response = await axios.get(`http://31.97.206.144:4051/api/staff/wallet/${staffId}`);
      console.log("Wallet Data Response:", response.data);
      setWalletData(response.data);
      return response.data;
    } catch (error) {
      handleFetchWalletError(error);
      return null;
    }
  };

  // Handle errors when fetching wallet data
  const handleFetchWalletError = (error) => {
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  };

  // Fetch available slots for the selected doctor and date
  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    setLoadingSlots(true);
    try {
      const response = await axios.get(
        `http://31.97.206.144:4051/api/staff/doctor-slots/${doctorId}?date=${date}&type=${consultationType}`
      );
      
      if (response.data.slots && response.data.slots.length > 0) {
        setAvailableSlots(response.data.slots);
      } else {
        setAvailableSlots([]);
        alert("No slots available for the selected date");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      alert("Error fetching available slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedFamilyMember) {
      alert("Please select a family member for the consultation");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot");
      return;
    }

    setProcessingPayment(true);

    try {
      const consultationFee = selectedDoctor.consultation_fee;
      
      // Fetch wallet data
      let walletDataToUse = walletData;
      if (!walletDataToUse) {
        walletDataToUse = await fetchWalletData();
      }

      const availableDoctorBalance = walletDataToUse?.forDoctors || 0;
      
      // Check if wallet has sufficient balance
      if (availableDoctorBalance >= consultationFee) {
        // Full payment from wallet - no transaction ID needed
        const response = await axios.post(
          `http://31.97.206.144:4051/api/staff/consultationbooking/${staffId}`,
          {
            doctorId: selectedDoctor._id,
            date: selectedDate,
            timeSlot: selectedSlot.timeSlot,
            familyMemberId: selectedFamilyMember,
            type: consultationType,
            useWallet: true,
            // NO transactionId when using only wallet
          }
        );

        if (response.data.isSuccessfull) {
          setBookingData(response.data);
          setBookingSuccess(true);
          alert("Booking Successful with Wallet!");
        } else {
          alert("Booking failed: " + response.data.message);
        }
      } else {
        // Insufficient wallet balance - initiate Razorpay
        initializeRazorpayPayment(consultationFee, availableDoctorBalance);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const initializeRazorpayPayment = async (amount, walletBalanceUsed) => {
    const options = {
      key: 'rzp_test_BxtRNvflG06PTV',
      amount: (amount - walletBalanceUsed) * 100, // Amount in paise
      currency: "INR",
      name: "Your Company Name",
      description: "Doctor Consultation Payment",
      handler: async function (response) {
        // This is the actual Razorpay payment ID
        const razorpayTransactionId = response.razorpay_payment_id;
        
        try {
          const bookingResponse = await axios.post(
            `http://31.97.206.144:4051/api/staff/consultationbooking/${staffId}`,
            {
              doctorId: selectedDoctor._id,
              date: selectedDate,
              timeSlot: selectedSlot.timeSlot,
              familyMemberId: selectedFamilyMember,
              type: consultationType,
              transactionId: razorpayTransactionId, // Actual Razorpay ID
              walletAmount: walletBalanceUsed, // How much wallet balance was used
            }
          );

          if (bookingResponse.data.isSuccessfull) {
            setBookingData(bookingResponse.data);
            setBookingSuccess(true);
            alert("Booking Successful!");
          } else {
            alert("Booking failed after payment: " + bookingResponse.data.message);
          }
        } catch (error) {
          console.error("Error completing booking:", error);
          alert("Booking completion failed. Please contact support.");
        }
      },
      prefill: {
        name: "Patient Name",
        email: "patient@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle book now
  const handleBookNow = (doctorId) => {
    const doctor = doctors.find((doc) => doc._id === doctorId);
    setSelectedDoctor(doctor);
    setAvailableSlots([]);
    setSelectedDate(null);
    setSelectedSlot(null);
    fetchWalletData();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchAvailableSlots(selectedDoctor._id, date);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Handle consultation type change
  const handleConsultationTypeChange = (type) => {
    setConsultationType(type);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    
    // If we already have a doctor selected, fetch slots for the new type
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots(selectedDoctor._id, selectedDate);
    }
  };

  // Handle new family member form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding new family member
  const handleAddFamilyMember = () => {
    if (!staffId) return;
    axios
      .post(`http://31.97.206.144:4051/api/staff/create-family/${staffId}`, newFamilyMember)
      .then((response) => {
        alert("Family member added successfully");
        setFamilyMembers([...familyMembers, response.data.family_member]);
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
        setShowFamilyForm(false);
      })
      .catch((error) => {
        console.error("Error adding family member:", error);
      });
  };

  // Handle family member selection
  const handleFamilyMemberSelect = (familyMemberId) => {
    setSelectedFamilyMember(familyMemberId);
  };

  // Close booking modal
  const closeBookingModal = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedFamilyMember(null);
    setBookingSuccess(false);
    setBookingData(null);
    setWalletData(null);
    setAvailableSlots([]);
  };

  // Get unique dates from doctor's slots
  const getAvailableDates = () => {
    if (!selectedDoctor) return [];
    
    let slots = [];
    if (consultationType === "online") {
      slots = selectedDoctor.onlineSlots || [];
    } else if (consultationType === "offline") {
      slots = selectedDoctor.offlineSlots || [];
    } else {
      slots = [...(selectedDoctor.onlineSlots || []), ...(selectedDoctor.offlineSlots || [])];
    }
    
    // Get unique dates and sort them
    const uniqueDates = [...new Set(slots.map(slot => slot.date))].sort();
    return uniqueDates;
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading doctors...</p>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Doctors in {categoryName} Category
      </h1>

      {/* Display doctors list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {doctors.length === 0 ? (
          <p className="text-center text-gray-600">No doctors found in this category</p>
        ) : (
          doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="bg-blue-500 text-white p-6 flex justify-center items-center">
                <img
                  src={`http://31.97.206.144:4051${doctor.image}`}
                  alt={doctor.name}
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-600">{doctor.experience} years experience</p>
                <p className="text-gray-600">{doctor.qualification}</p>
                <p className="text-gray-600">{doctor.address}</p>
                <p className="text-gray-600">Consultation Fee: ₹{doctor.consultation_fee}</p>
              </div>

              <div className="p-6 text-center">
                <button
                  onClick={() => handleBookNow(doctor._id)}
                  className="p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleBack}
          className="p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Back to Categories
        </button>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-4">
              Book Appointment with {selectedDoctor.name}
            </h2>
            
            {/* Wallet Balance Info */}
            {walletData && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Your Doctor Wallet Balance: <span className="font-bold">₹{walletData.forDoctors}</span>
                </p>
                <p className="text-sm text-blue-800">
                  Consultation Fee: <span className="font-bold">₹{selectedDoctor.consultation_fee}</span>
                </p>
                {walletData.forDoctors < selectedDoctor.consultation_fee && (
                  <p className="text-sm text-orange-600 mt-1">
                    Additional payment required: ₹{selectedDoctor.consultation_fee - walletData.forDoctors}
                  </p>
                )}
              </div>
            )}
            
            {/* Consultation Type Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Consultation Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleConsultationTypeChange("online")}
                  className={`p-2 rounded-md ${consultationType === "online" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Online
                </button>
                <button
                  onClick={() => handleConsultationTypeChange("offline")}
                  className={`p-2 rounded-md ${consultationType === "offline" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Display available dates */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select Date</label>
              <div className="flex flex-wrap gap-2">
                {getAvailableDates().map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 rounded-md text-sm ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
                  >
                    {new Date(date).toLocaleDateString()}
                  </button>
                ))}
              </div>
            </div>

           {/* Display slots for the selected date */}
{selectedDate && (
  <div className="mb-6">
    <label className="block text-gray-700 mb-2">
      Select Time Slot {loadingSlots && "(Loading...)"}
    </label>
    <div className="flex flex-wrap gap-2">
      {loadingSlots ? (
        <p>Loading slots...</p>
      ) : availableSlots.filter(slot => !slot.isExpired).length > 0 ? ( // Filter out expired slots
        availableSlots
          .filter(slot => !slot.isExpired) // Exclude expired slots
          .map((slot) => (
            <button
              key={slot._id}
              onClick={() => handleSlotSelect(slot)}
              className={`p-2 rounded-md text-sm ${selectedSlot === slot ? 'bg-green-600 text-white' : 'bg-blue-500 text-white'}`}
            >
              {slot.timeSlot}
            </button>
          ))
      ) : (
        <p>No slots available for this date</p>
      )}
    </div>
  </div>
)}


            {/* Family Member Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Select Family Member</label>
                <button
                  onClick={() => setShowFamilyForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add New
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {familyMembers.map((member) => (
                  <div
                    key={member._id}
                    onClick={() => handleFamilyMemberSelect(member._id)}
                    className={`p-3 border rounded-md cursor-pointer ${selectedFamilyMember === member._id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <h4 className="font-medium">{member.fullName}</h4>
                    <p className="text-sm text-gray-600">{member.relation} • {member.age} years • {member.gender}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={closeBookingModal}
                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              
              <button
                onClick={handleBooking}
                disabled={processingPayment || !selectedFamilyMember || !selectedDate || !selectedSlot}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processingPayment ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {bookingSuccess && bookingData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your consultation has been successfully booked.</p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
                <p><span className="font-medium">Booking ID:</span> {bookingData.doctorConsultationBookingId}</p>
                <p><span className="font-medium">Doctor:</span> Dr. {selectedDoctor.name}</p>
                <p><span className="font-medium">Date:</span> {bookingData.booking.date}</p>
                <p><span className="font-medium">Time:</span> {selectedSlot.timeSlot}</p>
                <p><span className="font-medium">Type:</span> {consultationType}</p>
                <p><span className="font-medium">Amount Paid:</span> ₹{selectedDoctor.consultation_fee}</p>
                
                {bookingData.walletUsed > 0 && (
                  <p><span className="font-medium">Wallet Used:</span> ₹{bookingData.walletUsed}</p>
                )}
                
                {bookingData.onlinePaymentUsed > 0 && (
                  <p><span className="font-medium">Online Payment:</span> ₹{bookingData.onlinePaymentUsed}</p>
                )}
                
                {bookingData.meetingLink && (
                  <p className="mt-3">
                    <span className="font-medium">Meeting Link:</span> 
                    <a href={bookingData.meetingLink} className="text-blue-600 hover:underline ml-2">Join Consultation</a>
                  </p>
                )}
              </div>
              
              <button
                onClick={closeBookingModal}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Family Member Form Modal */}
      {showFamilyForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">Add Family Member</h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={newFamilyMember.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={newFamilyMember.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={newFamilyMember.age}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <select
                name="gender"
                value={newFamilyMember.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="DOB"
                value={newFamilyMember.DOB}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={newFamilyMember.height}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={newFamilyMember.weight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="relation"
                placeholder="Relation"
                value={newFamilyMember.relation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowFamilyForm(false)}
                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFamilyMember}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;