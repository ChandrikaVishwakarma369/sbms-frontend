import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const PendingPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const response = await fetch("https://sbms-backend.onrender.com/api/invoices/pending", {
          headers: {
            // Add credentials if needed, but assuming cookie-based auth is handled by browser
          },
        });
        const result = await response.json();
        if (result.success) {
          setPayments(result.data.invoices);
          setTotalPending(result.data.totalPending);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

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
        <h3 className="text-2xl font-bold text-red-500">
          ₹{loading ? "..." : totalPending.toLocaleString()}
        </h3>
      </div>

      {/* ---------------Customer List-------------- */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-4">Loading payments...</p>
        ) : error ? (
          <p className="text-center text-red-400 text-sm py-4">{error}</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">No pending payments</p>
        ) : (
          payments.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {item.customer}
                </p>
                <p className="text-xs text-gray-400">Due: {item.dueDate}</p>
              </div>
              <span className="font-semibold text-red-500">
                ₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingPayments;