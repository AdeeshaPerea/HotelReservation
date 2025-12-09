// AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  // Protect admin route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const role = (localStorage.getItem('role') || '').toUpperCase();

    if (!isLoggedIn || role !== 'ADMIN') {
      alert('Access denied. Please log in as admin.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8001/user/all');
        console.log('AdminUsers: fetched users from API:', response.data);
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // no fake data
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      // adjust URL if your backend uses another path
      await axios.delete(`http://localhost:8001/user/delete/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Open modal for editing
  const startEdit = (user) => {
    setEditingId(user.id);
    const normalized = { ...user };

    // Normalize birthday to yyyy-mm-dd for <input type="date">
    if (normalized.birthday && normalized.birthday.includes('T')) {
      normalized.birthday = normalized.birthday.split('T')[0];
    }

    setModalData(normalized);
    setShowModal(true);
  };

  // Save edit from modal
  const saveModalEdit = async () => {
    try {
      const payload = { ...modalData };

      // keep birthday as yyyy-MM-dd (good for Spring LocalDate)
      if (payload.birthday && payload.birthday.includes('T')) {
        payload.birthday = payload.birthday.split('T')[0];
      }

      // if password is empty, don't send it (so backend keeps old password)
      if (!payload.password) {
        delete payload.password;
      }

      // adjust URL if your backend uses another path
      const response = await axios.put(
        `http://localhost:8001/user/update/${editingId}`,
        payload
      );

      const updatedUser = response.data || payload;

      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...updatedUser } : u))
      );

      setShowModal(false);
      setEditingId(null);
      setModalData({});
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setModalData({});
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <h1>User Management</h1>
            <button className="admin-logout-btn" onClick={() => navigate('/admin')}>
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
          <h1>User Management</h1>
          <button className="admin-logout-btn" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <h2>All Users</h2>
          <div className="search-filter">
            <input
              type="text"
              className="search-input"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Address</th>
                    <th>Telephone</th>
                    <th>Birthday</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.firstName || 'N/A'}</td>
                      <td>{user.lastName || 'N/A'}</td>
                      <td>{user.email}</td>
                      <td>{'••••••••'}</td>
                      <td>{user.address || 'N/A'}</td>
                      <td>{user.telephone || 'N/A'}</td>
                      <td>
                        {user.birthday
                          ? new Date(user.birthday).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${
                            user.role?.toLowerCase() || 'user'
                          }`}
                        >
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => startEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => deleteUser(user.id)}
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

      {/* Modal edit form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
            <h3>Edit User</h3>

            <div style={{ display: 'grid', gap: 12 }}>
              <label>
                Username
                <input
                  type="text"
                  value={modalData.username || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, username: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                First Name
                <input
                  type="text"
                  value={modalData.firstName || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, firstName: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  value={modalData.lastName || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, lastName: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={modalData.email || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, email: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Password (leave blank to keep current)
                <input
                  type="password"
                  value={modalData.password || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, password: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Address
                <input
                  type="text"
                  value={modalData.address || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, address: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Telephone
                <input
                  type="tel"
                  value={modalData.telephone || ''}
                  onChange={(e) =>
                    setModalData({ ...modalData, telephone: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Birthday
                <input
                  type="date"
                  value={
                    modalData.birthday && modalData.birthday.includes('T')
                      ? modalData.birthday.split('T')[0]
                      : modalData.birthday || ''
                  }
                  onChange={(e) =>
                    setModalData({ ...modalData, birthday: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                />
              </label>

              <label>
                Role
                <select
                  value={modalData.role || 'USER'}
                  onChange={(e) =>
                    setModalData({ ...modalData, role: e.target.value })
                  }
                  className="search-input"
                  style={{ marginTop: 4 }}
                >
                  <option>USER</option>
                  <option>ADMIN</option>
                  <option>MANAGER</option>
                </select>
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'flex-end',
                  marginTop: 16,
                }}
              >
                <button className="btn-action btn-delete" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn-action btn-view" onClick={saveModalEdit}>
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

export default AdminUsers;
