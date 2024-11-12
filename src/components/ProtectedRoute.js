// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/signin" />;
  }
  return children;
};

export default ProtectedRoute;
