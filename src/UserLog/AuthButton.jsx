import React from 'react';
import { isUserLoggedIn, clearUserSession } from "./sessionUtils";
import { useNavigate } from "react-router-dom";

const AuthButton = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    clearUserSession(); // This now clears both session and local storage
    navigate("/VendorLogin");
  };
  
  return isUserLoggedIn() ? (
    <button onClick={handleLogout} className="text-red-500">
      Logout
    </button>
  ) : (
    <button onClick={() => navigate("/VendorLogin")} className="text-green-500">
      Login
    </button>
  );
};

export default AuthButton;