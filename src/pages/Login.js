import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email va parolni kiriting!");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch("https://keldibekov.online/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Xatolik yuz berdi!");
      }
  
      // 🔥 Tokenni saqlash
      localStorage.setItem("token", data.token);
  
      // 🔥 User ma’lumotlarini olish va saqlash
      const userRes = await fetch("https://keldibekov.online/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${data.token}`,
          "Accept": "*/*",
        },
      });
  
      const userData = await userRes.json();
  
      if (!userRes.ok) {
        throw new Error(userData.message || "Foydalanuvchi ma’lumotlarini olishda xatolik!");
      }
  
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ `localStorage` ga userni saqlaymiz
      setUser(userData); // ✅ `setUser` orqali userni holatda saqlaymiz
  
      alert("Tizimga muvaffaqiyatli kirdingiz!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
