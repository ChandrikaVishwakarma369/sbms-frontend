import React from "react";
import { AlertTriangle } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const LowStockAlert = () => {
  const products = [
    { name: "Mouse", stock: 5 },
    { name: "Keyboard", stock: 3 },
    { name: "Monitor", stock: 2 },
    { name: "USB Cable", stock: 4 },
  ];

  const data = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        data: products.map((p) => p.stock),
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
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
          {products.length}
        </span>
      </div>

      {/*--------------- Pie Chart------------------ */}
      <div className="h-60 flex justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default LowStockAlert;
