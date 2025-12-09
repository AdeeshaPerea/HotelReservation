import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


export default function PaymentPage() {
    const [reservationId, setReservationId] = useState("");
    const [payment, setPayment] = useState(null);
    const [status, setStatus] = useState("READY"); 
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ⭐ BLOCK PAGE IF LOGGED OUT
      useEffect(() => {
        if (!localStorage.getItem("loggedIn")) {
          alert("You must log in to make a payment.");
          navigate("/login");
        }
      }, []);
    

    // ⭐ New State
    const [reservationDetails, setReservationDetails] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);

    // ---------------- FETCH RESERVATION DETAILS ----------------
    const fetchReservationInfo = async () => {
        try {
            const res = await axios.get(`http://localhost:8083/reservation/${reservationId}`);
            setReservationDetails(res.data);

            // fetch room details next
            const room = await axios.get(`http://localhost:8082/room/${res.data.roomId}`);
            setRoomDetails(room.data);

            // calculate total price
            const checkIn = new Date(res.data.checkIn);
            const checkOut = new Date(res.data.checkOut);
            const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

            const total = diffDays * room.data.price;
            setTotalPrice(total);

        } catch (err) {
            console.error("Error loading reservation:", err);
            setReservationDetails(null);
            setRoomDetails(null);
            setTotalPrice(null);
        }
    };

    // auto-fetch when reservationId changes
    useEffect(() => {
        if (reservationId.trim() !== "") {
            fetchReservationInfo();
        }
    }, [reservationId]);


    // ------------------- HANDLE PAYMENT -------------------
    const handlePay = async () => {
        if (!reservationId) {
            alert("Please enter a reservation ID.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8084/payment/create", {
                reservationId: Number(reservationId),
                amount: totalPrice,        // ⭐ Now using calculated total price
                method: "CARD",
            });

            setPayment(response.data);
            setStatus(response.data.status);
        } catch (err) {
            console.error(err);
            setStatus("FAILED");
        }

        setLoading(false);
    };


    // ------------------- STATUS CHECK -------------------
    useEffect(() => {
        if (!payment || payment.status !== "PENDING") return;

        const interval = setInterval(async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8084/payment/status/${payment.id}`
                );

                setPayment(res.data);
                setStatus(res.data.status);
            } catch (err) {
                console.error(err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [payment]);


    // ------------------- UI -------------------
    return (
        <div style={{ padding: "20px" }}>
            <h1>Manual Payment Page</h1>

            {/* -------- INPUT FIELD -------- */}
            {status === "READY" && (
                <div>
                    <input
                        type="number"
                        placeholder="Enter Reservation ID"
                        value={reservationId}
                        onChange={(e) => setReservationId(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
                    />
                </div>
            )}

            {/* -------- SHOW RESERVATION DETAILS -------- */}
            {reservationDetails && roomDetails && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
                    <h3>Reservation Summary</h3>

                    <p><b>Room ID:</b> {reservationDetails.roomId}</p>
                    <p><b>Room Package:</b> {roomDetails.type}</p>
                    <p><b>Price per Night:</b> ${roomDetails.price}</p>
                    <p><b>Check-In:</b> {reservationDetails.checkIn}</p>
                    <p><b>Check-Out:</b> {reservationDetails.checkOut}</p>

                    <h4>Total Price: <span style={{ color: "green" }}>${totalPrice}</span></h4>

                    <button onClick={handlePay} disabled={loading}>
                        {loading ? "Starting payment..." : "Pay Now"}
                    </button>
                </div>
            )}

            {/* -------- STATUS DISPLAY -------- */}
            {status === "PENDING" && (
                <h2 style={{ color: "orange" }}>Payment Processing... Please wait</h2>
            )}

            {status === "SUCCESS" && (
                <h2 style={{ color: "green" }}>
                    ✔ Payment Successful! Reservation Confirmed.
                </h2>
            )}

            {status === "FAILED" && (
                <h2 style={{ color: "red" }}>
                    ✘ Payment Failed. Check reservation ID.
                </h2>
            )}
        </div>
    );
}
