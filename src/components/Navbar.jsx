import React from "react";
import { Bell, Search, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#0F3A53] px-6 py-3 flex items-center justify-between rounded-xl shadow-lg border border-white/10">
      {/* ---------------- Search Bar ---------------- */}
      <div className="flex items-center bg-[#1A4B67] px-4 py-2 rounded-full w-96 shadow-inner border border-white/5">
        <Search size={18} className="text-white" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-white/60 font-medium"
        />
      </div>

      {/* ---------------- Right Side ---------------- */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <Bell size={22} className="text-white" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#0F3A53]">
            3
          </span>
        </div>

        {/* User Profile Picture */}
        <div className="cursor-pointer hover:ring-2 hover:ring-white/50 rounded-full transition-all">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
        </div>

        {/* ---------------- Login Button  ---------------- */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-6 py-2 bg-white text-[#0F3A53] font-bold rounded-full shadow-[0_4px_15px_rgba(255,255,255,0.1)]
                     hover:bg-blue-50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 
                     active:scale-95 transition-all duration-200 text-sm"
        >
          <LogIn size={16} />
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
