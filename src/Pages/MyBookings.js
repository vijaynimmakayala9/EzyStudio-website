import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';  // Import Navbar
import Footer from './Footer';  // Import Footer

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
  const [selectedBooking, setSelectedBooking] = useState(null);  // To store the selected booking for the modal
  const staffId = localStorage.getItem('staffId'); // Get staffId from localStorage
  const [rescheduleData, setRescheduleData] = useState({ newDay: '', newDate: '', newTimeSlot: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);  // For cancel confirmation modal
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);  // For reschedule modal

  useEffect(() => {
    if (!staffId) {
      setError("Staff ID is missing. Please log in again.");
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [staffId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://31.97.206.144:4051/api/staff/mybookings/${staffId}`);
      
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings: ' + (err.response?.data?.message || err.message));
      console.error('Booking fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-600 text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-yellow-600 text-white';
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);  // Set the selected booking for the modal
    setShowCancelModal(true);  // Show the cancel modal
  };

  const closeCancelModal = () => {
    setSelectedBooking(null);  // Close the cancel modal
    setShowCancelModal(false);
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);  // Set the selected booking for the modal
    setShowRescheduleModal(true);  // Show the reschedule modal
  };

  const closeRescheduleModal = () => {
    setRescheduleData({ newDay: '', newDate: '', newTimeSlot: '' }); // Reset the data
    setSelectedBooking(null);  // Close the reschedule modal
    setShowRescheduleModal(false);
  };

  const handleReschedule = async () => {
    try {
      const { newDay, newDate, newTimeSlot } = rescheduleData;
      const response = await axios.put(
        `http://31.97.206.144:4051/api/staff/reschedulebooking/${staffId}/${selectedBooking.bookingId || selectedBooking._id}`,
        { newDay, newDate, newTimeSlot }
      );
      if (response.data.isSuccessfull) {
        alert('Booking successfully rescheduled.');
        fetchBookings();  // Refresh the bookings list
        closeRescheduleModal();
      } else {
        alert(response.data.message || 'Failed to reschedule booking.');
      }
    } catch (error) {
      console.error('Reschedule Error:', error);
      alert('Error while rescheduling booking.');
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await axios.put(
        `http://31.97.206.144:4051/api/staff/cancel-booking/${staffId}/${selectedBooking.bookingId || selectedBooking._id}`,
        { status: 'Cancelled' }
      );
      if (response.data.booking) {
        alert('Booking successfully cancelled.');
        fetchBookings();  // Refresh the bookings list
        closeCancelModal();
      } else {
        alert(response.data.message || 'Failed to cancel booking.');
      }
    } catch (error) {
      console.error('Cancel Error:', error);
      alert('Error while cancelling booking.');
    }
  };

  if (loading) {
    return (
      <div className="my-12 text-center text-lg">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 text-center text-lg text-red-500">
        <p>{error}</p>
        <button onClick={fetchBookings} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md">Try Again</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />  {/* Include Navbar */}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">My Consultations</h2>

        {/* Filters */}
        <div className="mb-6 flex justify-start space-x-4">
          <button 
            className={`py-2 px-4 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} 
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} 
            onClick={() => setFilter('confirmed')}
          >
            Upcoming
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`py-2 px-4 rounded-md ${filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} 
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* No bookings */}
        {filteredBookings.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <div key={booking.bookingId || booking._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{booking.serviceType || 'Doctor Consultation'}</h3>
                  <span className={`py-1 px-4 rounded-md ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-start">
                    <span className="font-semibold text-gray-700 w-1/3">Date:</span>
                    <span className="w-2/3">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-semibold text-gray-700 w-1/3">Time:</span>
                    <span className="w-2/3">{booking.timeSlot}</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-semibold text-gray-700 w-1/3">Type:</span>
                    <span className="w-2/3">{booking.type}</span>
                  </div>

                  {booking.meetingLink && (
                    <div className="flex justify-start">
                      <span className="font-semibold text-gray-700 w-1/3">Meeting Link:</span>
                      <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 w-2/3">
                        Join Meeting
                      </a>
                    </div>
                  )}

                  <div className="flex justify-start">
                    <span className="font-semibold text-gray-700 w-1/3">Amount Paid:</span>
                    <span className="w-2/3">₹{booking.payableAmount || booking.totalPrice}</span>
                  </div>
                </div>

                {/* Action buttons */}
                {booking.status === 'Confirmed' && (
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={() => openRescheduleModal(booking)}
                      className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => openCancelModal(booking)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel this booking?</h3>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={closeCancelModal} 
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleCancelBooking} 
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Reschedule Booking</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold">New Day</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={rescheduleData.newDay}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDay: e.target.value })}
                placeholder="Enter new day (e.g., Friday)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">New Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={rescheduleData.newDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">New Time Slot</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={rescheduleData.newTimeSlot}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newTimeSlot: e.target.value })}
                placeholder="Enter new time slot (e.g., 10:00 AM)"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={closeRescheduleModal} 
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleReschedule} 
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />  {/* Include Footer */}
    </div>
  );
};

export default MyBookings;
