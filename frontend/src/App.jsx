import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportList from './pages/ReportList';
import ReportForm from './pages/ReportForm';
import ReportDetail from './pages/ReportDetail';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated() && <NavBar />}
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated() ? <ReportList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/report-form" 
              element={isAuthenticated() ? <ReportForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/report/:id" 
              element={isAuthenticated() ? <ReportDetail /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;