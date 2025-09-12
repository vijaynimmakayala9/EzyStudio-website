// MedicalRecordsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Navbar'; // Import Header
import Footer from './Footer'; // Import Footer

const MedicalRecordsPage = () => {
  const [bookings, setBookings] = useState([]); // Store fetched bookings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const staffId = localStorage.getItem('staffId'); // Get the staffId from localStorage

  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://31.97.206.144:4051/api/staff/mybookings/${staffId}`);
        
        if (response.data.success && response.data.bookings) {
          setBookings(response.data.bookings); // Set the bookings state with the fetched data
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error fetching bookings. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    if (staffId) {
      fetchBookings(); // Call the fetch function when component mounts
    } else {
      setError('Staff ID not found.');
      setLoading(false);
    }
  }, [staffId]);

  // Function to check if a field is empty
  const isEmpty = (value) => {
    return !value || value.length === 0;
  };

  // Function to get the booking ID (customized)
  const getBookingId = (booking) => {
    // Check if diagnosticBookingId is available, otherwise fall back to doctorConsultationBookingId
    return booking.diagnosticBookingId || booking.doctorConsultationBookingId;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header /> {/* Include Header */}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Medical Records
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading bookings...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">{error}</p>
        ) : (
          <div>
            {/* If no bookings are available */}
            {bookings.length === 0 ? (
              <p className="text-center text-lg text-gray-500">No medical records available</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.bookingId} className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Booking ID: {getBookingId(booking)} {/* Custom booking ID */}
                  </h2>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Service Type:</span> {booking.serviceType || 'Not provided'}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Doctor Consultation ID:</span> {booking.doctorConsultationBookingId}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Diagnostic Booking ID:</span> {booking.diagnosticBookingId || 'Not available'}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Booking Date:</span> {new Date(booking.date).toLocaleDateString()} | 
                      <span className="font-medium"> Time:</span> {booking.timeSlot}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Total Price:</span> ₹{booking.totalPrice}
                    </p>
                  </div>

                  {/* Conditionally render Doctor reports and prescriptions if it's a doctor consultation */}
                  {booking.doctorConsultationBookingId && (
                    <>
                      <div className="mb-4">
                        <p className="font-medium text-gray-800">Doctor Reports:</p>
                        <p className="text-sm text-gray-500">
                          {isEmpty(booking.doctorReports) ? 'No file available' : booking.doctorReports.join(', ')}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-gray-800">Doctor Prescriptions:</p>
                        <p className="text-sm text-gray-500">
                          {isEmpty(booking.doctorPrescriptions) ? 'No file available' : booking.doctorPrescriptions.join(', ')}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Conditionally render Diagnostic reports and prescriptions if it's a diagnostic booking */}
                  {booking.diagnosticBookingId && (
                    <>
                      <div className="mb-4">
                        <p className="font-medium text-gray-800">Report File:</p>
                        <p className="text-sm text-gray-500">
                          {isEmpty(booking.reportFile) ? 'No file available' : booking.reportFile}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-gray-800">Diagnostic Prescription:</p>
                        <p className="text-sm text-gray-500">
                          {isEmpty(booking.diagPrescription) ? 'No file available' : booking.diagPrescription}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer /> {/* Include Footer */}
    </div>
  );
};

export default MedicalRecordsPage;
