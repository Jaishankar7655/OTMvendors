import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButton from "../UserLog/AuthButton";

const VendorProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    vendor_id: "",
    vendor_unique_id: "",
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        sessionStorage.removeItem("userData"); // Remove corrupted data
        navigate("/VendorLogin"); // Redirect to login
      }
    } else {
      navigate("/VendorLogin"); // Redirect if no user data
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://backend.onetouchmoments.com/vendor_controller/vendor_profile/index_put/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      await response.json();
      setNotification({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });
      sessionStorage.setItem("userData", JSON.stringify(formData)); // Store updated data
      setUserData(formData);

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        show: true,
        message: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userData"); // Secure logout
    navigate("/VendorLogin");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-[#CC0B0B] border-r-transparent border-l-transparent border-b-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Quick stats for dashboard

  return (
    <div className="min-h-screen bg-gray-50">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          } transition-all duration-500 ease-in-out`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Sidebar and Main Content */}
      <div className="flex h-screen overflow-hidden mt-16">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white shadow-lg">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <svg
                  className="w-8 h-8 text-[#CC0B0B]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  Vendor Portal
                </span>
              </div>

              <div className="mt-2 px-2 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition ${
                    activeTab === "profile"
                      ? "bg-[#CC0B0B] text-white"
                      : "text-gray-700 hover:bg-red-50 hover:text-[#CC0B0B]"
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "profile"
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#CC0B0B]"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={() => navigate("/VendorList")}
                  className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-[#CC0B0B] w-full transition"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-[#CC0B0B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Add Services
                </button>

                <button
                  onClick={() => navigate("/services")}
                  className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-[#CC0B0B] w-full transition"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-[#CC0B0B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Manage Services
                </button>

                <button
                  onClick={() => navigate("/analytics")}
                  className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-[#CC0B0B] w-full transition"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-[#CC0B0B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analytics
                </button>
              </div>
            </div>

            {/* Logout button */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 border border-[#CC0B0B] text-[#CC0B0B] rounded-md hover:bg-red-50 group transition-colors duration-200"
              >
                <svg
                  className="mr-2 h-5 w-5 text-[#CC0B0B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <AuthButton />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden bg-white shadow-sm w-full fixed top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-[#CC0B0B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">
                Vendor Portal
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#CC0B0B]"
            >
              <span className="sr-only">Sign out</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
            {/* Mobile navigation */}
            <div className="md:hidden flex overflow-x-auto space-x-4 mb-6 pb-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === "profile"
                    ? "bg-[#CC0B0B] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/services")}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700"
              >
                Add Services
              </button>
              <button
                onClick={() => navigate("/services")}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700"
              >
                Manage Services
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700"
              >
                Analytics
              </button>
            </div>

            {/* Header section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userData.vendor_name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your vendor profile and services
              </p>
            </div>

            {/* Stats section */}

            {/* Profile section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#CC0B0B] to-[#FF4444] px-6 py-4">
                <h2 className="text-xl font-bold text-white">Vendor Profile</h2>
              </div>

              <div className="p-6">
                {/* Profile info */}
                <div className="flex flex-col sm:flex-row sm:items-center pb-6 mb-6 border-b border-gray-200">
                  <div className="flex items-center mb-4 sm:mb-0 sm:mr-8">
                    <div className="bg-gradient-to-br from-[#CC0B0B] to-[#FF4444] h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {userData.vendor_name?.charAt(0)?.toUpperCase() || "V"}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {userData.vendor_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userData.vendor_unique_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:ml-auto">
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {userData.vendor_email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {userData.vendor_phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Edit Your Profile
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="hidden"
                      name="vendor_id"
                      value={formData.vendor_id}
                    />
                    <input
                      type="hidden"
                      name="vendor_unique_id"
                      value={formData.vendor_unique_id}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="vendor_name"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="vendor_name"
                            name="vendor_name"
                            value={formData.vendor_name}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#CC0B0B] focus:border-[#CC0B0B] transition-colors duration-200"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="vendor_email"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <input
                            type="email"
                            id="vendor_email"
                            name="vendor_email"
                            value={formData.vendor_email}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#CC0B0B] focus:border-[#CC0B0B] transition-colors duration-200"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="vendor_phone"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          id="vendor_phone"
                          name="vendor_phone"
                          value={formData.vendor_phone}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#CC0B0B] focus:border-[#CC0B0B] transition-colors duration-200"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto sm:ml-auto sm:flex px-6 py-3 bg-gradient-to-r from-[#CC0B0B] to-[#FF4444] text-white rounded-lg shadow hover:from-[#B30A0A] hover:to-[#E03C3C] transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CC0B0B]"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                            Updating Profile...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg
                              className="mr-2 h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-sm text-gray-500">
              <p>© 2025 One Touch Moments. All rights reserved.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorProfile;
