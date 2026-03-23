import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Package,
  Wallet,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  FileDown,
  Printer,
  ChevronRight,
  TrendingDown,
  LayoutDashboard,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const Report = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const themeColor = "#1f4e63";

  // --- Animation Config ---
  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // --- Data & Filtering ---
  const transactions = useMemo(
    () => [
      {
        id: "INV-8821",
        name: "Rahul Traders",
        amt: 59000,
        status: "Paid",
        date: "2026-03-22",
      },
      {
        id: "INV-8822",
        name: "Amit Enterprises",
        amt: 12400,
        status: "Pending",
        date: "2026-03-21",
      },
      {
        id: "INV-8823",
        name: "Zeba Global",
        amt: 8500,
        status: "Overdue",
        date: "2026-03-20",
      },
      {
        id: "INV-8824",
        name: "Suresh & Sons",
        amt: 45000,
        status: "Paid",
        date: "2026-03-19",
      },
    ],
    []
  );

  const filteredTransactions = transactions.filter(
    (t) =>
      (statusFilter === "All" || t.status === statusFilter) &&
      (t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm))
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVars}
      className="min-h-screen bg-[#f1f5f9] text-slate-900 p-4 md:p-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 🚀 1. HEADER SECTION WITH ANIMATION */}
        <motion.div
          variants={itemVars}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutDashboard className="text-[#1f4e63]" /> Business Analytics
              Report
            </h1>
            <p className="text-sm text-gray-500">
              Real-time performance and financial insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm"
            >
              <Printer size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f4e63] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#1f4e63]/20"
            >
              <FileDown size={18} /> Download Report
            </motion.button>
          </div>
        </motion.div>

        {/* 🧩 2. TOP FILTERS */}
        <motion.div
          variants={itemVars}
          className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100/50 rounded-xl px-4 py-2 border border-gray-100">
              <Calendar className="text-gray-400" size={16} />
              <input
                type="date"
                className="bg-transparent text-xs font-bold outline-none text-gray-600"
                defaultValue="2026-03-01"
              />
            </div>
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-100/50 text-xs font-bold rounded-xl px-4 py-2 border border-gray-100 outline-none focus:ring-2 ring-[#1f4e63]/20"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 ring-[#1f4e63]/10 transition-all"
            />
          </div>
        </motion.div>

        {/* 💰 3. STATS CARDS WITH HOVER ANIMATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Revenue",
              val: "₹1,50,000",
              trend: "+12%",
              icon: <Wallet />,
              color: "#1f4e63",
            },
            {
              title: "Expenses",
              val: "₹90,000",
              trend: "+5%",
              icon: <TrendingDown />,
              color: "#e11d48",
            },
            {
              title: "Profit",
              val: "₹60,000",
              trend: "+18%",
              icon: <TrendingUp />,
              color: "#10b981",
            },
            {
              title: "Orders",
              val: "420",
              trend: "+8%",
              icon: <ShoppingCart />,
              color: "#2563eb",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={itemVars}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 text-gray-50 opacity-10 group-hover:scale-110 transition-transform">
                {React.cloneElement(s.icon, { size: 100 })}
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-gray-50 text-gray-700 shadow-inner">
                  {s.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                  {s.trend}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">
                {s.title}
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1 relative z-10">
                {s.val}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* 📊 4. ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            variants={itemVars}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-800">Revenue Trajectory</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1f4e63]"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Monthly Growth
                </span>
              </div>
            </div>
            <div className="h-72">
              <Line
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      data: [12000, 19000, 15000, 25000, 22000, 30000],
                      borderColor: themeColor,
                      backgroundColor: "rgba(31, 78, 99, 0.05)",
                      fill: true,
                      tension: 0.4,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center"
          >
            <h3 className="font-bold text-gray-800 self-start mb-6">
              Payment Distribution
            </h3>
            <div className="relative w-48 h-48 mb-6">
              <Doughnut
                data={{
                  labels: ["Paid", "Pending", "Overdue"],
                  datasets: [
                    {
                      data: [70, 20, 10],
                      backgroundColor: [themeColor, "#f59e0b", "#ef4444"],
                      borderWidth: 4,
                      borderColor: "#fff",
                    },
                  ],
                }}
                options={{
                  cutout: "80%",
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">70%</span>
                <span className="text-[10px] text-green-500 font-black">
                  STABLE
                </span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-bold p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1f4e63]"></div>{" "}
                  Collected
                </span>
                <span className="text-[#1f4e63]">₹1,05,000</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🧾 5. ANIMATED TABLE */}
        <motion.div
          variants={itemVars}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest bg-gray-50/50">
                  <th className="px-8 py-4">Invoice</th>
                  <th className="py-4">Client</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Status</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredTransactions.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="hover:bg-[#1f4e63]/5 transition-colors group cursor-default"
                    >
                      <td className="px-8 py-4 text-sm font-bold text-[#1f4e63]">
                        {t.id}
                      </td>
                      <td className="py-4 text-sm font-semibold text-gray-700">
                        {t.name}
                      </td>
                      <td className="py-4 text-sm font-bold text-gray-900">
                        ₹{t.amt.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded-md ${
                            t.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : t.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-xs font-bold text-gray-400 text-right group-hover:text-[#1f4e63] transition-colors">
                        {t.date}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ⚠️ 6. SMART INSIGHT CARD */}
        <motion.div
          variants={itemVars}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-[#1f4e63] to-[#2c6e8a] p-6 rounded-2xl shadow-xl text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Smart Recommendation</h4>
              <p className="text-xs text-white/80">
                3 Overdue invoices detected. We suggest sending automated
                reminders today.
              </p>
            </div>
          </div>
          <button className="bg-white text-[#1f4e63] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
            Take Action <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Report;
