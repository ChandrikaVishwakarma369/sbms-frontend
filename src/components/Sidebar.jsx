import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Products", path: "/products", icon: <Package size={18} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Invoices", path: "/invoices", icon: <FileText size={18} /> },
    { name: "Employees", path: "/employees", icon: <UserCog size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-100 flex items-center justify-center">
      {/* Animation Styles */}
      <style>
        {`
          @keyframes logo-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes glow-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-logo-float { animation: logo-float 4s ease-in-out infinite; }
          .animate-glow-spin { animation: glow-spin 10s linear infinite; }
        `}
      </style>

      <div className="bg-[#0F3A53] w-56 h-[95%] rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
        <div>
          {/* ---------------- Logo Section ---------------- */}
          <div className="flex flex-col items-center mb-10 group">
            <div className="relative w-20 h-20 flex items-center justify-center animate-logo-float">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/30 transition-all"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-cyan-400/20 shadow-lg"></div>
              <div className="w-[85%] h-[85%] rounded-full bg-cyan-100/10 backdrop-blur-sm flex items-center justify-center shadow-md">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-cyan-200 to-cyan-400 flex items-center justify-center shadow-inner border border-white/50">
                  <div className="w-[70%] h-[70%] bg-white rounded-full flex items-center justify-center font-black text-[#0F3A53] text-xl shadow-sm transition-all duration-500 group-hover:scale-110">
                    SB
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full animate-glow-spin">
                <div className="absolute top-1 right-1 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] border-2 border-[#0F3A53]"></div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <span className="text-white font-black tracking-[0.2em] text-xl">
                SBMS
              </span>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-4 bg-cyan-400/50"></div>
                <span className="text-[10px] text-cyan-100 uppercase tracking-widest font-medium">
                  Smart Business
                </span>
                <div className="h-[1px] w-4 bg-cyan-400/50"></div>
              </div>
            </div>
          </div>

          {/* ---------------- Menu Items ---------------- */}
          <ul className="space-y-1.5">
            {menuItems.map((menuItem, index) => {
              const isActive = location.pathname === menuItem.path;

              return (
                <li
                  key={index}
                  onClick={() => navigate(menuItem.path)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-300 group ${
                    isActive
                      ? "bg-white text-[#0F3A53] font-bold shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] scale-[1.02]"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`${
                      isActive ? "text-cyan-500" : "group-hover:text-cyan-300"
                    } transition-colors`}
                  >
                    {menuItem.icon}
                  </span>
                  {menuItem.name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------------- Logout Button ---------------- */}
        <div className="pt-4 border-t border-white/10">
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-all w-full px-4 py-2 hover:bg-red-500/10 rounded-xl">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
