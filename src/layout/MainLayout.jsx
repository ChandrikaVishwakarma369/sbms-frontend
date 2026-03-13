import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Navbar />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
