import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Safety Patrol System</h1>
      </div>
      <div className="navbar-menu">
        <button 
          className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-btn ${isActive('/reports') ? 'active' : ''}`}
          onClick={() => navigate('/reports')}
        >
          Reports
        </button>
        <button 
          className={`nav-btn ${isActive('/report-form') ? 'active' : ''}`}
          onClick={() => navigate('/report-form')}
        >
          New Report
        </button>
      </div>
      <div className="navbar-user">
        <span>Welcome, {user.fullname || user.username}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}