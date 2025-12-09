import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    const onAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUsername(localStorage.getItem("username") || "");
      setRole(localStorage.getItem("role") || "");
    };

    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUsername("");
    setRole("");

    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-3">
      <Link className="navbar-brand" to="/">Hotel App</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">

          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              {/* ✅ Welcome */}
              <li className="nav-item me-3 text-white">
                Welcome, <b>{username}</b>
              </li>

              {/* ✅ ADMIN BUTTON */}
              {role === "admin" && (
                <li className="nav-item">
                  <Link className="btn btn-warning me-3" to="/admin">
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {/* ✅ USER BUTTON */}
              {role !== "admin" && (
                <li className="nav-item">
                  <Link className="btn btn-secondary me-3" to="/my-reservations">
                    My Reservations
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
