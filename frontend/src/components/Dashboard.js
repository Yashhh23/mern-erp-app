import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({ totalUsers: 0, totalEmployees: 0, totalAdmins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">ERP System</Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/employees" className="nav-link">Employees</Link>
          {user.role === 'admin' && (
            <Link to="/users" className="nav-link">User Management</Link>
          )}
          <button onClick={onLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>
          Welcome back, {user.name}!
        </h1>

        {loading ? (
          <div>Loading dashboard...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalEmployees}</div>
              <div className="stat-label">Employees</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalAdmins}</div>
              <div className="stat-label">Admins</div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#00d4ff' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/employees" className="btn btn-primary">Add Employee</Link>
            {user.role === 'admin' && (
              <Link to="/users" className="btn btn-primary">Manage Users</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;