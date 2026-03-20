import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import LowStockAlert from "../components/LowStockAlert";
import RecentInvoicesTable from "../components/RecentInvoicesTable";
import PendingPayments from "../components/PendingPayments";
import { Users, ShoppingCart, Package, BarChart3 } from "lucide-react";

const iconMap = {
  Users: <Users size={24} />,
  ShoppingCart: <ShoppingCart size={24} />,
  Package: <Package size={24} />,
  BarChart3: <BarChart3 size={24} />,
};

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    fetch("/mock/statsData.json")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Error loading stats data:", err));
  }, []);

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
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

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <RecentInvoicesTable />
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-3 gap-6">
          <PendingPayments />
          <RecentOrdersTable />
          <LowStockAlert />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;