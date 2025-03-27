import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [types, setTypes] = useState([]); // 🔹 Type'lar uchun state
  const [activeType, setActiveType] = useState(null); // 🔹 Tanlangan Type

  // 🔥 Type'larni yuklash
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://keldibekov.online/type");
        setTypes(response.data);
      } catch (error) {
        console.error("Type'larni yuklashda xatolik:", error);
      }
    };
    fetchTypes();
  }, []);

  // 🔥 Savatni yuklash
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("https://keldibekov.online/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(response.data);
        } catch (error) {
          console.error("Savatni yuklashda xatolik:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartItems([]);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg p-3" style={{ backgroundColor: "#3E3F5B" }}>
      <div className="container-fluid">
        <h1 className="text-white me-3" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          MyShop
        </h1>

        {/* 🔥 Type'lar joylashuvi */}
{user && (
  <div className="d-flex">
    {types.map((type) => (
      <div key={type.id} className="position-relative">
        <button
          className="btn btn-link text-white me-3"
          onClick={() => setActiveType(activeType === type.id ? null : type.id)}
        >
          {type.name}
        </button>

        {/* 🔥 Kategoriyalar chiqishi */}
        {activeType === type.id && (
          <div
            className="position-absolute bg-light shadow rounded p-2"
            style={{ top: "40px", left: 0, minWidth: "150px" }}
          >
            {type.categories.length > 0 ? (
              type.categories.map((category) => (
                <p
                  key={category.id}
                  className="m-0 p-2 text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  {category.name}
                </p>
              ))
            ) : (
              <p className="m-0 p-2 text-muted">Kategoriya yo‘q</p>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
)}


        {/* 🔥 Login, Logout, Register va Savat */}
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <img
                src={user.img}
                alt="Profil"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              />
              <span className="text-white me-3" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
                {user.firstname}
              </span>
              <Link to="/cart" className="text-white me-3" style={{ textDecoration: "none" }}>
                🛒 <span className="badge bg-danger">{cartItems.length}</span>
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>
                Chiqish
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="me-2">
                <button className="btn btn-success">Register</button>
              </Link>
              <Link to="/login">
                <button className="btn" style={{ backgroundColor: "#F6F1DE" }}>
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
