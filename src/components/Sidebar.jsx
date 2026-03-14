import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, active: true },
    { name: "Products", icon: <Package size={18} /> },
    { name: "Orders", icon: <ShoppingCart size={18} /> },
    { name: "Customers", icon: <Users size={18} /> },
    { name: "Invoices", icon: <FileText size={18} /> },
    { name: "Employees", icon: <UserCog size={18} /> },
    { name: "Reports", icon: <BarChart3 size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-100 flex items-center justify-center">
      <div className="bg-[#0F3A53] w-56 h-[95%] rounded-2xl p-6 flex flex-col justify-between">
        {/* ---------------- Logo Section ---------------- */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-cyan-300/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-200/50 to-blue-200/50 flex items-center justify-center shadow-inner backdrop-blur-sm">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center font-bold text-[#0F3A53] text-sm">
                    SB
                  </div>
                </div>
              </div>
            </div>
            {/* Brand Name */}
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold tracking-wide text-lg">
                SBMS
              </span>
              <span className="text-xs text-gray-300">Smart Business</span>
            </div>
          </div>

          {/* ---------------- Menu Items ---------------- */}
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm ${
                  item.active
                    ? "bg-white text-[#0F3A53]"
                    : "text-gray-300 hover:bg-[#1A4B67]"
                }`}
              >
                {item.icon}
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Logout Button ---------------- */}
        <div>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
