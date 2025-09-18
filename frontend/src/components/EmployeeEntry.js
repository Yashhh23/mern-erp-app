import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeEntry = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    salary: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, role: 'employee' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Employee added successfully!');
        setFormData({ name: '', email: '', password: '', department: '', position: '', salary: '' });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Add Employee</h1>

        <div className="card">
          {message && (
            <div className={message.includes('success') ? 'alert alert-success' : 'alert alert-error'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Adding Employee...' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEntry;