import React, { useState, useRef } from "react";
import {
  User,
  Lock,
  Building2,
  Bell,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  UploadCloud,
  Globe,
  Landmark,
  ShoppingBag,
  Users,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";

/**
 * SettingsPage Component
 * Provides a multi-tab interface for User Profile, Security, Business Branding, and Notifications.
 */
const SettingsPage = () => {
  // State to manage current active tab: 'profile' | 'security' | 'business' | 'notifications'
  const [activeTab, setActiveTab] = useState("profile");

  // ==========================================
  // 1. PROFILE SECTION
  // ==========================================
  const ProfileSection = () => {
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);

    // Triggers hidden file input click
    const handleImageClick = () => fileInputRef.current.click();

    // Converts uploaded image to Base64 for instant preview
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Profile Header with Avatar Upload */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="relative group">
            <div
              onClick={handleImageClick}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1f4e63] to-[#4288a8] overflow-hidden text-white flex items-center justify-center text-xl font-bold shadow-md transition-transform group-hover:scale-105 cursor-pointer border-2 border-white"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "SB"
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute -bottom-1 -right-1 bg-[#1f4e63] text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-all"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-800">
              Sandeep Bhardwaj
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Account Administrator
            </p>
            <div className="mt-3 flex gap-2 justify-center md:justify-start">
              <button
                onClick={handleImageClick}
                className="text-[11px] font-bold px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-sm"
              >
                Change Photo
              </button>
              <button
                onClick={() => setProfileImage(null)}
                className="text-[11px] font-bold px-4 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Personal Details Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <CustomInput
            label="Full Name"
            icon={<User size={16} />}
            placeholder="Sandeep Bhardwaj"
          />
          <CustomInput
            label="Email Address"
            icon={<Mail size={16} />}
            placeholder="sandeep@example.com"
          />
          <CustomInput
            label="Phone Number"
            icon={<Phone size={16} />}
            placeholder="+91 98765 43210"
          />
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Bio
            </label>
            <textarea
              className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#1f4e63]/5 focus:border-[#1f4e63] outline-none h-[100px] transition-all font-semibold text-sm text-slate-800"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 2. SECURITY SECTION (Passwords & 2FA)
  // ==========================================
  const SecuritySection = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base px-1">
          Password Security
        </h3>
        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CustomInput
              label="Current Password"
              type="password"
              placeholder="••••••••"
            />
            <CustomInput
              label="New Password"
              type="password"
              placeholder="••••••••"
            />
            <CustomInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 italic">
              Last changed: 3 months ago
            </p>
            <button className="flex items-center gap-2 bg-[#1f4e63] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-[#1f4e63]/20 hover:bg-[#2a6681] transition-all active:scale-95">
              <Lock size={14} /> Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Highlight Box */}
      <div className="flex items-center justify-between p-5 bg-green-50 rounded-3xl border border-green-100 gap-4 group hover:bg-green-100/50 transition-colors">
        <div className="flex gap-3 items-center">
          <div className="p-2.5 bg-white rounded-xl shadow-sm text-green-600 group-hover:scale-110 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-green-900">
              Two-Factor Authentication
            </h4>
            <p className="text-[10px] text-green-700">
              Add an extra layer of protection to your login.
            </p>
          </div>
        </div>
        <button className="text-[11px] font-bold bg-white text-green-700 px-5 py-2 rounded-xl border border-green-200 shadow-sm hover:bg-green-600 hover:text-white transition-all">
          Enable Now
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 3. BUSINESS SECTION (Branding & GST)
  // ==========================================
  const BusinessSection = () => {
    const logoInputRef = useRef(null);
    const [businessLogo, setBusinessLogo] = useState(null);

    const handleLogoClick = () => logoInputRef.current.click();
    const handleLogoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setBusinessLogo(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoChange}
          className="hidden"
          accept="image/*"
        />

        {/* Logo Upload Box */}
        <div className="flex flex-col md:flex-row items-start gap-6 border-b border-slate-100 pb-6">
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-bold text-slate-800">Branding</h3>
            <p className="text-[11px] text-slate-500">
              Logo for invoices and reports.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div
              onClick={handleLogoClick}
              className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer min-h-[140px]"
            >
              {businessLogo ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={businessLogo}
                    alt="Business Logo"
                    className="h-20 w-auto object-contain rounded-lg shadow-sm"
                  />
                  <p className="text-[10px] font-bold text-[#1f4e63] bg-white px-2 py-1 rounded-md shadow-sm">
                    Click to Change
                  </p>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} className="text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    Upload Logo
                  </p>
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG up to 2MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Business Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            label="Legal Name"
            icon={<Building2 size={16} />}
            placeholder="Smart Business MS Pvt Ltd"
          />
          <CustomInput
            label="GST Number"
            icon={<FileText size={16} />}
            placeholder="22AAAAA0000A1Z5"
          />
        </div>
      </div>
    );
  };

  // ==========================================
  // 4. NOTIFICATION SECTION (Toggles)
  // ==========================================
  const NotificationSection = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      {/* Global DND Toggle */}
      <div className="bg-[#1f4e63]/5 p-5 rounded-3xl border border-[#1f4e63]/10 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#1f4e63]">
            <Bell size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1f4e63]">
              Pause All Notifications
            </h4>
            <p className="text-[10px] text-[#1f4e63]/70 font-medium">
              Temporarily mute all alerts (Do Not Disturb)
            </p>
          </div>
        </div>
        <ToggleRow hideDetails />
      </div>

      {/* Categorized Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Channels
          </h3>
          <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100 space-y-2">
            <ToggleRow
              icon={<Mail size={16} className="text-blue-500" />}
              title="Email Alerts"
              description="Reports & security"
              defaultChecked
            />
            <ToggleRow
              icon={<Bell size={16} className="text-orange-500" />}
              title="Push Notifications"
              description="Browser alerts"
              defaultChecked
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Activity
          </h3>
          <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100 space-y-2">
            <ToggleRow
              icon={<ShoppingBag size={16} className="text-green-500" />}
              title="New Orders"
              description="Alert for every sale"
              defaultChecked
            />
            <ToggleRow
              icon={<Users size={16} className="text-purple-500" />}
              title="New Customers"
              description="When someone joins"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // MAIN RENDER (Tabs & Content Layout)
  // ==========================================
  return (
    <MainLayout>
      <div className="w-full px-4 md:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage your profile and preferences
            </p>
          </div>
          <button className="bg-[#1f4e63] text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-[#1f4e63]/20 hover:scale-105 transition-all text-xs">
            Save All Changes
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1 mb-6 overflow-x-auto no-scrollbar max-w-fit">
          <TabItem
            id="profile"
            label="Profile"
            icon={<User size={16} />}
            active={activeTab}
            onClick={setActiveTab}
          />
          <TabItem
            id="security"
            label="Security"
            icon={<Lock size={16} />}
            active={activeTab}
            onClick={setActiveTab}
          />
          <TabItem
            id="business"
            label="Business"
            icon={<Building2 size={16} />}
            active={activeTab}
            onClick={setActiveTab}
          />
          <TabItem
            id="notifications"
            label="Notifications"
            icon={<Bell size={16} />}
            active={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* Render Active Section Container */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-10 w-full min-h-[500px]">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "business" && <BusinessSection />}
          {activeTab === "notifications" && <NotificationSection />}
        </div>
      </div>
    </MainLayout>
  );
};

// ==========================================
// HELPER COMPONENTS (Reusable UI)
// ==========================================

// Custom Reusable Input with Icon Support
const CustomInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1f4e63] transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full ${
          icon ? "pl-11" : "px-4"
        } py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#1f4e63] outline-none transition-all text-sm text-slate-800 font-semibold`}
      />
    </div>
  </div>
);

// Tab Button Component
const TabItem = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
      active === id
        ? "bg-[#f1f5f9] text-[#1f4e63] shadow-sm"
        : "text-slate-400 hover:text-slate-700"
    }`}
  >
    {icon} {label}
  </button>
);

// Updated Switch/Toggle Component with Icon support
const ToggleRow = ({
  title,
  description,
  defaultChecked,
  icon,
  hideDetails = false,
}) => (
  <div
    className={`flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-50 shadow-sm ${
      hideDetails ? "bg-transparent border-none p-0 shadow-none" : ""
    }`}
  >
    {!hideDetails && (
      <div className="flex items-center gap-3">
        {icon && <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>}
        <div>
          <h4 className="text-[12px] font-bold text-slate-800">{title}</h4>
          <p className="text-[10px] text-slate-500 font-medium">
            {description}
          </p>
        </div>
      </div>
    )}
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
      />
      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 transition-all peer-checked:bg-[#1f4e63]"></div>
    </label>
  </div>
);

export default SettingsPage;
