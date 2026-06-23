import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Calendar,
} from "lucide-react";

// Components Imports
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import LowStockAlert from "../components/LowStockAlert";
import RecentInvoicesTable from "../components/RecentInvoicesTable";
import PendingPayments from "../components/PendingPayments";
import QuickActionHub from "../components/QuickActionHub";

const iconMap = {
  Users: <Users size={24} />,
  ShoppingCart: <ShoppingCart size={24} />,
  Package: <Package size={24} />,
  BarChart3: <BarChart3 size={24} />,
};

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    fetch("https://sbms-backend.onrender.com/api/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const data = res.data;
          setStatsData([
            {
              title: "Total Customers",
              value: data.totalCustomers.toLocaleString(),
              change: "+12% since last week",
              icon: "Users",
            },
            {
              title: "Orders",
              value: data.totalOrders.toLocaleString(),
              change: "+8% since yesterday",
              icon: "ShoppingCart",
            },
            {
              title: "Products",
              value: data.totalProducts.toLocaleString(),
              change: "-2% since last month",
              icon: "Package",
            },
            {
              title: "Total Employees",
              value: data.totalEmployees.toLocaleString(),
              change: "+2% since last month",
              icon: "Users",
            },
          ]);
        }
      })
      .catch((err) => console.error("Error loading stats data:", err));
  }, []);

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-8 space-y-8">
      {/* 🔹 1. Header Section - UPDATED TO MATCH SALESCHART STYLE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
        <div className="flex justify-between items-center">
          <div>
            {/* Chart jaisa font style aur color */}
            <h2 className="text-lg font-semibold text-gray-800">
              Dashboard Overview
            </h2>
            {/* Chart jaisa subtitle style */}
            <p className="text-sm text-gray-400">
              Welcome back to your business control center.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full">
            <Calendar size={14} />
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* 🔹 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={iconMap[item.icon]}
          />
        ))}
      </div>

      {/* 🔹 3. Charts & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <RecentInvoicesTable />
        </div>
      </div>

      {/* 🔹 4. Quick Action Hub */}
      <QuickActionHub />

      {/* 🔹 5. Bottom Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        <div className="sm:col-span-2 lg:col-span-1">
           <PendingPayments />
        </div>
        <RecentOrdersTable />
        <LowStockAlert />
      </div>
    </div>
  );
};

export default Dashboard;