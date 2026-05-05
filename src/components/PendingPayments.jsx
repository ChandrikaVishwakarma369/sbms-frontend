import React from "react";
import { AlertCircle } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PendingPayments = () => {
  const payments = [
    { customer: "Rahul Traders", amount: 5900, dueDate: "15 Mar 2025" },
    { customer: "Sharma Electronics", amount: 4300, dueDate: "18 Mar 2025" },
    { customer: "Verma Enterprises", amount: 7200, dueDate: "20 Mar 2025" },
    { customer: "Amit Enterprises", amount: 3200, dueDate: "22 Mar 2025" },
  ];

  // ⭐ Total Pending
  const totalPending = payments.reduce((sum, p) => sum + p.amount, 0);

  const chartData = {
    labels: payments.map((p) => p.customer.split(" ")[0]),
    datasets: [
      {
        label: "Pending ₹",
        data: payments.map((p) => p.amount),
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      {/* -------------Header------------ */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-800">
          Pending Payments
        </h2>

        <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
          <AlertCircle size={14} />
          {payments.length}
        </span>
      </div>

      {/* ⭐ Total Pending */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500">Total Pending Amount</p>

        <h3 className="text-2xl font-bold text-red-500">₹{totalPending}</h3>
      </div>

      {/* ---------------Customer List-------------- */}
      <div className="space-y-3">
        {payments.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">
                {item.customer}
              </p>

              <p className="text-xs text-gray-400">Due: {item.dueDate}</p>
            </div>

            <span className="font-semibold text-red-500">₹{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPayments;