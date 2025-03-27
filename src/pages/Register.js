import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Email validatsiya qilish uchun regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Iltimos, email kiriting!");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email noto‘g‘ri formatda!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://keldibekov.online/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Xatolik yuz berdi!");
      }

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Ro‘yxatdan o‘tish</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Emailingizni kiriting"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          className="btn w-100"
          onClick={handleSendOtp}
          disabled={loading}
          style={{ backgroundColor: "#3E3F5B", color: "#fff" }}
        >
          {loading ? "Yuborilmoqda..." : "OTP yuborish"}
        </button>
      </div>
    </div>
  );
};

export default Register;
