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

function App() {
  return (
    <Routes>
      {/* Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products/>} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* without layout */}
      <Route path="/login" element={<LoginSignup />} />

      {/* Default routes */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;