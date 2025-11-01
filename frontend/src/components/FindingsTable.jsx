import React, { useEffect, useState } from "react";
import { getFindings } from "../services/api";

export default function FindingsTable({ refresh }) {
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    loadFindings();
  }, [refresh]);

  const loadFindings = async () => {
    const res = await getFindings();
    if (res.ok) setFindings(res.data);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">Daftar Findings</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Area</th>
            <th className="border p-2">Judul</th>
            <th className="border p-2">Deskripsi</th>
            <th className="border p-2">Foto</th>
            <th className="border p-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {findings.map(f => (
            <tr key={f.id}>
              <td className="border p-2">{f.id}</td>
              <td className="border p-2">{f.area_name}</td>
              <td className="border p-2">{f.title}</td>
              <td className="border p-2">{f.description}</td>
              <td className="border p-2">
                {f.photo ? <img src={`/api/uploads/${f.photo}`} alt="Foto" className="w-20 h-20 object-cover" /> : "-"}
              </td>
              <td className="border p-2">{f.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
