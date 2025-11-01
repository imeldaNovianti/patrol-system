import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-blue-700 text-white flex justify-between px-6 py-3">
      <div className="font-semibold">Safety Patrol System</div>
      <div className="flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/patrols">Patrol</Link>
        <Link to="/findings">Findings</Link>
        <Link to="/reports">Laporan</Link>
        <button
          onClick={() => { localStorage.removeItem("auth"); window.location.href = "/login"; }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
