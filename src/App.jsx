import React from "react";
import { BrowserRouter, Routes, Route, Navigate , Router} from "react-router-dom";
import LoginSignup from "./pages/loginsignup";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";

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
