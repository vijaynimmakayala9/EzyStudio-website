import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://194.164.148.244:4061/api/users/verify-otp",
        { userId, otp }
      );

      if (response.status === 200) {
        // Store the authenticated user's details in localStorage
        const { user } = response.data;
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.name);

        // Redirect to the home page
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row shadow-lg rounded-5 w-75" style={{ minHeight: "60vh" }}>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 rounded-end">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-4 fs-3" style={{ fontWeight: 900 }}>
              Verify OTP
            </h1>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control"
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
