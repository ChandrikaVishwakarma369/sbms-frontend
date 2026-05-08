import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./pages/loginsignup";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import MainLayout from "./layout/MainLayout";
import SettingsPage from "./pages/Settings";

import Orders from "./pages/Orders";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#0F3A53",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#0F3A53",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/invoices" element={<Invoices />} />

          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* without layout */}
        <Route path="/login" element={<LoginSignup />} />

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
