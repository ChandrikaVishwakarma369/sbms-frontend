import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, perform authentication here
    // For now, simply navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#FAFAFA] to-[#ECFEFF] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 p-6 flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-b from-[#4A6BF3] to-[#2FBBA0] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <span className="text-white text-xl font-bold tracking-wide">SB</span>
        </div>

        {/* Header */}
        <h2 className="text-[1.75rem] font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {isLogin ? 'Sign in to manage your business' : 'Sign up to start managing your business'}
        </p>

        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit}>
          
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
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5551FF] focus:border-[#5551FF] sm:text-sm transition-colors"
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
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5551FF] focus:border-[#5551FF] sm:text-sm transition-colors"
                placeholder={isLogin ? "admin@example.com" : "example@example.com"}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5551FF] focus:border-[#5551FF] sm:text-sm transition-colors"
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
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5551FF] focus:border-[#5551FF] sm:text-sm transition-colors"
                  placeholder="Confirm Password"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Login Options */}
          {isLogin && (
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#5551FF] focus:ring-[#5551FF] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-[#5551FF] hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(85,81,255,0.39)] text-sm font-medium text-white bg-[#5551FF] hover:bg-[#4d48e5] hover:shadow-[0_6px_20px_rgba(85,81,255,0.23)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5551FF] mb-8"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="w-full text-center relative mt-2">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-100 -mt-6"></div>
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-[#5551FF] hover:text-[#4d48e5] transition-colors bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default LoginSignup;
