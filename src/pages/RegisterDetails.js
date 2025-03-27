import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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
          Swal.fire("Xatolik!", "Regionlarni olishda muammo yuz berdi!", "error");
        }
      } catch (error) {
        Swal.fire("Xatolik!", "Server bilan bog‘lanib bo‘lmadi!", "error");
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
      Swal.fire("Diqqat!", "Barcha maydonlarni to‘ldiring!", "warning");
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
          Swal.fire("Xatolik!", "Rasm yuklashda muammo yuz berdi!", "error");
          return;
        }
      } catch (error) {
        Swal.fire("Xatolik!", "Rasm yuklab bo‘lmadi!", "error");
        return;
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
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Ro‘yxatdan o‘tish muvaffaqiyatli!",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        Swal.fire("Xatolik!", data.message || "Noma'lum xatolik yuz berdi!", "error");
      }
    } catch (error) {
      Swal.fire("Xatolik!", "Server bilan bog‘lanib bo‘lmadi!", "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Profil ma’lumotlari</h2>

        <div className="text-center mb-3">
          <label htmlFor="imageUpload" className="image-upload" style={{ cursor: "pointer", position: "relative", display: "inline-block" }}>
            {preview ? (
              <img
                src={preview}
                alt="Profil rasmi"
                className="img-thumbnail"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #007BFF",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "#f8f9fa",
                  border: "2px dashed #007BFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#007BFF",
                  fontWeight: "bold",
                  transition: "background 0.3s ease-in-out",
                }}
                onMouseOver={(e) => (e.target.style.background = "#e9ecef")}
                onMouseOut={(e) => (e.target.style.background = "#f8f9fa")}
              >
                📤 .jpg yoki .png yuklang
              </div>
            )}
          </label>
          <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} hidden />

          <button
            className="btn w-100 mt-2"
            style={{
              background: "#3E3F5B",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "8px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#5a5c7a")}
            onMouseOut={(e) => (e.target.style.background = "#3E3F5B")}
          >
            📂 Rasm tanlash
          </button>
        </div>

        <input type="text" className="form-control mb-3" placeholder="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <input type="text" className="form-control mb-3" placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} />

        <select className="form-control mb-3" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
          <option value="">Region tanlang</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn w-100" onClick={handleRegister} style={{ backgroundColor: "#3E3F5B", color: "#fff" }}>
          Ro‘yxatdan o‘tish
        </button>
      </div>
    </div>
  );
};

export default RegisterDetails;
