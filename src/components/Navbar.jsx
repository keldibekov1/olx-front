import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark p-3 d-flex justify-content-between align-items-center">
      <h1 className="text-white">MyShop</h1>
      <div>
        {user ? (
          <div className="d-flex align-items-center">
            <img
              src={user.img}
              alt="Profil"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
            <span className="text-white" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
              {user.firstname}
            </span>
            <button className="btn btn-danger ms-3" onClick={handleLogout}>
              Chiqish
            </button>
          </div>
        ) : (
          <>
            <Link to="/register" className="me-2">
              <button className="btn btn-success">Register</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-warning">Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
