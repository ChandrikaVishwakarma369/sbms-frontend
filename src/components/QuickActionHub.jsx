import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, FileText, PlusCircle, ArrowUpRight } from "lucide-react";

const QuickActionHub = () => {
  const navigate = useNavigate();
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  const allActions = [
    {
      label: "Add Customer",
      desc: "Register new clients",
      icon: <Users size={22} />,
      bg: "bg-blue-50",
      text: "text-blue-700",
      path: "/customers",
      requiredAdmin: false,
    },
    {
      label: "Create Invoice",
      desc: "Generate new billing",
      icon: <FileText size={22} />,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      path: "/invoices",
      requiredAdmin: false,
    },
    {
      label: "Add Product",
      desc: "Manage your stock",
      icon: <PlusCircle size={22} />,
      bg: "bg-orange-50",
      text: "text-orange-700",
      path: "/products",
      requiredAdmin: true,
    },
  ];

  // Filter actions based on role
  const actions = allActions.filter(action => !action.requiredAdmin || isAdmin);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* SalesChart jaisa Header style */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Quick Actions Hub
          </h2>
          <p className="text-sm text-gray-400">
            Manage your daily tasks quickly
          </p>
        </div>

        {/* SalesChart jaisa badge style */}
        <div className="bg-blue-50 text-blue-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
          Fast Access
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl cursor-pointer transition-all hover:shadow-md hover:border-gray-200 group"
          >
            <div className="flex items-center gap-4">
              {/* Icon container */}
              <div
                className={`p-3 rounded-xl ${action.bg} ${action.text} transition-transform duration-300 group-hover:scale-110`}
              >
                {action.icon}
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-800">
                  {action.label}
                </p>
                <p className="text-xs text-gray-400">{action.desc}</p>
              </div>
            </div>

            <div className="text-gray-300 group-hover:text-gray-600 transition-colors">
              <ArrowUpRight size={18} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionHub;