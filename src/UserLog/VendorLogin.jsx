import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setUserSession } from "./sessionUtils";

const VendorLogin = () => {
  const [formData, setFormData] = useState({
    vendor_email: "",
    vendor_password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destination to redirect after successful login
  const from = location.state?.from?.pathname || "/VendorList";

  // Check if user is already logged in
  useEffect(() => {
    const userData = sessionStorage.getItem("userData") || localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        // Check if the token has expired
        if (parsedData.expiryTime && new Date().getTime() > parsedData.expiryTime) {
          // Clear expired session
          sessionStorage.removeItem("userData");
          localStorage.removeItem("userData");
        } else {
          navigate(from);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [navigate, from]);

  const handleChange = (e) => {
    // Clear errors when user starts typing
    if (errorMessage) {
      setErrorMessage("");
      setErrorType("");
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setErrorType("");

    const formBody = new FormData();

    Object.keys(formData).forEach((key) => {
      formBody.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        "https://backend.onetouchmoments.com/vendor_controller/vendor_login/index_post",
        {
          method: "POST",
          body: formBody,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 1) {
        // Calculate expiry time (10 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 10);

        // Save user data with expiry time
        const userData = {
          ...result.data,
          expiryTime: expiryDate.getTime(),
        };

        // Use the centralized utility to store session data
        setUserSession(userData);

        // Navigate to the intended destination or default
        navigate(from);
      } else {
        // Specific error handling based on response
        if (result.message && result.message.toLowerCase().includes("invalid credentials")) {
          setErrorType("auth");
          setErrorMessage("Invalid email or password. Please check your credentials and try again.");
        } else if (result.message && result.message.toLowerCase().includes("account not found")) {
          setErrorType("account");
          setErrorMessage("Account not found. Please check your email or register as a new vendor.");
        } else {
          setErrorType("general");
          setErrorMessage(result.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorType("server");
      setErrorMessage(
        "Connection error. Please check your internet connection or try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            <span className="text-[#CC0B0B]">Vendor</span> Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your vendor dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="vendor_email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="vendor_email"
                  name="vendor_email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`focus:ring-[#CC0B0B] focus:border-[#CC0B0B] block w-full pl-10 pr-3 py-3 border ${
                    errorType === "auth" || errorType === "account" 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-300"
                  } rounded-lg text-gray-900 placeholder-gray-500`}
                  placeholder="Email address"
                  onChange={handleChange}
                  value={formData.vendor_email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="vendor_password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="vendor_password"
                  name="vendor_password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`focus:ring-[#CC0B0B] focus:border-[#CC0B0B] block w-full pl-10 pr-3 py-3 border ${
                    errorType === "auth" ? "border-red-500 bg-red-50" : "border-gray-300"
                  } rounded-lg text-gray-900 placeholder-gray-500`}
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.vendor_password}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#CC0B0B] hover:bg-[#A50909] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CC0B0B] transition-all duration-300 ease-in-out disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/VendorRegistration"
              className="w-full flex justify-center py-2 px-4 border border-[#CC0B0B] rounded-lg shadow-sm text-sm font-medium text-[#CC0B0B] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CC0B0B] transition-all duration-300 ease-in-out"
            >
              Register as a Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;