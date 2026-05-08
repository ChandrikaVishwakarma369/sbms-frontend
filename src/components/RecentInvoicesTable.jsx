import React, { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";

const RecentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/invoices?limit=5");
        const result = await response.json();
        if (result.success) {
          const formatted = result.data.map((inv) => ({
            id: inv.invoiceId,
            customer: inv.customerName,
            amount: `₹${inv.total.toLocaleString()}`,
            status: inv.status.charAt(0) + inv.status.slice(1).toLowerCase(),
            date: new Date(inv.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            }),
          }));
          setInvoices(formatted);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/*--------------- Header -------------*/}
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Recent Invoices
      </h2>
      <div className="relative pl-6 h-52 overflow-y-auto">
        <div className="absolute left-2 top-1 bottom-1 w-[2px] bg-gray-200"></div>
        <div className="space-y-4 pr-2">
          {loading ? (
            <p className="text-xs text-gray-400 py-4">Loading invoices...</p>
          ) : error ? (
            <p className="text-xs text-red-400 py-4">{error}</p>
          ) : invoices.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No recent invoices</p>
          ) : (
            invoices.map((invoice, index) => (
              <div
                key={invoice.id || index}
                className="relative flex justify-between items-center"
              >
                {/*------------- Left side------------- */}
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {invoice.customer}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {invoice.id} • {invoice.date}
                  </p>
                </div>

                {/* -----------------Right side-------------- */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {invoice.amount}
                  </p>

                  <span
                    className={`flex items-center gap-1 text-xs mt-1 justify-end ${
                      invoice.status === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {invoice.status === "Paid" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}

                    {invoice.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentInvoices;