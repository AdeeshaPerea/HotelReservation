import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Reservation() {
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    checkIn: "",
    checkOut: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "danger" | "success"

  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ BLOCK PAGE IF LOGGED OUT
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("You must log in to make a reservation.");
      navigate("/login");
    }
  }, [navigate]);

  const params = new URLSearchParams(location.search);
  const roomIdFromURL = params.get("roomId");

  const loggedUserId = localStorage.getItem("userId");

  // ⭐ Auto-fill userId + roomId
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: loggedUserId || "",
      roomId: roomIdFromURL || ""
    }));
  }, [loggedUserId, roomIdFromURL]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // ---------- FRONTEND VALIDATION ----------
    if (!formData.checkIn || !formData.checkOut) {
      setMessageType("danger");
      setMessage("Please select both check-in and check-out dates.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8003/reservation/create",
        formData
      );

      if (!res.data) {
        setMessageType("danger");
        setMessage("Error: User or Room not found, or invalid dates.");
      } else {
        setMessageType("success");
        setMessage(`Reservation created successfully! Your ID is ${res.data.id}`);

        // Reset only dates (user & room stay the same)
        setFormData((prev) => ({
          ...prev,
          checkIn: "",
          checkOut: ""
        }));
      }
    } catch (error) {
      console.error("Create reservation error:", error);

      // Try to read backend error message
      let backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.error;

      if (!backendMsg && typeof error?.response?.data === "string") {
        backendMsg = error.response.data;
      }

      setMessageType("danger");
      setMessage(
        backendMsg
          ? `Error creating reservation: ${backendMsg}`
          : "Error creating reservation"
      );
    }
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header">
          <h3>Create Reservation</h3>
        </div>

        <div className="card-body">
          {message && (
            <div className={`alert alert-${messageType}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* USER ID */}
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="number"
                name="userId"
                className="form-control"
                value={formData.userId}
                readOnly // ⭐ prevent editing
              />
            </div>

            {/* ROOM ID */}
            <div className="mb-3">
              <label className="form-label">Room ID</label>
              <input
                type="number"
                name="roomId"
                className="form-control"
                value={formData.roomId}
                readOnly // ⭐ prevent editing
              />
            </div>

            {/* CHECK-IN */}
            <div className="mb-3">
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                className="form-control"
                value={formData.checkIn}
                onChange={handleChange}
              />
            </div>

            {/* CHECK-OUT */}
            <div className="mb-3">
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                className="form-control"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Create Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
