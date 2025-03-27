import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [regionId, setRegionId] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("https://keldibekov.online/region");
        const data = await response.json();
        if (response.ok) {
          setRegions(data);
        } else {
          alert("Regionlarni olishda xatolik!");
        }
      } catch (error) {
        alert("Server bilan bog‘lanib bo‘lmadi!");
      }
    };
    fetchRegions();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    if (!firstname || !lastname || !regionId || !password) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    // 📤 Rasmni yuklash
    let imageUrl = "https://example.com/default.jpg";
    if (img) {
      const formData = new FormData();
      formData.append("file", img);
      try {
        const uploadRes = await fetch("https://keldibekov.online/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrl = uploadData.fileUrl; // 🎯 Rasm URL olindi
        } else {
          alert("Rasm yuklashda xatolik!");
        }
      } catch (error) {
        alert("Rasm yuklab bo‘lmadi!");
      }
    }

    const payload = {
      email,
      firstname,
      lastname,
      regionId, // 🎯 UUID formatida ketyapti
      password,
      img: imageUrl,
    };

    try {
      const response = await fetch("https://keldibekov.online/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Ro‘yxatdan o‘tish muvaffaqiyatli!");
        navigate("/login");
      } else {
        alert(data.message || "Xatolik yuz berdi!");
      }
    } catch (error) {
      alert("Server bilan bog‘lanib bo‘lmadi!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Profil ma’lumotlari</h2>

        <div className="text-center mb-3">
          <label htmlFor="imageUpload" className="image-upload">
            {preview ? (
              <img src={preview} alt="Preview" className="img-thumbnail" width="100" />
            ) : (
              <span>📤 .jpg yoki .png yuklang</span>
            )}
          </label>
          <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} hidden />
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="First name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        {/* 📌 Regionlar uchun SELECT */}
        <select className="form-control mb-3" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
          <option value="">Region tanlang</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleRegister}>
          Ro‘yxatdan o‘tish
        </button>
      </div>
    </div>
  );
};

export default RegisterDetails;
