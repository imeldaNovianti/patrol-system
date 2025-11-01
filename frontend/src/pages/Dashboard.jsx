import React from "react";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Safety System</h1>
        <p>Selamat datang, Admin 👋</p>
        <p>Gunakan menu di atas untuk mengelola Patrol, Findings, dan Laporan.</p>
      </div>
    </div>
  );
}
