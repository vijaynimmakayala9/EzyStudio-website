import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa'; // Cloud upload icon
import Navbar from './Navbar';  // Adjust path if necessary
import Footer from './Footer';  // Adjust path if necessary

const PrescriptionPage = () => {
  const [file, setFile] = useState(null); // For storing the selected file
  const [uploading, setUploading] = useState(false); // For controlling the loading state
  const [uploadStatus, setUploadStatus] = useState(null); // For handling success/error messages

  // Get staffId from localStorage
  const staffId = localStorage.getItem('staffId');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission (file upload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus('No file selected. Please choose a file.');
      return;
    }

    if (!staffId) {
      setUploadStatus('Staff ID not found!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData

    setUploading(true);
    setUploadStatus(null); // Clear previous status

    try {
      const response = await axios.put(
        `http://31.97.206.144:4051/api/staff/userupload/${staffId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle success response
      if (response.data) {
        setUploadStatus('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    } finally {
      setUploading(false); // Reset loading state after request is done
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar here */}

      <div className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Upload Prescription
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Choose Prescription File
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center items-center">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center cursor-pointer p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                <FaCloudUploadAlt size={20} className="mr-2" />
                Choose File
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-full"
              disabled={uploading} // Disable button while uploading
            >
              {uploading ? 'Uploading...' : 'Submit Prescription'}
            </button>
          </form>

          {/* Display upload status */}
          {uploadStatus && (
            <div
              className={`mt-4 text-center text-lg ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}
            >
              {uploadStatus}
            </div>
          )}
        </div>
      </div>

      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default PrescriptionPage;
