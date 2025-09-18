import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setMessage('User deleted successfully');
        setUsers(users.filter(u => u._id !== userId));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete user');
      }
    } catch (error) {
      setMessage('Failed to delete user');
    }
  };

  if (user.role !== 'admin') {
    return (
      <div className="container">
        <h2 style={{ color: '#ff4757' }}>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">ERP System</Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/employees" className="nav-link">Employees</Link>
          <Link to="/users" className="nav-link">User Management</Link>
          <button onClick={onLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>User Management</h1>

        {message && (
          <div className={message.includes('success') ? 'alert alert-success' : 'alert alert-error'}>
            {message}
          </div>
        )}

        <div className="card">
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{ 
                        color: user.role === 'admin' ? '#00d4ff' : '#2ecc71',
                        fontWeight: 'bold'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.department || '-'}</td>
                    <td>{user.position || '-'}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
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
};

export default UserManagement;