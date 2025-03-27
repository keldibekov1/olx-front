import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import VerifyOtp from "./pages/VerifyOtp";
import RegisterDetails from "./pages/RegisterDetails";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";


const App = () => {
  const [user, setUser] = useState(null);

  // 🔥 Sahifa yuklanganda foydalanuvchi ma'lumotini olish
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://keldibekov.online/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setUser(data);
          }
        })
        .catch((err) => console.error("Foydalanuvchi ma'lumotini olishda xatolik:", err));
    }
  }, []);

  return (
    <Router>
      {/* 🔥 Navbar-ga user va setUser props sifatida berildi */}
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register-details" element={<RegisterDetails />} />
        <Route path="/profile" element={<Profile user={user} />} /> {/* 🟢 Profil sahifasi to‘g‘ri ishlaydi */}
      </Routes>
      {/* <Footer />  🔥 Footer shu joyga qo‘shildi */}
    </Router>
  );
};

export default App;
