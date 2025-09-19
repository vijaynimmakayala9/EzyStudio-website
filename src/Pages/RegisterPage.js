import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [marriageAnniversaryDate, setMarriageAnniversaryDate] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile || !dob) {
      setError("Name, Mobile, and Date of Birth are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://194.164.148.244:4061/api/users/register",
        { name, email, mobile, dob, marriageAnniversaryDate, referralCode }
      );

      if (response.status === 201) {
        // Navigate to login page after successful registration
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row shadow-lg rounded-5 w-75" style={{ minHeight: "60vh" }}>
        {/* Left Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.tmAZhRsXj4wCMaCSRzVqSQHaGl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Register Illustration"
            className="img-fluid h-100 w-100 p-5"
            style={{ objectFit: "cover", borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem" }}
          />
        </div>

        {/* Right Form */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 rounded-end">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-4 fs-3" style={{ fontWeight: 900 }}>Register</h1>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="form-control"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="marriageAnniversaryDate" className="form-label">Marriage Anniversary Date (Optional)</label>
                <input
                  type="date"
                  id="marriageAnniversaryDate"
                  value={marriageAnniversaryDate}
                  onChange={(e) => setMarriageAnniversaryDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="referralCode" className="form-label">Referral Code (Optional)</label>
                <input
                  type="text"
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="form-control"
                  placeholder="Enter referral code (if any)"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>

            <div className="mt-3 text-center">
              <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
