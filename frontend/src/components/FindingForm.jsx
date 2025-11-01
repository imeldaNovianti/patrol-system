import React, { useState, useEffect } from "react";
import { createFinding, getAreas } from "../services/api";

export default function FindingForm({ onSuccess }) {
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAreas().then(res => {
      if (res.ok) setAreas(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!areaId || !title || !description) {
      setError("Semua field wajib diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("area_id", areaId);
    formData.append("title", title);
    formData.append("description", description);
    if (photo) formData.append("photo", photo);

    setLoading(true);
    const res = await createFinding(formData);
    setLoading(false);

    if (res.ok) {
      setAreaId(""); setTitle(""); setDescription(""); setPhoto(null);
      setError("");
      onSuccess(); // reload tabel / grafik
    } else {
      setError(res.message || "Gagal menambahkan finding");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Tambah Finding</h2>
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
        <input
          type="text"
          placeholder="Judul Problem"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded-lg p-2"
        />
        <textarea
          placeholder="Deskripsi Problem"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border rounded-lg p-2"
        />
        <input
          type="file"
          onChange={e => setPhoto(e.target.files[0])}
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Finding"}
        </button>
      </form>
    </div>
  );
}
