import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // ✅ Check if user is not logged in
  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in, show protected component
  return children;
};

export default ProtectedRoute;
