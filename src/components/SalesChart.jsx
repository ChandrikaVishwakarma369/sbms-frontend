import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({ labels: [], revenue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/sales")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setChartData(res.data);
        } else {
          setError("Failed to load data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setError("Connection error");
        setLoading(false);
      });
  }, []);

  const data = {
    labels: chartData.labels.length > 0 ? chartData.labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales",
        data: chartData.revenue.length > 0 ? chartData.revenue : [0, 0, 0, 0, 0, 0],
        borderColor: "#1f4e63",
        backgroundColor: "rgba(31,78,99,0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1f4e63",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 6,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          callback: function (value) {
            return "₹" + value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* --------------Header--------------- */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Sales Overview
          </h2>

          <p className="text-sm text-gray-400">Last 6 months performance</p>
        </div>

        <div className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
          {loading ? "Loading..." : error ? error : "+12% Growth"}
        </div>
      </div>

      {/* ----------------Chart-------------- */}
      <div className="h-52">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;