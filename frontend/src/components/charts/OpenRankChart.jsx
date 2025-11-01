import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getFindings } from "../../services/api";

Chart.register(...registerables);

export default function OpenRankChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFindings().then(res => {
      if (res.ok) setData(res.data);
    });
  }, []);

  const counts = {};
  data.forEach(f => { counts[f.area_name] = (counts[f.area_name] || 0) + 1; });

  const chartData = {
    labels: Object.keys(counts),
    datasets: [{
      label: "Jumlah Findings per Area",
      data: Object.values(counts),
      backgroundColor: "rgba(37, 99, 235, 0.6)",
    }],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-2">Grafik Rank Down Findings</h2>
      <Bar data={chartData} />
    </div>
  );
}
