import React from "react";
import { Search, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <div
      className="w-full px-6 py-3 flex items-center justify-between 
    bg-indigo-600 shadow-md rounded-xl"
    >
      {/* Search */}
      <div className="flex items-center bg-indigo-500 px-4 py-2 rounded-full w-80 hover:shadow transition">
        <Search size={18} className="text-indigo-200" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-indigo-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer hover:bg-indigo-700 p-2 rounded-full transition">
          <Bell size={20} className="text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="cursor-pointer hover:bg-indigo-700 p-1 rounded-full transition">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
        </div>

        {/* Sign In */}
        <button className="px-5 py-2 text-sm font-medium text-indigo-600 bg-white rounded-full hover:bg-indigo-700 hover:text-white transition">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Navbar;
