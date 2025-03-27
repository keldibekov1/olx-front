import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // 🟢 Agar token bo‘lmasa, login sahifasiga qaytarish
      return;
    }

    fetch("https://keldibekov.online/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUser(data);
        }
      })
      .catch((err) => console.error("Foydalanuvchi ma'lumotini olishda xatolik:", err));
  }, []);

  if (!user) {
    return <h2 className="text-center mt-5">Yuklanmoqda...</h2>;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg text-center mx-auto" style={{ maxWidth: "400px" }}>
        <img
          src={user.img}
          alt="Profil"
          className="rounded-circle mb-3"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <h3>{user.firstname} {user.lastname}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Roli:</strong> {user.role}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
};

export default Profile;
