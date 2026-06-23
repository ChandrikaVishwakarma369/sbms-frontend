import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RecentOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://sbms-backend.onrender.com/api/orders?limit=5");
        const result = await response.json();
        if (result.success) {
          setOrders(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const chartData = {
    labels: ["Delivered", "Pending", "Cancelled", "Shipped"],
    datasets: [
      {
        data: [
          orders.filter((o) => o.status === "Delivered").length,
          orders.filter((o) => o.status === "Pending").length,
          orders.filter((o) => o.status === "Cancelled").length,
          orders.filter((o) => o.status === "Shipped").length,
        ],
        backgroundColor: ["#16a34a", "#facc15", "#ef4444", "#3b82f6"],
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
        labels: {
          boxWidth: 10,
          font: { size: 10 },
        },
      },
    },
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    if (status === "Shipped") return "text-blue-600";
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] tracking-wider">
              <th className="text-left py-3 px-2 font-medium">ID</th>
              <th className="text-left py-3 px-2 font-medium">Customer</th>
              <th className="text-left py-3 px-2 font-medium">Product</th>
              <th className="text-left py-3 px-2 font-medium">Status</th>
              <th className="text-right py-3 px-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-red-400">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id || index}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-3 px-2 text-gray-400 font-medium whitespace-nowrap">
                    #{order.orderId}
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-700 whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="py-3 px-2 text-gray-500 max-w-[100px] truncate">
                    {order.product}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`${statusColor(order.status)} font-medium whitespace-nowrap`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-800 whitespace-nowrap">
                    ₹{order.amount?.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;