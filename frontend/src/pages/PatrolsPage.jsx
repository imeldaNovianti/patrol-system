import React, { useState } from "react";
import NavBar from "../components/NavBar";
import PatrolForm from "../components/PatrolForm";

export default function PatrolsPage() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Patrols Page</h1>
        <PatrolForm onSuccess={handleRefresh} />
        {/* Bisa ditambah tabel Patrol jika backend menyediakan */}
      </div>
    </div>
  );
}
