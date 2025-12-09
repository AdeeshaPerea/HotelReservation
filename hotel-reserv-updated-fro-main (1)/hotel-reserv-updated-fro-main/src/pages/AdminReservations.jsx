// AdminReservations.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Protect admin route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const role = (localStorage.getItem('role') || '').toUpperCase();

    if (!isLoggedIn || role !== 'ADMIN') {
      alert('Access denied. Please log in as admin.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios
          .get('http://localhost:8003/reservation/all')
          .catch(() => ({ data: [] }));
        setReservations(response.data || []);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((res) => {
    const t = searchTerm.toLowerCase();
    return (
      res.id?.toString().includes(t) ||
      res.userId?.toString().includes(t) ||
      res.status?.toLowerCase().includes(t)
    );
  });

  // Delete reservation  ✅ fixed URL + state
  const deleteReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8003/reservation/delete/${reservationId}`
      );
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      alert('Reservation deleted successfully');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation');
    }
  };

  // Start editing
  const startEdit = (reservation) => {
    setEditingId(reservation.id);

    // Normalize dates to yyyy-MM-dd
    const normalized = { ...reservation };
    if (normalized.checkIn && normalized.checkIn.includes('T')) {
      normalized.checkIn = normalized.checkIn.split('T')[0];
    }
    if (normalized.checkOut && normalized.checkOut.includes('T')) {
      normalized.checkOut = normalized.checkOut.split('T')[0];
    }

    setEditData(normalized);
  };

  // Save edit  ✅ fixed URL + payload
  const saveEdit = async () => {
    try {
      const payload = { ...editData };

      // Ensure dates are acceptable by backend (often LocalDate or LocalDateTime)
      if (payload.checkIn && !payload.checkIn.includes('T')) {
        payload.checkIn = `${payload.checkIn}T00:00:00`;
      }
      if (payload.checkOut && !payload.checkOut.includes('T')) {
        payload.checkOut = `${payload.checkOut}T00:00:00`;
      }

      // Make sure totalPrice is a number
      if (payload.totalPrice !== undefined && payload.totalPrice !== null) {
        payload.totalPrice = Number(payload.totalPrice);
      }

      const response = await axios.put(
        `http://localhost:8003/reservation/update/${editingId}`,
        payload
      );

      const updated = response.data || payload;

      setReservations((prev) =>
        prev.map((r) => (r.id === editingId ? updated : r))
      );
      setEditingId(null);
      setEditData({});
      alert('Reservation updated successfully');
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Reservation Management</h1>
            <button
              className="admin-logout-btn"
              onClick={() => navigate('/admin')}
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
          <h1>Reservation Management</h1>
          <button
            className="admin-logout-btn"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <h2>All Reservations</h2>
          <div className="search-filter">
            <input
              type="text"
              className="search-input"
              placeholder="Search by reservation ID, user ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredReservations.length === 0 ? (
            <div className="empty-state">
              <p>No reservations found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>User ID</th>
                  <th>Room ID</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id}</td>
                    <td>{reservation.userId}</td>
                    <td>{reservation.roomId}</td>

                    {/* Check-In */}
                    <td>
                      {editingId === reservation.id ? (
                        <input
                          type="date"
                          value={
                            editData.checkIn ||
                            reservation.checkIn?.split('T')[0] ||
                            ''
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              checkIn: e.target.value,
                            })
                          }
                          className="search-input"
                          style={{ width: '100%', padding: '5px' }}
                        />
                      ) : reservation.checkIn ? (
                        new Date(reservation.checkIn).toLocaleDateString()
                      ) : (
                        'N/A'
                      )}
                    </td>

                    {/* Check-Out */}
                    <td>
                      {editingId === reservation.id ? (
                        <input
                          type="date"
                          value={
                            editData.checkOut ||
                            reservation.checkOut?.split('T')[0] ||
                            ''
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              checkOut: e.target.value,
                            })
                          }
                          className="search-input"
                          style={{ width: '100%', padding: '5px' }}
                        />
                      ) : reservation.checkOut ? (
                        new Date(reservation.checkOut).toLocaleDateString()
                      ) : (
                        'N/A'
                      )}
                    </td>

                    {/* Price */}
                    <td>
                      {editingId === reservation.id ? (
                        <input
                          type="number"
                          value={editData.totalPrice ?? reservation.totalPrice ?? ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              totalPrice: e.target.value,
                            })
                          }
                          className="search-input"
                          style={{ width: '100%', padding: '5px' }}
                        />
                      ) : reservation.totalPrice != null ? (
                        'Rs ' + reservation.totalPrice
                      ) : (
                        'N/A'
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      {editingId === reservation.id ? (
                        <select
                          value={editData.status || reservation.status || 'PENDING'}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status: e.target.value,
                            })
                          }
                          className="search-input"
                          style={{ width: '100%', padding: '5px' }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      ) : (
                        <span
                          className={`status-badge status-${
                            reservation.status?.toLowerCase() || 'pending'
                          }`}
                        >
                          {reservation.status || 'PENDING'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons">
                        {editingId === reservation.id ? (
                          <>
                            <button
                              className="btn-action btn-view"
                              onClick={saveEdit}
                            >
                              Save
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => startEdit(reservation)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() =>
                                deleteReservation(reservation.id)
                              }
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReservations;
