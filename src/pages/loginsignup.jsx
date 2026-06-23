import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const API_URL = "https://sbms-backend.onrender.com/api/auth";
import axios from "axios";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // ✅ LOGIN — API call
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (data.success) {
          // ✅ Token localStorage mein save karo
          localStorage.setItem("token", data.token);
          // ✅ User info bhi save karo (role ke liye)
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success(`Welcome back, ${data.user.name}!`);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        // ✅ SIGNUP validation
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Account created! Please sign in.");
          setIsLogin(true);
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#FAFAFA] to-[#0F3A53]/10 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 p-6 flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-10 group">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-glow-spin scale-150"></div>
          <div className="relative w-20 h-20 flex items-center justify-center animate-logo-float">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#0F3A53]/40 shadow-lg"></div>
            <div className="w-[85%] h-[85%] rounded-full bg-cyan-100 flex items-center justify-center shadow-md animate-pulse-soft">
              <div className="w-[85%] h-[85%] rounded-full bg-cyan-200 flex items-center justify-center shadow-inner border border-white/50">
                <div className="w-[70%] h-[70%] bg-white rounded-full flex items-center justify-center font-black text-[#0F3A53] text-lg shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                  SB
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full animate-glow-spin">
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] border border-white"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <h2
          key={isLogin ? "login-title" : "signup-title"}
          className="text-[1.75rem] font-bold text-gray-900 mb-2 animate-fade-in-up"
        >
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p
          key={isLogin ? "login-desc" : "signup-desc"}
          className="text-gray-500 text-sm mb-8 animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]"
        >
          {isLogin
            ? "Sign in to manage your business"
            : "Sign up to start managing your business"}
        </p>

        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit}>

          {/* Name — only signup */}
          {!isLogin && (
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                  placeholder="Full Name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                placeholder={isLogin ? "admin@example.com" : "example@example.com"}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Confirm Password — only signup */}
          {!isLogin && (
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                  placeholder="Confirm Password"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Remember me */}
          {isLogin && (
            <div className="flex items-center mb-8">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#0F3A53] focus:ring-[#0F3A53] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer">
                Remember me
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(15,58,83,0.39)] text-sm font-medium text-white bg-[#0F3A53] hover:bg-[#0c2e42] hover:shadow-[0_6px_20px_rgba(15,58,83,0.23)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3A53] mb-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                {isLogin ? "Sign In" : "Create Account"}
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="text-[#0F3A53] font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;