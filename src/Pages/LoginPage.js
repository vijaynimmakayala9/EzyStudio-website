import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const navigate = useNavigate();

  // Detect device and browser types
  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      return window.matchMedia("(display-mode: standalone)").matches || 
             window.navigator.standalone === true;
    };
    
    setIsStandalone(checkIfInstalled());
    
    // Check if iOS
    const iosCheck = () => {
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    };
    
    setIsIOS(iosCheck());
    
    // Check if Safari
    const isSafariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariCheck);
    
    // Handle beforeinstallprompt event for Android
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show prompt if not already installed and not recently dismissed
      const promptDismissed = localStorage.getItem("installPromptDismissed");
      const promptDismissedTime = localStorage.getItem("installPromptDismissedTime");
      const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
      
      if (!isStandalone && (!promptDismissed || parseInt(promptDismissedTime) < oneWeekAgo)) {
        setShowInstallPrompt(true);
      }
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      localStorage.setItem("appInstalled", "true");
      localStorage.removeItem("installPromptDismissed");
      setShowInstallPrompt(false);
      setIsStandalone(true);
    };

    // Check if we should show install prompt for iOS
    const checkIOSInstallPrompt = () => {
      if (isIOS && !isStandalone) {
        const promptDismissed = localStorage.getItem("installPromptDismissed");
        const promptDismissedTime = localStorage.getItem("installPromptDismissedTime");
        const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
        
        if (!promptDismissed || parseInt(promptDismissedTime) < oneWeekAgo) {
          setShowInstallPrompt(true);
        }
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check for iOS install prompt after initial render
    const timer = setTimeout(checkIOSInstallPrompt, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    // For Android
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        localStorage.setItem("appInstalled", "true");
        localStorage.removeItem("installPromptDismissed");
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    } 
    // For iOS - we can't programmatically add to home screen,
    // so we show instructions instead
    else if (isIOS) {
      // Instructions are already shown in the modal for iOS
      // Here we just mark that the user has seen the prompt
      localStorage.setItem("installPromptDismissed", "true");
      localStorage.setItem("installPromptDismissedTime", new Date().getTime());
      setShowInstallPrompt(false);
    }
  };

  const handleDismissPrompt = () => {
    localStorage.setItem("installPromptDismissed", "true");
    localStorage.setItem("installPromptDismissedTime", new Date().getTime());
    setShowInstallPrompt(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile) {
      setError("Please enter your mobile number.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://194.164.148.244:4061/api/users/login",
        { mobile }
      );

      if (response.status === 200) {
        const { user } = response.data;
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.name);
        navigate("/verify-otp");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  // Instructions for iOS Safari users
  const iOSInstallInstructions = () => (
    <div className="mt-4 text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
      <p className="font-medium mb-2">To install this app:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Tap the <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg> Share icon</li>
        <li>Scroll down and select "Add to Home Screen"</li>
        <li>Tap "Add" in the top right corner</li>
      </ol>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Install Prompt Modal */}
      {showInstallPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Install App</h3>
              <p className="text-gray-600 mb-4">
                {isIOS 
                  ? "Install this app on your iPhone for a better experience." 
                  : "Add this app to your home screen for a better experience"}
              </p>
              
              {isIOS && iOSInstallInstructions()}
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {!isIOS ? (
                  <>
                    <button
                      onClick={handleInstallClick}
                      className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Add to Home Screen
                    </button>
                    <button
                      onClick={handleDismissPrompt}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleDismissPrompt}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Got It
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your login page UI remains the same */}
      {/* Left side */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white text-center max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src='/logo.png' className="w-16 h-16 object-contain rounded-circle" alt="Logo" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg opacity-90">Sign in to continue creating amazing content</p>
          </div>
          <div className="mt-16">
            <p className="text-sm opacity-80">Your creative journey continues here</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo - Mobile */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center">
              <img src='/logo.png' className="w-16 h-16 object-contain rounded-circle" alt="Logo" />
            </div>
          </div>

          {/* Welcome - Mobile */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue creating amazing content</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Phone Number</h2>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                  <div className="relative flex-shrink-0">
                    <select className="h-12 px-4 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50">
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setMobile(value);
                      setError("");
                    }}
                    className="flex-1 block w-full h-12 px-4 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 font-medium hover:text-indigo-500"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Footer - Mobile */}
          <div className="md:hidden mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>

          {/* Manual Add to Home Screen - Only show if not installed and not iOS */}
          {!isStandalone && !isIOS && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowInstallPrompt(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center justify-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Home Screen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;