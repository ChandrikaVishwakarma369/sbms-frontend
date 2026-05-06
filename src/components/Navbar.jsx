import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, LogIn, LogOut, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order Received", message: "Order #1234 has been placed.", time: "2 min ago" },
    { id: 2, title: "Low Stock Alert", message: "Product 'Wireless Mouse' is low on stock.", time: "1 hour ago" },
    { id: 3, title: "Invoice Paid", message: "Invoice #INV-99 has been paid by Rahul Sharma.", time: "3 hours ago" },
  ]);
  
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }

    // Handle clicking outside to close notifications
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="w-full bg-[#0F3A53] px-4 md:px-6 py-3 flex items-center justify-between rounded-xl shadow-lg border border-white/10 relative z-50">
      
      {/* ---------------- Mobile Menu Button (Hamburger) ---------------- */}
      <button 
        onClick={onMenuClick}
        className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* ---------------- Search Bar (Desktop) ---------------- */}
      <div className="hidden md:flex items-center bg-[#1A4B67] px-4 py-2 rounded-full w-64 lg:w-96 shadow-inner border border-white/5">
        <Search size={18} className="text-white" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-white/60 font-medium"
        />
      </div>

      {/* ---------------- Mobile Search Dropdown ---------------- */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-[#0F3A53] rounded-xl border border-white/10 shadow-2xl z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="flex items-center bg-[#1A4B67] px-4 py-2 rounded-full w-full shadow-inner border border-white/5">
            <Search size={16} className="text-white" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-white/60 font-medium"
            />
          </div>
        </div>
      )}

      {/* ---------------- Right Side ---------------- */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Bell */}
        <div 
          ref={notificationRef}
          className="relative cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} className="text-white" />
          {notifications.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#0F3A53]">
              {notifications.length}
            </span>
          )}

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-[-60px] md:right-[-10px] mt-5 w-72 md:w-80 bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[70] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              {/* Pointer Triangle */}
              <div className="absolute top-[-6px] right-[68px] md:right-[18px] w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>
              
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 relative z-10">
                <h3 className="text-sm font-bold text-[#0F3A53]">Notifications</h3>
                <span className="text-[10px] bg-[#0F3A53]/10 text-[#0F3A53] px-2 py-0.5 rounded-full font-bold">
                  {notifications.length} New
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto relative z-10 bg-white">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer group">
                      <p className="text-xs font-bold text-gray-800 group-hover:text-[#0F3A53] transition-colors">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      <p className="text-[9px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        {n.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Bell size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 tracking-tight">All caught up!</p>
                    <p className="text-xs text-gray-500 mt-1.5">No new notifications for you.</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 bg-gray-50/30 text-center border-t border-gray-100 relative z-10">
                  <button className="text-xs font-bold text-[#0F3A53] hover:text-[#1A4B67] transition-all">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Info (Only if Logged In) */}
        {isLoggedIn && user && (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-white font-bold text-xs md:text-sm leading-none mb-0.5">
                {user.name}
              </p>
              <p className="text-white/60 text-[9px] md:text-[10px] font-semibold tracking-wider">
                {formatRole(user.role)}
              </p>
            </div>
            <div className="cursor-pointer hover:ring-2 hover:ring-white/50 rounded-full transition-all shadow-md border-2 border-white overflow-hidden w-8 h-8 md:w-10 md:h-10 bg-[#1A4B67] flex items-center justify-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white w-5 h-5 md:w-6 md:h-6" />
              )}
            </div>
          </div>
        )}

        {/* ---------------- Login/Logout Button ---------------- */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-[#0F3A53] font-bold rounded-full shadow-[0_4px_15px_rgba(255,255,255,0.1)]
                       hover:bg-red-50 hover:text-red-600 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 
                       active:scale-95 transition-all duration-200 text-xs md:text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-[#0F3A53] font-bold rounded-full shadow-[0_4px_15px_rgba(255,255,255,0.1)]
                       hover:bg-blue-50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 
                       active:scale-95 transition-all duration-200 text-xs md:text-sm"
          >
            <LogIn size={16} />
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;