import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RecentOrdersTable = () => {
  const orders = [
    {
      id: "#1023",
      customer: "John",
      product: "Laptop",
      status: "Delivered",
      price: "$1200",
    },
    {
      id: "#1024",
      customer: "Emma",
      product: "Shoes",
      status: "Pending",
      price: "$120",
    },
    {
      id: "#1025",
      customer: "Alex",
      product: "Phone",
      status: "Cancelled",
      price: "$500",
    },
  ];

  const chartData = {
    labels: ["Delivered", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          orders.filter((o) => o.status === "Delivered").length,
          orders.filter((o) => o.status === "Pending").length,
          orders.filter((o) => o.status === "Cancelled").length,
        ],
        backgroundColor: ["#16a34a", "#facc15", "#ef4444"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    cutout: "50%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-md font-semibold mb-4 text-gray-800">
        Recent Orders
      </h2>

      {/* -------------Chart-------------- */}
      <div className="flex justify-center mb-4">
        <div className="w-40 h-40">
          {" "}
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* --------------Table------------ */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="text-left py-2">ID</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Product</th>
            <th className="text-left">Status</th>
            <th className="text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className="border-b last:border-none hover:bg-gray-50"
            >
              <td className="py-2">{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td className={statusColor(order.status)}>{order.status}</td>
              <td>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;
