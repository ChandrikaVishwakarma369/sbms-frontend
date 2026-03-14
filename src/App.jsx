import Invoices from "./pages/Invoices";

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Customers from "./pages/Customers";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/customers" />} />

        {/* Customers Page */}
        <Route path="/customers" element={<Customers />} />
          
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </Router>
  );
}

export default App;
