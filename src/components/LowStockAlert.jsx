import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const LowStockAlert = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/low-stock");
        const result = await response.json();
        if (result.success) {
          setProducts(result.products);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch low stock alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const data = {
    labels: products.length > 0 ? products.map((p) => p.name) : ["No alerts"],
    datasets: [
      {
        data: products.length > 0 ? products.map((p) => p.stock) : [1],
        backgroundColor: products.length > 0 ? ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6366f1", "#ec4899", "#8b5cf6"] : ["#f3f4f6"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: { size: 10 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (products.length === 0) return "All products in stock";
            return `${context.label}: ${context.raw} left`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      {/* -------------Header ---------------*/}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-800">Low Stock Alert</h2>

        <span className="flex items-center gap-1 text-xs text-[#1f4e63] bg-[#e8f2f6] px-2 py-1 rounded-full">
          <AlertTriangle size={14} />
          {loading ? "..." : products.length}
        </span>
      </div>

      {/*--------------- Pie Chart------------------ */}
      <div className="h-60 flex justify-center items-center">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : products.length === 0 ? (
          <div className="text-center">
            <p className="text-green-500 font-medium">No alerts</p>
            <p className="text-[10px] text-gray-400">Stock is healthy</p>
          </div>
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;