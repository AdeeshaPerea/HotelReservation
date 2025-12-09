import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please log in to view your reservations.");
      navigate("/login");
    }
  }, []);

  // Fetch user's reservations
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8003/reservation/user/${userId}`)
        .then((res) => setReservations(res.data))
        .catch((err) => console.error("Error loading reservations:", err));
    }
  }, [userId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Reservations</h2>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="row">
          {reservations.map((r) => (
            <div key={r.id} className="col-md-4 mb-3">
              <div className="card shadow p-3">
                <h5>Reservation #{r.id}</h5>
                <p><b>Room ID:</b> {r.roomId}</p>
                <p><b>Check-In:</b> {r.checkIn}</p>
                <p><b>Check-Out:</b> {r.checkOut}</p>
                <p><b>Total-Price:</b> {r.totalPrice}</p>
                <p><b>Status:</b> {r.status || "PENDING"}</p>

                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate(`/payment?id=${r.id}`)}
                >
                  Pay Now
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
