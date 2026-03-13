import React from "react";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full bg-[#0F3A53] px-6 py-3 flex items-center justify-between rounded-xl shadow-lg">
      {/* ---------------- Search Bar ---------------- */}
      <div className="flex items-center bg-[#1A4B67] px-4 py-2 rounded-full w-96 shadow-inner">
        <Search size={18} className="text-gray-300" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-gray-300"
        />
      </div>

      {/* ---------------- Right Side ---------------- */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* User Profile Picture */}
        <div className="cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
        </div>

        {/* ----------------  Login Button ---------------- */}
        <button
          className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-full shadow-lg
             hover:bg-blue-800 hover:scale-105 transition-all duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
