import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";



export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();


  const reservationId = new URLSearchParams(location.search).get("id");


  const [reservation, setReservation] = useState(null);
  const [room, setRoom] = useState(null);
  const [roomImage, setRoomImage] = useState(null);
  const [loading, setLoading] = useState(false);


  // ⭐ Payment Method State ⭐
  const [paymentMethod, setPaymentMethod] = useState("MASTERCARD");


  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("You must log in to make a payment.");
      navigate("/login");
    }
  }, []);


  // Load reservation & room info
  useEffect(() => {
    if (!reservationId) return;


    const loadData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8003/reservation/${reservationId}`
        );


        setReservation(res.data);


        const roomRes = await axios.get(
          `http://localhost:8002/room/${res.data.roomId}`
        );
        setRoom(roomRes.data);


        const arr = JSON.parse(roomRes.data.images || "[]");
        if (arr.length > 0) setRoomImage(arr[0]);


      } catch (err) {
        console.error("Error loading payment info:", err);
      }
    };


    loadData();
  }, [reservationId]);


  // ⭐ Handle Payment
  const handlePay = async () => {
    if (!reservation) return;


    setLoading(true);


    try {
      const res = await axios.post("http://localhost:8004/payment/create", {
        reservationId: Number(reservationId),
        amount: reservation.totalPrice,
        method: paymentMethod,
      });


      // ⭐ Block duplicate payment
      if (res.data.status === "FAILED") {
        alert("This reservation is already paid.");
        setLoading(false);
        return;
      }


      // ⭐ Normal successful payment flow
      if (res.data.status === "PENDING" || res.data.status === "SUCCESS") {
        alert("Payment Successful!");
        navigate("/my-reservations");
      }


    } catch (err) {
      console.error("Payment Failed:", err);
      alert("Payment failed. Try again.");
    }


    setLoading(false);
  };


  // ⭐ If reservation is already CONFIRMED → Show message instead of payment UI
  if (reservation?.status === "CONFIRMED") {
    return (
      <div className="container mt-5">
        <h3>Payment</h3>


        <div className="alert alert-success mt-4">
          <strong>This reservation is already fully paid and confirmed.</strong>
        </div>


        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/my-reservations")}
        >
          Go Back to My Reservations
        </button>
      </div>
    );
  }


  return (
    <div className="container mt-4">
      <h3 className="mb-4">Confirm & Pay</h3>


      <div className="row">


        {/* LEFT SIDE */}
        <div className="col-md-7">


          <div className="card mb-4 p-3">
            <h5>Payment Method</h5>


            <div className="btn-group-vertical w-100 mt-3" role="group">


              {/* PayPal */}
              <input
                type="radio"
                className="btn-check"
                name="payment"
                id="payment-paypal"
                onChange={() => setPaymentMethod("PAYPAL")}
              />
              <label
                className="btn btn-outline-primary text-start d-flex align-items-center gap-2 payment-option"
                htmlFor="payment-paypal"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  height="20"
                  alt="PayPal"
                />
                PayPal
              </label>


              {/* Mastercard */}
              <input
                type="radio"
                className="btn-check"
                name="payment"
                id="payment-mastercard"
                defaultChecked
                onChange={() => setPaymentMethod("MASTERCARD")}
              />
              <label
                className="btn btn-outline-primary text-start d-flex align-items-center gap-2 payment-option"
                htmlFor="payment-mastercard"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  height="20"
                  alt="Mastercard"
                />
                Mastercard
              </label>


              {/* Visa */}
              <input
                type="radio"
                className="btn-check"
                name="payment"
                id="payment-visa"
                onChange={() => setPaymentMethod("VISA")}
              />
              <label
                className="btn btn-outline-primary text-start d-flex align-items-center gap-2 payment-option"
                htmlFor="payment-visa"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  height="20"
                  alt="Visa"
                />
                Visa
              </label>


            </div>
          </div>


          <div className="card mb-4 p-3">
            <h5>Cancellation Policy</h5>
            <p>
              Free cancellation before your selected date.
              After that, the reservation becomes non-refundable.
            </p>
          </div>


          <div className="card p-3">
            <h5>Ground Rules</h5>
            <ul>
              <li>Follow all hotel policies.</li>
              <li>Treat the room with care.</li>
            </ul>
          </div>


        </div>


        {/* RIGHT SIDE */}
        <div className="col-md-5">
          <div className="card p-3 shadow-sm">


            <img
              src={roomImage || "https://via.placeholder.com/400x250"}
              className="img-fluid rounded mb-3 payment-img"
              alt="Room"
            />


            <h5>
              {room?.type} • ${room?.price}/night
            </h5>


            <hr />


            <h6>Your Trip Summary</h6>


            <div className="d-flex justify-content-between">
              <span>Check-In:</span>
              <strong>{reservation?.checkIn}</strong>
            </div>


            <div className="d-flex justify-content-between">
              <span>Check-Out:</span>
              <strong>{reservation?.checkOut}</strong>
            </div>


            <hr />


            <h6>Pricing Breakdown</h6>
            <div className="d-flex justify-content-between">
              <span>Room Charges</span>
              <strong>${reservation?.totalPrice}</strong>
            </div>


            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handlePay}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : `Confirm & Pay $${reservation?.totalPrice}`}
            </button>


          </div>
        </div>


      </div>
    </div>
  );
}


