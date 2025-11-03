import React, { useState } from "react";
import NavBar from "../components/NavBar";
import PatrolForm from "../components/PatrolForm";

export default function PatrolsPage() {
  // Jika state 'refresh' digunakan untuk memicu re-render child setelah submit
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Patrols Page</h1>

        {/* Form untuk menambah/update patrol */}
        <PatrolForm onSuccess={handleRefresh} refresh={refresh} />

        {/* Placeholder untuk tabel Patrol jika backend menyediakan */}
        <div className="mt-6">
          <p className="text-gray-500 text-sm">
            Tabel Patrol bisa ditampilkan di sini jika backend sudah tersedia.
          </p>
        </div>
      </main>
    </div>
  );
}
