import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Faqat raqam kiritishga ruxsat

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Agar raqam kiritilsa keyingi inputga o‘tish
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join(""); // 6 ta inputni birlashtiramiz

    if (fullOtp.length !== 6) {
      setError("OTP to‘liq kiritilishi kerak!");
      return;
    }

    setError(null);

    try {
      const response = await fetch("https://keldibekov.online/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP xato!");
      }

      navigate("/register-details", { state: { email } }); // Ro‘yxatdan o‘tish sahifasiga o‘tish
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-3">OTP Tasdiqlash</h2>
        <p className="text-muted">Email: {email}</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex justify-content-between mb-3">
          {otp.map((num, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              className="form-control text-center mx-1"
              style={{ width: "45px", height: "45px", fontSize: "20px" }}
              maxLength="1"
              value={num}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button
          className="btn w-100 text-white"
          style={{ backgroundColor: "#3E3F5B", borderColor: "#3E3F5B" }}
          onClick={handleVerifyOtp}
        >
          Tasdiqlash
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
