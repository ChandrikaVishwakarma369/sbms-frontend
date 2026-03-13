import React from "react";
import MainLayout from "../layout/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard.</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
