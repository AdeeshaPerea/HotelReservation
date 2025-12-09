// AdminRooms.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function AdminRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [modalData, setModalData] = useState({});

  // Protect admin route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (!isLoggedIn || role !== "ADMIN") {
      alert("Access denied. Please log in as admin.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get("http://localhost:8002/room/all")
          .catch(() => ({ data: [] }));

        console.log("AdminRooms: fetched rooms:", response.data);
        setRooms(response.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Filter rooms based on search term
  const filteredRooms = rooms.filter((room) => {
    const t = searchTerm.toLowerCase();
    return (
      room.type?.toLowerCase().includes(t) ||
      room.description?.toLowerCase().includes(t) ||
      room.status?.toLowerCase().includes(t) ||
      String(room.roomNumber || "").toLowerCase().includes(t)
    );
  });

  // ---------- DELETE ----------
  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:8002/room/delete/${roomId}`);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      alert("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  // ---------- MODAL HELPERS (ADD / EDIT) ----------

  // Open modal for adding
  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setModalData({
      roomNumber: "",
      type: "",
      price: "",
      status: "available",
      description: "",
      maxGuests: "",
      images: "",
    });
    setShowModal(true);
  };

  // Open modal for editing
  const startEdit = (room) => {
    setIsAdding(false);
    setEditingId(room.id);
    setModalData({
      id: room.id,
      roomNumber: room.roomNumber || "",
      type: room.type || "",
      price: room.price ?? "",
      status: room.status || "available",
      description: room.description || "",
      maxGuests: room.maxGuests ?? "",
      images: room.images || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setModalData({});
    setIsAdding(false);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "maxGuests") {
      setModalData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setModalData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const saveModal = async () => {
    try {
      const payload = {
        ...modalData,
        price:
          modalData.price === "" || modalData.price === null
            ? 0
            : Number(modalData.price),
        maxGuests:
          modalData.maxGuests === "" || modalData.maxGuests === null
            ? 0
            : Number(modalData.maxGuests),
      };

      if (isAdding) {
        // ADD
        const res = await axios.post(
          "http://localhost:8002/room/add",
          payload
        );
        const newRoom = res.data;
        setRooms((prev) => [...prev, newRoom]);
        alert("Room added successfully");
      } else if (editingId != null) {
        // UPDATE
        const res = await axios.put(
          `http://localhost:8002/room/update/${editingId}`,
          payload
        );
        const updatedRoom = res.data;
        setRooms((prev) =>
          prev.map((r) => (r.id === editingId ? updatedRoom : r))
        );
        alert("Room updated successfully");
      }

      closeModal();
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Failed to save room");
    }
  };

  // ---------- RENDER ----------

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Room Management</h1>
            <button
              className="admin-logout-btn"
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
            </button>
          </div>
          <div className="loading-spinner">
            <div className="spinner-animation"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1>Room Management</h1>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-success" onClick={startAdd}>
              + Add Room
            </button>
            <button
              className="admin-logout-btn"
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          <h2>All Rooms</h2>

          <div className="search-filter">
            <input
              type="text"
              className="search-input"
              placeholder="Search by type, description, status, room no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredRooms.length === 0 ? (
            <div className="empty-state">
              <p>No rooms found</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room No</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Max Guests</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>{room.roomNumber || "-"}</td>
                      <td>{room.type}</td>
                      <td>
                        {room.description
                          ? room.description.length > 30
                            ? room.description.substring(0, 30) + "..."
                            : room.description
                          : "N/A"}
                      </td>
                      <td>{room.price != null ? `Rs ${room.price}` : "N/A"}</td>
                      <td>{room.status || "available"}</td>
                      <td>{room.maxGuests || "N/A"}</td>
                      <td>
                        {room.images
                          ? room.images.substring(0, 25) + "..."
                          : "N/A"}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => startEdit(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => deleteRoom(room.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
            <h3>{isAdding ? "Add Room" : "Edit Room"}</h3>

            <div style={{ display: "grid", gap: 12 }}>
              <label>
                Room Number
                <input
                  type="text"
                  name="roomNumber"
                  value={modalData.roomNumber || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Type
                <input
                  type="text"
                  name="type"
                  value={modalData.type || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Price (Rs)
                <input
                  type="number"
                  name="price"
                  value={modalData.price || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={modalData.status || "available"}
                  onChange={handleModalChange}
                  className="search-input"
                  style={{ marginTop: 4 }}
                >
                  <option value="available">available</option>
                  <option value="unavailable">unavailable</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </label>

              <label>
                Max Guests
                <input
                  type="number"
                  name="maxGuests"
                  value={modalData.maxGuests || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={modalData.description || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  rows={3}
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Image URLs
                <textarea
                  name="images"
                  value={modalData.images || ""}
                  onChange={handleModalChange}
                  className="search-input"
                  rows={3}
                  style={{ marginTop: 4 }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button className="btn-action btn-delete" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn-action btn-view" onClick={saveModal}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRooms;
