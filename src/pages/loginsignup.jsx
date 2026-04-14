import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // In a real app, perform authentication here
  //   // For now, simply navigate to the dashboard
  //   navigate("/dashboard");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // 🔥 MOST IMPORTANT
        }
      );

      console.log(res.data);

      // agar login success
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#FAFAFA] to-[#0F3A53]/10 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 p-6 flex flex-col items-center">
        {/* Refined Animated Logo */}
        <div className="relative mb-10 group">
          {/* Outer Orbital Glow */}
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-glow-spin scale-150"></div>

          {/* Logo Container with Orbit */}
          <div className="relative w-20 h-20 flex items-center justify-center animate-logo-float">
            {/* Dark Teal Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-[#0F3A53]/40 shadow-lg"></div>

            {/* Mid Cyan Ring with Soft Pulse */}
            <div className="w-[85%] h-[85%] rounded-full bg-cyan-100 flex items-center justify-center shadow-md animate-pulse-soft">
              {/* Inner Bright Cyan Ring */}
              <div className="w-[85%] h-[85%] rounded-full bg-cyan-200 flex items-center justify-center shadow-inner border border-white/50">
                {/* Core White Circle */}
                <div className="w-[70%] h-[70%] bg-white rounded-full flex items-center justify-center font-black text-[#0F3A53] text-lg shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                  SB
                </div>
              </div>
            </div>

            {/* Accent Orbiting Dot */}
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
          {!isLogin && (
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                  placeholder="Full Name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                placeholder={
                  isLogin ? "admin@example.com" : "example@example.com"
                }
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          {!isLogin && (
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53] focus:border-[#0F3A53] sm:text-sm transition-colors"
                  placeholder="Confirm Password"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Login Options */}
          {isLogin && (
            <div className="flex items-center mb-8">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#0F3A53] focus:ring-[#0F3A53] border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-500 cursor-pointer"
              >
                Remember me
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(15,58,83,0.39)] text-sm font-medium text-white bg-[#0F3A53] hover:bg-[#0c2e42] hover:shadow-[0_6px_20px_rgba(15,58,83,0.23)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3A53] mb-8"
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            {"Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
