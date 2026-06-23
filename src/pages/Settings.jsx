import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Lock,
  Edit3,
  Check,
  X,
  UserCheck,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "https://sbms-backend.onrender.com/api/user/profile",
        { withCredentials: true }
      );
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUserData({
        ...userData,
        profileImage: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://sbms-backend.onrender.com/api/user/update-profile",
        {
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          profileImage: userData.profileImage,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      setEditMode(false);
      fetchUser();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://sbms-backend.onrender.com/api/user/change-password",
        {
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      setUserData({
        ...userData,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 p-4 md:p-6 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 mt-2">
        {/* TOP BAR / CONTROL PANEL */}
        <div className="bg-white border border-slate-300 rounded-[2rem] p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#0F3A53] animate-pulse" />
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-700">
              Control Panel
            </h2>
          </div>

          {/* Horizontal Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-[#0F3A53] text-white shadow-[0_4px_14px_rgba(15,58,83,0.3)]"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <User size={16} className="stroke-[2.5]" />
              My Profile
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                activeTab === "security"
                  ? "bg-[#0F3A53] text-white shadow-[0_4px_14px_rgba(15,58,83,0.3)]"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShieldCheck size={16} className="stroke-[2.5]" />
              Security Settings
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white border border-slate-300 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-slate-300 pb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Account Profile
                  </h2>
                  <p className="text-slate-600 text-sm font-medium mt-1">
                    Update your digital identity and contact info.
                  </p>
                </div>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                    editMode
                      ? "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                      : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                  }`}
                >
                  {editMode ? (
                    <X size={14} className="stroke-[2.5]" />
                  ) : (
                    <Edit3 size={14} className="stroke-[2.5]" />
                  )}
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* CARD CONTAINER */}
              <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* PROFILE IMAGE */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-[#0F3A53]/10 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-1 bg-slate-200 rounded-full border border-slate-300">
                    <img
                      src={
                        userData.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="profile"
                      className="w-32 h-32 rounded-full object-cover bg-slate-50"
                    />
                  </div>

                  {editMode && (
                    <label className="absolute bottom-1 right-1 bg-[#0F3A53] text-white p-2.5 rounded-full cursor-pointer shadow-md hover:bg-slate-900 transition-all duration-200 transform hover:scale-110 border-2 border-white">
                      <Camera size={15} className="stroke-[2.5]" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImage}
                      />
                    </label>
                  )}
                </div>

                {/* FIELDS INPUT */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {/* FULL NAME */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-4 text-slate-600 stroke-[2.5]"
                      />
                      <input
                        type="text"
                        name="name"
                        disabled={!editMode}
                        value={userData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm font-semibold transition-all duration-300 ${
                          editMode
                            ? "border-slate-400 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/20 focus:border-[#0F3A53]"
                            : "border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-4 text-slate-600 stroke-[2.5]"
                      />
                      <input
                        type="email"
                        name="email"
                        disabled={!editMode}
                        value={userData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm font-semibold transition-all duration-300 ${
                          editMode
                            ? "border-slate-400 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/20 focus:border-[#0F3A53]"
                            : "border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
                        }`}
                        placeholder="hello@domain.com"
                      />
                    </div>
                  </div>

                  {/* MOBILE */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-4 top-4 text-slate-600 stroke-[2.5]"
                      />
                      <input
                        type="text"
                        name="mobile"
                        disabled={!editMode}
                        value={userData.mobile}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm font-semibold transition-all duration-300 ${
                          editMode
                            ? "border-slate-400 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/20 focus:border-[#0F3A53]"
                            : "border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
                        }`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* ROLE */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                      System Role
                    </label>
                    <div className="relative">
                      <UserCheck
                        size={16}
                        className="absolute left-4 top-4 text-slate-500 stroke-[2.5]"
                      />
                      <input
                        type="text"
                        value={userData.role || "User"}
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 cursor-not-allowed font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION SAVE BUTTON */}
              {editMode && (
                <div className="mt-10 flex justify-end border-t border-slate-300 pt-6">
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#0F3A53] hover:bg-slate-900 shadow-[0_4px_14px_rgba(15,58,83,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={14} className="stroke-[2.5]" />
                    {loading ? "Saving Profile..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="relative z-10">
              <div className="mb-10 border-b border-slate-300 pb-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Security Configuration
                </h2>
                <p className="text-slate-600 text-sm font-medium mt-1">
                  Manage encryption keys and access credentials.
                </p>
              </div>

              <div className="max-w-xl space-y-6">
                {/* CURRENT PASSWORD */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-4 text-slate-600 stroke-[2.5]"
                    />
                    <input
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-400 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/20 focus:border-[#0F3A53] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    New Strong Password
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      size={16}
                      className="absolute left-4 top-4 text-slate-600 stroke-[2.5]"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-400 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/20 focus:border-[#0F3A53] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* UPDATE PASSWORD BUTTON */}
                <div className="pt-4">
                  <button
                    onClick={changePassword}
                    disabled={loading}
                    className="flex items-center gap-2 py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#0F3A53] hover:bg-slate-900 shadow-[0_4px_14px_rgba(15,58,83,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock size={14} className="stroke-[2.5]" />
                    {loading ? "Updating Credentials..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
