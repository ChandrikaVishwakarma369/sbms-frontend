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
      <div className="bg-indigo-600 w-56 h-[95%] rounded-2xl p-6 flex flex-col justify-between">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full font-bold text-xs">
              SBMS
            </div>

            <h1 className="text-white font-semibold">Smart Business</h1>
          </div>

          {/* Menu */}
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
                ${
                  item.active
                    ? "bg-white text-indigo-600"
                    : "text-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {item.icon}
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div>
          <button className="flex items-center gap-3 text-indigo-200 hover:text-white">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
