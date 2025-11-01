import React, { useState } from "react";
import { axios } from "../services/api";

export default function KaizenForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Semua field wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/kaizen_create.php", { title, description });
      if (res.data.ok) {
        setTitle(""); setDescription(""); setError("");
        onSuccess();
      } else setError(res.data.message || "Gagal submit kaizen");
    } catch (err) {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Tambah Kaizen</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Judul Kaizen"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded-lg p-2"
        />
        <textarea
          placeholder="Deskripsi Kaizen"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Kaizen"}
        </button>
      </form>
    </div>
  );
}
