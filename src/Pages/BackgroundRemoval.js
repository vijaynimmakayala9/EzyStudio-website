import React, { useState, useRef } from "react";
import { FiArrowLeft, FiHelpCircle, FiImage, FiCamera, FiDownload, FiShare2 } from "react-icons/fi";
import Navbar from "./Navbar";

function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const fileInputRef = useRef(null);

  const API_KEY = "RMUGZeFkS3zCu19YTAZ8XBu3"; // Replace with your API key

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setProcessedImage(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB for free API");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove background
  const removeBackground = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image_file", blob);

      const apiResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": API_KEY },
        body: formData,
      });

      if (!apiResponse.ok) {
        const data = await apiResponse.json();
        throw new Error(data.errors ? data.errors[0].title : "Background removal failed");
      }

      const processedBlob = await apiResponse.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setProcessedImage(reader.result);
        setIsProcessing(false);
      };
      reader.readAsDataURL(processedBlob);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  // Download image
  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share image
  const shareImage = async () => {
    if (!processedImage) return;
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const file = new File([blob], "background-removed.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "Background Removed Image",
          files: [file],
        });
      } else {
        alert("Web Share API not supported. You can download the image instead.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Reset images
  const resetImages = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col mb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => window.history.back()} className="text-gray-700 hover:text-black">
            <FiArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Background Remover</h1>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-gray-700 hover:text-black"
          >
            <FiHelpCircle size={22} />
          </button>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Create an account on Remove.bg:{" "}
                <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="underline">
                  https://www.remove.bg/api
                </a>
              </li>
              <li>Get a free API key (50 free images per month).</li>
              <li>Replace the API_KEY variable in the code with your API key.</li>
              <li>Upload an image and click "Remove Background".</li>
            </ol>
          </div>
        )}

        {/* Image Upload / Preview */}
        <div className="flex-1 mb-4">
          {!originalImage ? (
            <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              <FiImage size={40} className="text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">No image selected</p>
              <p className="text-gray-400 text-sm">Tap the gallery or camera button below to start</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Image */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original</h3>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-64 object-contain rounded-lg border"
                />
              </div>

              {/* Processed Image */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Processed</h3>
                {isProcessing ? (
                  <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Removing background...</p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-64 object-contain rounded-lg border bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                    <p className="text-gray-500 text-sm">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            {/* Gallery Upload */}
            <label className="flex-1">
              <div className="w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-600 py-3 rounded-lg font-medium cursor-pointer">
                <FiImage />
                Gallery
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            {/* Camera Upload */}
            <label className="flex-1">
              <div className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg font-medium cursor-pointer">
                <FiCamera />
                Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Remove Background */}
          <button
            onClick={removeBackground}
            disabled={!originalImage || isProcessing}
            className={`w-full py-3 rounded-lg font-medium ${
              originalImage && !isProcessing
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Remove Background
          </button>

          {/* Download / Share / Reset */}
          {processedImage && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={downloadImage}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
              >
                <FiDownload />
                Download
              </button>
              <button
                onClick={shareImage}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
              >
                <FiShare2 />
                Share
              </button>
              <button
                onClick={resetImages}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BackgroundRemover;
