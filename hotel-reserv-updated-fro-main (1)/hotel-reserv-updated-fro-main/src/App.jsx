import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reservation from "./pages/Reservation";
import PaymentPage from "./pages/Payment-";
import MyReservations from "./pages/My-Reservations";

// ✅ Admin pages
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminRooms from "./pages/AdminRooms";
import AdminReservations from "./pages/AdminReservations";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          {/* Public / user routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-reservations" element={<MyReservations />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
