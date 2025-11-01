import React, { useState, useEffect } from "react";
import { createPatrol, getAreas } from "../services/api";

export default function PatrolForm({ onSuccess }) {
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAreas().then(res => {
      if (res.ok) setAreas(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!areaId || !notes) {
      setError("Semua field wajib diisi!");
      return;
    }

    setLoading(true);
    const res = await createPatrol({ area_id: areaId, notes });
    setLoading(false);

    if (res.ok) {
      setAreaId(""); setNotes(""); setError("");
      onSuccess(); // reload tabel jika perlu
    } else {
      setError(res.message || "Gagal menambahkan patrol");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Tambah Patrol</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          value={areaId}
          onChange={e => setAreaId(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">-- Pilih Area --</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
        <textarea
          placeholder="Catatan Patrol"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Patrol"}
        </button>
      </form>
    </div>
  );
}
