import React from "react";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customers from "./pages/Customers";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Customers Page */}
        <Route path="/customers" element={<Customers />} />

        {/* Invoices Page */}
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </Router>
  );
}

export default App;
