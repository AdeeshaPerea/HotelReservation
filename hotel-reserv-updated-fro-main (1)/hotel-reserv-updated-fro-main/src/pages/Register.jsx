import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // ⬅️ important

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // for toggle
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false); // for spinner

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      username,
      password,
      email,
      address,
      telephone,
      birthday,
    };

    setLoading(true);

    axios
      .post("http://localhost:8001/user/add", userData)
      .then((response) => {
        console.log("User added:", response.data);
        alert("User registered successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="register-wrapper">
      {/* Background shapes */}
      <div className="register-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main content */}
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2 className="register-title">Create an Account</h2>
            <p className="register-subtitle">
              Join our hotel reservation system and manage your bookings easily.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* First + Last name in one row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
                <span className="input-icon">@</span>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            {/* Telephone + Birthday in one row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Telephone</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    className="form-input"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                  <span className="input-icon">📞</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Birthday</label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    className="form-input"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                  />
                  <span className="input-icon">🎂</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Address</label>
              <div className="input-wrapper">
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                ></textarea>
                <span className="input-icon textarea-icon">🏠</span>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                <span className="input-icon">🔒</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Register"}
            </button>

            {/* Login link */}
            <p className="login-link">
              Already have an account?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
