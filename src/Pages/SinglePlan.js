import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const SinglePlan = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data and Razorpay script
  useEffect(() => {
    // Load user data from localStorage
    const userId = localStorage.getItem("userId");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userId && userData) {
      setUser({ _id: userId, ...userData });
    }

    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setResponseMessage("Failed to load payment gateway. Please refresh the page.");
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch plan details by id
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`http://194.164.148.244:4061/api/plans/singleplan/${id}`);
        if (response.data && response.data.plan) {
          setPlan(response.data.plan);
        }
      } catch (error) {
        console.error("Error fetching plan", error);
        setResponseMessage("Error fetching plan data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      setResponseMessage("Please log in to purchase a plan.");
      return;
    }

    if (!razorpayLoaded) {
      setResponseMessage("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setResponseMessage("Processing payment...");

    try {
      // Calculate amount (same logic as backend)
      let offerPrice = plan.offerPrice ?? plan.originalPrice ?? 0;
      if (user.referredBy && offerPrice > 100) offerPrice -= 100;
      const amount = Math.round(offerPrice * 100); // Convert to paise

      // Create Razorpay order options
      const options = {
        key: "rzp_test_BxtRNvflG06PTV",
        amount: amount,
        currency: "INR",
        name: "Your Company Name",
        description: `Purchase ${plan.name}`,
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          // Send payment verification to your backend
          try {
            setResponseMessage("Verifying payment...");
            
            const verificationResponse = await axios.post("http://194.164.148.244:4061/api/payment/payWithRazorpay", {
              userId: user._id,
              planId: plan._id,
              transactionId: response.razorpay_payment_id
            });
            
            if (verificationResponse.data.success) {
              setResponseMessage(`Payment successful! ${verificationResponse.data.message}`);
              // Update user data in localStorage if needed
              
              // Redirect or show success message
            } else {
              setResponseMessage(`Payment failed: ${verificationResponse.data.message}`);
            }
          } catch (error) {
            console.error("Error during payment verification", error);
            setResponseMessage("Error during payment verification. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "Customer",
          email: user.email || "customer@example.com",
          contact: user.phone || "9999999999"
        },
        notes: {
          planId: plan._id,
          userId: user._id
        },
        theme: {
          color: "#F37254"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setResponseMessage(`Payment failed: ${response.error.reason || "Unknown error"}`);
      });
      
      razorpayInstance.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      setResponseMessage("Error initiating payment. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading plan details...</div>;
  }

  if (!plan) {
    return <div className="p-6 text-center">Plan not found.</div>;
  }

  // Calculate display price (same logic as backend)
  let displayPrice = plan.offerPrice ?? plan.originalPrice ?? 0;
  if (user && user.referredBy && displayPrice > 100) {
    displayPrice -= 100;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{plan.name}</h2>
      <div className="mb-4">
        <p className="text-gray-600 line-through">Original Price: ₹{plan.originalPrice}</p>
        <p className="text-xl font-semibold text-green-600">Offer Price: ₹{displayPrice}</p>
        {user && user.referredBy && displayPrice < (plan.offerPrice ?? plan.originalPrice) && (
          <p className="text-sm text-blue-600">₹100 discount applied from referral!</p>
        )}
        <p className="text-gray-600">Discount: {plan.discountPercentage}% off</p>
        <p className="text-gray-600">Duration: {plan.duration}</p>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold">Features:</p>
        <ul className="list-disc list-inside">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handlePurchase}
          disabled={!razorpayLoaded || !user}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!user ? "Please Login" : razorpayLoaded ? "Purchase Plan" : "Loading Payment..."}
        </button>
      </div>

      {responseMessage && (
        <div className={`mt-4 p-3 rounded text-center ${
          responseMessage.includes("successful") ? "bg-green-100 text-green-700" : 
          responseMessage.includes("Error") || responseMessage.includes("failed") ? "bg-red-100 text-red-700" : 
          "bg-blue-100 text-blue-700"
        }`}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default SinglePlan;