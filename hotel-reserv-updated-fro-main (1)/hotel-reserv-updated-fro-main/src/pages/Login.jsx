import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // for spinner
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { username, password };

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8001/user/login",
        payload
      );

      const data = response.data;

      if (typeof data === "object") {
        alert("Login success!");

        // SAVE LOGIN STATE
        localStorage.setItem("loggedIn", "true");

        // SAVE USER DATA
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        window.dispatchEvent(new Event("authChange"));

        // ROLE-BASED REDIRECT
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "user") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid username or password!");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Animated background circles */}
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Glassmorphism login card */}
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to continue to your account</p>

          <form className="login-form" onSubmit={handleLogin}>
            {/* Username */}
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="input-icon">👤</span>
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="input-icon">🔒</span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
