import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* -------------Sidebar (Mobile Overlay)-------------*/}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* -------------Sidebar-------------*/}
      <div className={`
        fixed md:relative z-50 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "left-0" : "-left-64 md:left-0"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* -----------Main--------------  */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ----------Navbar----------- */}
        <div className="flex-none mt-4 px-4 md:px-6">
          <Navbar onMenuClick={toggleSidebar} />
        </div>

        {/* ------------content area-------------- */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;