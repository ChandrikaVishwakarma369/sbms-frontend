import React, { useState, useRef } from "react";
import {
  User,
  Lock,
  Building2,
  Bell,
  ShieldCheck,
  Mail,
  Phone,
  Camera,
  FileText,
  UploadCloud,
  ShoppingBag,
  Users,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // ==========================================
  // 1. PROFILE SECTION
  // ==========================================
  const ProfileSection = () => {
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);

    const handleImageClick = () => fileInputRef.current.click();
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="relative group">
            <div
              onClick={handleImageClick}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1f4e63] to-[#4288a8] overflow-hidden text-white flex items-center justify-center text-2xl font-bold shadow-md cursor-pointer border-2 border-white"
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
              className="absolute -bottom-1 -right-1 bg-[#1f4e63] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-all"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-slate-800">
              Sandeep Bhardwaj
            </h3>
            <p className="text-base text-slate-500 font-semibold uppercase tracking-wide">
              Account Administrator
            </p>
            <div className="mt-4 flex gap-3 justify-center md:justify-start">
              <button
                onClick={handleImageClick}
                className="text-xs font-bold px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-sm"
              >
                Change Photo
              </button>
              <button
                onClick={() => setProfileImage(null)}
                className="text-xs font-bold px-5 py-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <CustomInput
            label="Full Name"
            icon={<User size={18} />}
            placeholder="Sandeep Bhardwaj"
          />
          <CustomInput
            label="Email Address"
            icon={<Mail size={18} />}
            placeholder="sandeep@example.com"
          />
          <CustomInput
            label="Phone Number"
            icon={<Phone size={18} />}
            placeholder="+91 98765 43210"
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Bio
            </label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#1f4e63]/5 focus:border-[#1f4e63] outline-none h-[120px] transition-all font-semibold text-base text-slate-800"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 2. SECURITY SECTION
  // ==========================================
  const SecuritySection = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-5">
        <h3 className="font-bold text-slate-800 text-lg px-1">
          Password Security
        </h3>
        <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 font-medium italic">
              Last changed: 3 months ago
            </p>
            <button className="flex items-center gap-2 bg-[#1f4e63] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#2a6681] transition-all active:scale-95">
              <Lock size={16} /> Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border border-green-100 gap-4 group hover:bg-green-100/50 transition-colors">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-white rounded-xl shadow-sm text-green-600 group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-900">
              Two-Factor Authentication
            </h4>
            <p className="text-xs text-green-700 font-medium">
              Add an extra layer of protection to your login.
            </p>
          </div>
        </div>
        <button className="text-xs font-bold bg-white text-green-700 px-6 py-2.5 rounded-xl border border-green-200 shadow-sm hover:bg-green-600 hover:text-white transition-all">
          Enable Now
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 3. BUSINESS SECTION
  // ==========================================
  const BusinessSection = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row items-start gap-8 border-b border-slate-100 pb-8">
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold text-slate-800">Branding</h3>
          <p className="text-sm text-slate-500 mt-1">
            Logo for invoices and reports.
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer min-h-[160px]">
            <UploadCloud size={30} className="text-slate-400 mb-3" />
            <p className="text-sm font-bold text-slate-700">Upload Logo</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomInput
          label="Legal Name"
          icon={<Building2 size={18} />}
          placeholder="Smart Business MS Pvt Ltd"
        />
        <CustomInput
          label="GST Number"
          icon={<FileText size={18} />}
          placeholder="22AAAAA0000A1Z5"
        />
      </div>
    </div>
  );

  // ==========================================
  // 4. NOTIFICATION SECTION
  // ==========================================
  const NotificationSection = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="bg-[#1f4e63]/5 p-6 rounded-3xl border border-[#1f4e63]/10 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-white rounded-xl shadow-sm text-[#1f4e63]">
            <Bell size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#1f4e63]">
              Pause All Notifications
            </h4>
            <p className="text-xs text-[#1f4e63]/70 font-medium">
              Temporarily mute all alerts (Do Not Disturb)
            </p>
          </div>
        </div>
        <ToggleRow hideDetails />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Channels
          </h3>
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-3">
            <ToggleRow
              icon={<Mail size={18} className="text-blue-500" />}
              title="Email Alerts"
              description="Reports & security"
              defaultChecked
            />
            <ToggleRow
              icon={<Bell size={18} className="text-orange-500" />}
              title="Push Notifications"
              description="Browser alerts"
              defaultChecked
            />
          </div>
        </div>
        <div className="space-y-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Activity
          </h3>
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-3">
            <ToggleRow
              icon={<ShoppingBag size={18} className="text-green-500" />}
              title="New Orders"
              description="Alert for every sale"
              defaultChecked
            />
            <ToggleRow
              icon={<Users size={18} className="text-purple-500" />}
              title="New Customers"
              description="When someone joins"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-base text-slate-500 font-medium">
            Manage your profile and preferences
          </p>
        </div>
        <button className="bg-[#1f4e63] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-[#1f4e63]/20 hover:scale-105 transition-all text-sm">
          Save All Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2 mb-8 overflow-x-auto no-scrollbar max-w-fit">
        <TabItem
          id="profile"
          label="Profile"
          icon={<User size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabItem
          id="security"
          label="Security"
          icon={<Lock size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabItem
          id="business"
          label="Business"
          icon={<Building2 size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabItem
          id="notifications"
          label="Notifications"
          icon={<Bell size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 w-full min-h-[500px]">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "security" && <SecuritySection />}
        {activeTab === "business" && <BusinessSection />}
        {activeTab === "notifications" && <NotificationSection />}
      </div>
    </div>
  );
};

// ==========================================
// UPDATED HELPER COMPONENTS
// ==========================================

const CustomInput = ({ label, icon, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
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
          icon ? "pl-12" : "px-5"
        } py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#1f4e63] outline-none transition-all text-base text-slate-800 font-semibold`}
      />
    </div>
  </div>
);

const TabItem = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
      active === id
        ? "bg-[#f1f5f9] text-[#1f4e63] shadow-sm scale-105"
        : "text-slate-400 hover:text-slate-700"
    }`}
  >
    {icon} {label}
  </button>
);

const ToggleRow = ({
  title,
  description,
  defaultChecked,
  icon,
  hideDetails = false,
}) => (
  <div
    className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm ${
      hideDetails ? "bg-transparent border-none p-0 shadow-none" : ""
    }`}
  >
    {!hideDetails && (
      <div className="flex items-center gap-4">
        {icon && <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>}
        <div>
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
      </div>
    )}
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
      />
      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 transition-all peer-checked:bg-[#1f4e63]"></div>
    </label>
  </div>
);

export default SettingsPage;
