import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getCumulativeStats } from "../../services/api";
Chart.register(...registerables);

export default function CumulativeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCumulativeStats("2024-07-01", "2024-08-30").then((res) => {
      if (res.ok) setData(res.data);
    });
  }, []);

  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.cumulative);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Problem Safety",
        data: values,
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Grafik Cumulative Problem Safety</h2>
      <Line data={chartData} />
    </div>
  );
}
