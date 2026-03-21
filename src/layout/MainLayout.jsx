import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* -------------Sidebar-------------*/}
      <div className="flex-none">
        <Sidebar />
      </div>

      {/* -----------Main--------------  */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {/* ----------Navbar----------- */}
        <div className="flex-none mt-4 px-4">
          {" "}
          <Navbar />
        </div>

        {/* ------------content area-------------- */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
