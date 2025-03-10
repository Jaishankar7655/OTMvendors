import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserSession, refreshUserSession } from "./sessionUtils";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const userData = getUserSession();
    return userData !== null;
  };

  // If user is authenticated, refresh their session duration
  useEffect(() => {
    if (isAuthenticated()) {
      refreshUserSession();
    }
  }, [location.pathname]);

  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    // The "state" prop preserves the attempted URL for potential redirect after login
    return <Navigate to="/VendorLogin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
