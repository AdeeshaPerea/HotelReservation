// Admin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect admin route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const role = (localStorage.getItem('role') || '').toUpperCase();

    if (!isLoggedIn || role !== 'ADMIN') {
      alert('Access denied. Please log in as admin.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [usersRes, roomsRes, reservationsRes] = await Promise.all([
          axios.get('http://localhost:8001/user/all').catch(() => ({ data: [] })),
          axios.get('http://localhost:8002/room/all').catch(() => ({ data: [] })),
          axios.get('http://localhost:8003/reservation/all').catch(() => ({ data: [] }))
        ]);

        setUsers(usersRes.data || []);
        setRooms(roomsRes.data || []);
        setReservations(reservationsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear admin-specific
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminEmail');

    // Clear general auth
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="loading-spinner">
          <div className="spinner-animation"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon users">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p>{users.length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>Active members</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rooms">🏨</div>
            <div className="stat-content">
              <h3>Total Rooms</h3>
              <p>{rooms.length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>Available rooms</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reservations">📅</div>
            <div className="stat-content">
              <h3>Total Reservations</h3>
              <p>{reservations.length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>All bookings</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reservations" style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' }}>✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p>{reservations.filter(r => r.status === 'COMPLETED').length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>Finished bookings</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reservations" style={{ background: 'rgba(255, 152, 0, 0.2)', color: '#ff9800' }}>⏳</div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p>{reservations.filter(r => r.status === 'PENDING').length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>Awaiting confirmation</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reservations" style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}>❌</div>
            <div className="stat-content">
              <h3>Cancelled</h3>
              <p>{reservations.filter(r => r.status === 'CANCELLED').length}</p>
              <small style={{ color: '#999', fontSize: '12px' }}>Cancelled bookings</small>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="admin-tabs">
          <button
            className="tab-btn active"
            onClick={() => navigate('/admin/users')}
          >
            👥 Manage Users ({users.length})
          </button>
          <button
            className="tab-btn active"
            onClick={() => navigate('/admin/rooms')}
          >
            🏨 Manage Rooms ({rooms.length})
          </button>
          <button
            className="tab-btn active"
            onClick={() => navigate('/admin/reservations')}
          >
            📅 Manage Reservations ({reservations.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <div>
            <h2>Welcome to Admin Dashboard</h2>
            <p>Use the buttons above to manage users, rooms, and reservations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
