import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import FindingsPage from "./pages/FindingsPage";
import PatrolsPage from "./pages/PatrolsPage";
import ReportsPage from "./pages/ReportsPage";

function PrivateRoute({ children }) {
  const auth = localStorage.getItem("auth");
  return auth ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={() => window.location.href = '/'} />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/patrols" element={<PrivateRoute><PatrolsPage /></PrivateRoute>} />
        <Route path="/findings" element={<PrivateRoute><FindingsPage /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
