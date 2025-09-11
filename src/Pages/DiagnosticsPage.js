import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    addressType: "Home"
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");

  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    // Fetch diagnostics centers
    axios
      .get("http://31.97.206.144:4051/api/admin/alldiagnostics")
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          setDiagnostics(response.data.data);
        } else {
          setDiagnostics([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching diagnostics");
        setLoading(false);
      });

    // Fetch wallet data
    if (staffId) {
      fetchWalletData();
    }

    // Fetch family members of the staff
    if (staffId) {
      axios
        .get(`http://31.97.206.144:4051/api/staff/getallfamily/${staffId}`)
        .then((response) => {
          setFamilyMembers(response.data.family_members || []);
        })
        .catch((error) => {
          console.error("Error fetching family members:", error);
        });
    }
  }, [staffId]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`http://31.97.206.144:4051/api/staff/wallet/${staffId}`);
      setWalletData(response.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://31.97.206.144:4051/api/staff/getaddresses/${staffId}`);
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedDiagnostic(null);
    setSelectedOption("");
    setAvailableSlots([]);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedAddress("");
    setSelectedFamilyMember("");
  };

  // Handle Diagnostic Center selection
  const handleDiagnosticClick = async (diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    
    // Fetch addresses when diagnostic is selected
    await fetchAddresses();
    
    setShowPopup(true);
  };

  // Handle Home Collection or Center Visit selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    if (option === "Home Collection") {
      // Filter available home collection slots
      const slots = selectedDiagnostic.homeCollectionSlots.filter(slot => !slot.isBooked);
      setAvailableSlots(slots);
    } else {
      // For center visit, show available center visit slots
      const slots = selectedDiagnostic.centerVisitSlots.filter(slot => !slot.isBooked);
      setAvailableSlots(slots);
    }
  };

  // Handle Date Selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  // Handle Time Selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle address form input change
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };



  

  // Create new address
  const handleCreateAddress = async () => {
    try {
      const response = await axios.post(
        `http://31.97.206.144:4051/api/staff/create-address/${staffId}`,
        newAddress
      );
      
      if (response.data.success) {
        // Refresh addresses list
        await fetchAddresses();
        setShowAddressForm(false);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
          addressType: "Home"
        });
      }
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  // Check if booking button should be disabled
  const isBookingDisabled = () => {
    if (!selectedOption || !selectedFamilyMember) return true;
    
    if (selectedOption === "Home Collection") {
      return !selectedAddress || !selectedDate || !selectedTime;
    } else if (selectedOption === "Center Visit") {
      return !selectedDate || !selectedTime;
    }
    
    return true;
  };

  // Handle booking
  const handleBooking = async () => {
    if (isBookingDisabled()) {
      alert("Please fill all required fields");
      return;
    }

    setProcessingPayment(true);

    try {
      // For direct booking without cart, we'll assume a fixed price of ₹0
      // You might want to add a price field to your diagnostic center or get it from somewhere else
      const bookingPrice = 0; // This should be replaced with actual price logic
      const availableTestsBalance = walletData?.forTests || 0;
      
      // Check if wallet has sufficient balance
      if (availableTestsBalance >= bookingPrice) {
        // Full payment from wallet - no transaction ID needed
        const response = await axios.post(
          `http://31.97.206.144:4051/api/staff/create-bookings/${staffId}`,
          {
            familyMemberId: selectedFamilyMember,
            diagnosticId: selectedDiagnostic._id,
            serviceType: selectedOption,
            date: selectedDate,
            timeSlot: selectedTime,
            addressId: selectedOption === "Home Collection" ? selectedAddress : null
          }
        );

        if (response.data.isSuccessfull) {
          alert("Booking Successful with Wallet!");
          handlePopupClose();
        } else {
          alert("Booking failed: " + response.data.message);
        }
      } else {
        // Insufficient wallet balance - initiate Razorpay
        initializeRazorpayPayment(bookingPrice, availableTestsBalance);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async (amount, walletBalanceUsed) => {
    const options = {
      key: 'rzp_test_BxtRNvflG06PTV',
      amount: (amount - walletBalanceUsed) * 100, // Amount in paise
      currency: "INR",
      name: "Credent Health",
      description: "Diagnostics Payment",
      handler: async function (response) {
        // This is the actual Razorpay payment ID
        const razorpayTransactionId = response.razorpay_payment_id;
        
        try {
          const bookingResponse = await axios.post(
            `http://31.97.206.144:4051/api/staff/create-bookings/${staffId}`,
            {
              familyMemberId: selectedFamilyMember,
              diagnosticId: selectedDiagnostic._id,
              serviceType: selectedOption,
              date: selectedDate,
              timeSlot: selectedTime,
              addressId: selectedOption === "Home Collection" ? selectedAddress : null,
              transactionId: razorpayTransactionId,
              walletAmount: walletBalanceUsed
            }
          );

          if (bookingResponse.data.isSuccessfull) {
            alert("Booking Successful!");
            handlePopupClose();
          } else {
            alert("Booking failed after payment: " + bookingResponse.data.message);
          }
        } catch (error) {
          console.error("Error completing booking:", error);
          alert("Booking completion failed. Please contact support.");
        }
      },
      prefill: {
        name: localStorage.getItem("staffName") || "Customer",
        email: localStorage.getItem("staffEmail") || "customer@example.com",
        contact: localStorage.getItem("staffPhone") || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Available Diagnostics Centers</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {diagnostics.length === 0 && !loading && (
            <p className="text-center text-gray-600">No diagnostics centers available.</p>
          )}
          {diagnostics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagnostics.map((diagnostic) => (
                <div key={diagnostic._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`http://31.97.206.144:4051${diagnostic.image}`}
                    alt={diagnostic.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{diagnostic.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{diagnostic.email}</p>
                    <p className="text-sm text-gray-600">{diagnostic.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">{diagnostic.address}</p>
                    <button
                      onClick={() => handleDiagnosticClick(diagnostic)}
                      className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Select Diagnostic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Popup for selection */}
      {showPopup && selectedDiagnostic && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              {selectedDiagnostic.name} - Book Appointment
            </h3>
            
            {/* Family Member Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Select Family Member</h4>
              <select
                value={selectedFamilyMember}
                onChange={(e) => setSelectedFamilyMember(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Family Member</option>
                {familyMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.relation})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Service Type Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Select Service Type</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOptionSelect("Home Collection")}
                  className={`px-4 py-2 rounded-md ${selectedOption === "Home Collection" ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Home Collection
                </button>
                <button
                  onClick={() => handleOptionSelect("Center Visit")}
                  className={`px-4 py-2 rounded-md ${selectedOption === "Center Visit" ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Center Visit
                </button>
              </div>
            </div>

            {/* Home Collection Options */}
            {selectedOption === "Home Collection" && (
              <>
                {/* Address Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Select Address</h4>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add New Address
                    </button>
                  </div>
                  
                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => setSelectedAddress(address._id)}
                          className={`p-3 border rounded-md cursor-pointer ${selectedAddress === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        >
                          <h4 className="font-medium">{address.addressType}</h4>
                          <p className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.state} - {address.postalCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No addresses found. Please add an address for home collection.</p>
                  )}
                </div>

                {/* Date and Time Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Select Date</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDiagnostic.homeCollectionSlots
                      .filter(slot => !slot.isBooked)
                      .map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(slot.date)}
                          className={`p-2 rounded-md text-sm ${selectedDate === slot.date ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                          {new Date(slot.date).toLocaleDateString('en-IN')}
                        </button>
                      ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Select Time Slot</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDiagnostic.homeCollectionSlots
                        .filter(slot => slot.date === selectedDate && !slot.isBooked)
                        .map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimeSelect(slot.timeSlot)}
                            className={`p-2 rounded-md text-sm ${selectedTime === slot.timeSlot ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                          >
                            {slot.timeSlot}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Center Visit Options */}
            {selectedOption === "Center Visit" && (
              <>
                {/* Date and Time Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Select Date</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDiagnostic.centerVisitSlots
                      .filter(slot => !slot.isBooked)
                      .map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(slot.date)}
                          className={`p-2 rounded-md text-sm ${selectedDate === slot.date ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                          {new Date(slot.date).toLocaleDateString('en-IN')}
                        </button>
                      ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Select Time Slot</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDiagnostic.centerVisitSlots
                        .filter(slot => slot.date === selectedDate && !slot.isBooked)
                        .map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimeSelect(slot.timeSlot)}
                            className={`p-2 rounded-md text-sm ${selectedTime === slot.timeSlot ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                          >
                            {slot.timeSlot}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePopupClose}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={isBookingDisabled() || processingPayment}
                className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-md ${
                  isBookingDisabled() || processingPayment
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-600'
                }`}
              >
                {processingPayment ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-center mb-4">Add New Address</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select
                  name="addressType"
                  value={newAddress.addressType}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter postal code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter country"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAddress}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default DiagnosticsPage;