import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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
  Save,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // =========================
  // PROFILE STATE
  // =========================

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  // =========================
  // PASSWORD STATE
  // =========================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/settings/profile",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setProfileData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          bio: response.data.user.bio || "",
        });

        if (response.data.user.profileImage) {
          setProfileImage(
            `http://localhost:4000/uploads/${response.data.user.profileImage}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("bio", profileData.bio);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        "http://localhost:4000/api/settings/profile",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Profile Updated Successfully");
        fetchProfile();
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const changePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return alert("New Password and Confirm Password not match");
      }

      const response = await axios.put(
        "http://localhost:4000/api/settings/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Password Changed Successfully");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ==========================================
  // 1. PROFILE SECTION
  // ==========================================

  const ProfileSection = () => {
    const fileInputRef = useRef(null);

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = (event) => {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileImage(reader.result);
        };

        reader.readAsDataURL(file);

        setImageFile(file);
      }
    };

    return (
      <div className="animate-in fade-in duration-300">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
          <div className="relative group">
            <div
              onClick={handleImageClick}
              className="w-16 h-16 rounded-full bg-[#1f4e63] overflow-hidden text-white flex items-center justify-center text-lg font-bold shadow-sm cursor-pointer border-2 border-white"
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
              type="button"
              onClick={handleImageClick}
              className="absolute -bottom-1 -right-1 bg-[#1f4e63] text-white p-1.5 rounded-full shadow-md border border-white hover:scale-110 transition-all"
            >
              <Camera size={12} />
            </button>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800 leading-tight">
              {JSON.parse(localStorage.getItem("user"))?.name || "User"}
            </h3>

            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              {JSON.parse(localStorage.getItem("user"))?.role || "Employee"}
            </p>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={handleImageClick}
                className="text-[10px] font-bold text-[#1f4e63] hover:underline"
              >
                Change Photo
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileImage(null);
                  setImageFile(null);
                }}
                className="text-[10px] font-bold text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Full Name"
            icon={<User size={16} />}
            placeholder="Enter Name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                name: e.target.value,
              })
            }
          />

          <CustomInput
            label="Email Address"
            icon={<Mail size={16} />}
            placeholder="Enter Email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                email: e.target.value,
              })
            }
          />

          <CustomInput
            label="Phone Number"
            icon={<Phone size={16} />}
            placeholder="Enter Phone"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                phone: e.target.value,
              })
            }
          />

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Bio
            </label>

            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  bio: e.target.value,
                })
              }
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#1f4e63] outline-none h-20 transition-all font-medium text-sm text-gray-800"
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
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-4">
          Password Security
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />

          <CustomInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />

          <CustomInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 italic">
            Keep your password secure
          </p>

          <button
            onClick={changePassword}
            className="bg-[#1f4e63] text-white px-4 py-2 rounded-lg font-bold text-[11px] shadow hover:bg-[#2a6681] transition-all"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-green-900">
              Two-Factor Authentication
            </h4>

            <p className="text-[10px] text-green-700">
              Add an extra layer of protection.
            </p>
          </div>
        </div>

        <button className="text-[10px] font-bold bg-white text-green-700 px-4 py-2 rounded-lg border border-green-100 shadow-sm hover:bg-green-600 hover:text-white transition-all uppercase">
          Enable
        </button>
      </div>
    </div>
  );

  // ==========================================
  // BUSINESS SECTION
  // ==========================================

  const BusinessSection = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex gap-6 items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
        <UploadCloud size={24} className="text-gray-400" />

        <div className="flex-1">
          <p className="text-sm font-bold text-gray-700">Business Logo</p>

          <p className="text-[10px] text-gray-400">PNG, JPG up to 2MB</p>
        </div>

        <button className="bg-white border border-gray-200 text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 uppercase">
          Upload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Legal Name"
          icon={<Building2 size={16} />}
          placeholder="Business Name"
        />

        <CustomInput
          label="GST Number"
          icon={<FileText size={16} />}
          placeholder="GST Number"
        />
      </div>
    </div>
  );

  // ==========================================
  // NOTIFICATION SECTION
  // ==========================================

  const NotificationSection = () => (
    <div className="space-y-4 animate-in fade-in">
      <div className="bg-[#1f4e63]/5 p-4 rounded-xl border border-[#1f4e63]/10 flex items-center justify-between mb-2">
        <div className="flex gap-3 items-center">
          <Bell size={18} className="text-[#1f4e63]" />

          <h4 className="text-[13px] font-bold text-[#1f4e63]">
            Mute All Notifications
          </h4>
        </div>

        <ToggleRow hideDetails />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleRow
          icon={<Mail size={16} className="text-blue-500" />}
          title="Email Alerts"
          description="Reports & security"
          defaultChecked
        />

        <ToggleRow
          icon={<ShoppingBag size={16} className="text-green-500" />}
          title="New Orders"
          description="Alert for every sale"
          defaultChecked
        />
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 py-6 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Account Settings
          </h1>

          <p className="text-xs text-gray-400 font-medium">
            Manage profile and preferences
          </p>
        </div>

        <button
          onClick={saveProfile}
          className="bg-[#1f4e63] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:scale-105 transition-all text-xs flex items-center gap-2"
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>

      {/* TABS */}

      <div className="bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex gap-1 overflow-x-auto no-scrollbar">
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

      {/* CONTENT */}

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "security" && <SecuritySection />}
        {activeTab === "business" && <BusinessSection />}
        {activeTab === "notifications" && <NotificationSection />}
      </div>
    </div>
  );
};

// ==========================================
// HELPER COMPONENTS
// ==========================================

const CustomInput = ({ label, icon, ...props }) => (
  <div className="space-y-1 group">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      <input
        {...props}
        className={`w-full ${
          icon ? "pl-10" : "px-4"
        } py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#1f4e63] outline-none transition-all text-sm text-gray-800 font-medium`}
      />
    </div>
  </div>
);

const TabItem = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2.5 px-6 py-2 rounded-xl font-bold text-[13px] transition-all whitespace-nowrap ${
      active === id
        ? "bg-[#1f4e63] text-white shadow-sm"
        : "text-gray-400 hover:bg-gray-50"
    }`}
  >
    {icon}
    {label}
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
    className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 ${
      hideDetails ? "bg-transparent border-none p-0" : ""
    }`}
  >
    {!hideDetails && (
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        )}

        <div>
          <h4 className="text-[12px] font-bold text-gray-800 leading-none mb-1">
            {title}
          </h4>

          <p className="text-[10px] text-gray-400 font-medium">{description}</p>
        </div>
      </div>
    )}

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
      />

      <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 transition-all peer-checked:bg-[#1f4e63]"></div>
    </label>
  </div>
);

export default SettingsPage;
