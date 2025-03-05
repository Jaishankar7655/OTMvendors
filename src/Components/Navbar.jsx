import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X, Store } from "lucide-react";
import AuthButton from "../UserLog/AuthButton";
import logo from "../assets/images/logo.jpg";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is logged in from session storage
  useEffect(() => {
    const userdata = sessionStorage.getItem("userdata");
    setIsLoggedIn(!!userdata);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("userdata");
    setIsLoggedIn(false);
    // Optional: Add navigation if needed
    // navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0  z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center justify-center ">
            <Link to="/" className="flex items-center gap-2">
              <div>
                <img className="h-12" src={logo} alt="" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-rose-400">
                  One Touch <span className="text-red-600">Moments</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-rose-600 font-medium"
            >
              Home
            </Link>

            <AuthButton />

            {/* Vendor Profile Link */}
            <Link
              to="/VendorProfile"
              className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium"
            >
              <Store size={18} />
              <span>Vendor Profile</span>
            </Link>

            {/* My Account Link (when logged in) */}
            {isLoggedIn && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium"
              >
                <User size={18} />
                <span>My Account</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-700 hover:text-rose-600 font-medium py-2"
              >
                Home
              </Link>

              <AuthButton />

              {/* Vendor Profile Link */}
              <Link
                to="/VendorProfile"
                className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium py-2"
              >
                <Store size={18} />
                <span>Vendor Profile</span>
              </Link>

              {/* My Account Link (when logged in) */}
              {isLoggedIn && (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium py-2"
                >
                  <User size={18} />
                  <span>My Account</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
