import React from "react";
import { CheckCircle, Clock } from "lucide-react";

const RecentInvoices = () => {
  const invoices = [
    {
      id: "INV001",
      customer: "Rahul Traders",
      amount: "₹5900",
      status: "Pending",
      date: "10 Mar",
    },
    {
      id: "INV002",
      customer: "Amit Enterprises",
      amount: "₹7200",
      status: "Paid",
      date: "11 Mar",
    },
    {
      id: "INV003",
      customer: "Sharma Electronics",
      amount: "₹4300",
      status: "Pending",
      date: "12 Mar",
    },
    {
      id: "INV004",
      customer: "Prachi Electronics",
      amount: "₹5300",
      status: "Pending",
      date: "12 Mar",
    },
    {
      id: "INV005",
      customer: "Sharma Electronics",
      amount: "₹4300",
      status: "Pending",
      date: "12 Mar",
    },
    {
      id: "INV006",
      customer: "Ravi Traders",
      amount: "₹6100",
      status: "Paid",
      date: "13 Mar",
    },
    {
      id: "INV007",
      customer: "Kumar Supplies",
      amount: "₹5200",
      status: "Pending",
      date: "14 Mar",
    },
    {
      id: "INV008",
      customer: "Tech World",
      amount: "₹8300",
      status: "Paid",
      date: "15 Mar",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/*--------------- Header -------------*/}
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Recent Invoices
      </h2>
      <div className="relative pl-6 h-52 overflow-y-auto">
        <div className="absolute left-2 top-1 bottom-1 w-[2px] bg-gray-200"></div>
        <div className="space-y-4 pr-2">
          {invoices.map((invoice, index) => (
            <div
              key={index}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentInvoices;
