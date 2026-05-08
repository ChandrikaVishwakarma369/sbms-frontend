import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the children components
  return children;
};

export default ProtectedRoute;
