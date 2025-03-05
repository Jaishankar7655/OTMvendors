import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DholRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitProgress, setSubmitProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.vendor_unique_id) {
        setValue("vendor_id", userData.vendor_unique_id);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [setValue, navigate]);

  useEffect(() => {
    // Simulate progress when submitting
    let progressInterval;
    if (isSubmitting) {
      progressInterval = setInterval(() => {
        setSubmitProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until actual completion
        });
      }, 600);
    } else {
      setSubmitProgress(0);
    }

    return () => clearInterval(progressInterval);
  }, [isSubmitting]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("vendor_id", data.vendor_id);
      formData.append("service_cat", "Dhol");
      formData.append("firm_name", data.firm_name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("house_no", data.house_no);
      formData.append("city", data.city);
      formData.append("near_by", data.near_by);
      formData.append("district", data.district);
      formData.append("state", data.state);
      formData.append("pincode", data.pincode);

      // Handle specifications array
      if (data.specifications && data.specifications.length > 0) {
        data.specifications.forEach((spec) => {
          formData.append("specifications[]", spec);
        });
      }

      // Handle images
      if (data.images && data.images.length > 0) {
        // Append each image file with a unique index
        Array.from(data.images).forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
        // Add total count of images
        formData.append("image_count", data.images.length.toString());
      }

      // Handle videos
      if (data.videos && data.videos.length > 0) {
        // Append each video file with a unique index
        Array.from(data.videos).forEach((file, index) => {
          formData.append(`videos[${index}]`, file);
        });
        // Add total count of videos
        formData.append("video_count", data.videos.length.toString());
      }

      const response = await fetch(
        "https://backend.onetouchmoments.com/vendor_controller/Vendor_bussiness",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error! Status: ${response.status}, Details: ${errorText}`);
      }

      setSuccess("Service submitted successfully!");
      setTimeout(() => {
        navigate("/services");
      }, 2000);

    } catch (error) {
      console.error("Submission error:", error);
      setError("An error occurred while submitting your service. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
};
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-r from-white to-red-50 p-8 rounded-xl shadow-lg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full -ml-32 -mb-32 opacity-50"></div>

      <h2 className="text-center text-3xl font-bold mb-6 text-red-700 relative">
        Dhol Services Registration
        <div className="h-1 w-20 bg-red-500 mx-auto mt-2 rounded-full"></div>
      </h2>

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 shadow-md">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 mr-2 mt-0.5 text-green-500"
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
            <p className="font-semibold">{success}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 mr-2 mt-0.5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 relative z-10"
        encType="multipart/form-data"
      >
        {/* Service Info Section */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 border-b pb-2">
            Service Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="service_cat"
                type="hidden"
              
                {...register("service_cat")}
              />
            </div>

            <div>
              <input
                hidden
                type="text"
                {...register("vendor_id")}
                placeholder="Vendor ID"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Firm Name
              </label>
              <input
                type="text"
                {...register("firm_name", {
                  required: "Firm name is required",
                })}
                placeholder="Firm Name"
                className={`w-full p-3 border ${
                  errors.firm_name
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.firm_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firm_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                className={`w-full p-3 border ${
                  errors.email ? "border-red-600 bg-red-50" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="text"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                })}
                placeholder="Phone"
                className={`w-full p-3 border ${
                  errors.phone ? "border-red-600 bg-red-50" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 border-b pb-2">
            Address Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                House/Building No.
              </label>
              <input
                type="text"
                {...register("house_no", { required: "House No. is required" })}
                placeholder="House No."
                className={`w-full p-3 border ${
                  errors.house_no
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.house_no && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.house_no.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                City
              </label>
              <input
                type="text"
                {...register("city", { required: "City is required" })}
                placeholder="City"
                className={`w-full p-3 border ${
                  errors.city ? "border-red-600 bg-red-50" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Nearby Location
              </label>
              <input
                type="text"
                {...register("near_by", {
                  required: "Nearby location is required",
                })}
                placeholder="Nearby Location"
                className={`w-full p-3 border ${
                  errors.near_by
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.near_by && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.near_by.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                District
              </label>
              <input
                type="text"
                {...register("district", { required: "District is required" })}
                placeholder="District"
                className={`w-full p-3 border ${
                  errors.district
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.district && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                State
              </label>
              <input
                type="text"
                {...register("state", { required: "State is required" })}
                placeholder="State"
                className={`w-full p-3 border ${
                  errors.state ? "border-red-600 bg-red-50" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Pincode
              </label>
              <input
                type="text"
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Please enter a valid 6-digit pincode",
                  },
                })}
                placeholder="Pincode"
                className={`w-full p-3 border ${
                  errors.pincode
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200`}
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 border-b pb-2">
            Service Features
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Traditional Dhol Performance",
              "Dhol with Tasha",
              "Dhol and Drum Duo",
              "Live Dhol Performance for Baraat",
              "DJ & Dhol Fusion",
              "Dhol Group with Fireworks",
              "Dhol with Dancers",
              "Bollywood Dhol Beats",
              "Punjabi Dhol",
              "Baraat Special Dhol",
            ].map((spec) => (
              <label
                key={spec}
                className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg hover:bg-red-50 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register("specifications")}
                  value={spec}
                  className="form-checkbox h-5 w-5 text-red-600 rounded"
                />
                <span className="text-gray-700">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 border-b pb-2">
            Media Upload
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition duration-200">
                <input
                  type="file"
                  {...register("images", {
                    validate: {
                      fileSize: (files) => {
                        if (!files || files.length === 0) return true;
                        const maxSize = 5 * 1024 * 1024; // 5MB
                        return (
                          Array.from(files).every(
                            (file) => file.size <= maxSize
                          ) || "Each image must be less than 5MB"
                        );
                      },
                    },
                  })}
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium text-red-600 hover:text-red-500">
                      Click to upload images
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, GIF (Max: 5MB each)
                  </p>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Videos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition duration-200">
                <input
                  type="file"
                  {...register("videos", {
                    validate: {
                      fileSize: (files) => {
                        if (!files || files.length === 0) return true;
                        const maxSize = 50 * 1024 * 1024; // 50MB
                        return (
                          Array.from(files).every(
                            (file) => file.size <= maxSize
                          ) || "Each video must be less than 50MB"
                        );
                      },
                    },
                  })}
                  multiple
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium text-red-600 hover:text-red-500">
                      Click to upload videos
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: MP4, MOV, AVI (Max: 50MB each)
                  </p>
                </label>
              </div>
              {errors.videos && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.videos.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full relative overflow-hidden ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
          } text-white text-lg font-semibold py-3 rounded-lg shadow-lg transform transition duration-200 ${
            !isSubmitting && "hover:scale-105"
          }`}
        >
          {isSubmitting && (
            <div
              className="absolute top-0 left-0 h-full bg-white bg-opacity-20"
              style={{ width: `${submitProgress}%` }}
            ></div>
          )}

          <div className="flex items-center justify-center">
            {isSubmitting ? (
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
                <span>Submitting your service details...</span>
              </>
            ) : (
              <span>Submit Service</span>
            )}
          </div>
        </button>

        {/* Submission Progress Info */}
        {isSubmitting && (
          <div className="text-center text-gray-600 text-sm mt-2">
            {submitProgress < 30 && "Preparing your data..."}
            {submitProgress >= 30 &&
              submitProgress < 60 &&
              "Uploading files..."}
            {submitProgress >= 60 &&
              submitProgress < 90 &&
              "Processing submission..."}
            {submitProgress >= 90 && "Almost done..."}
          </div>
        )}
      </form>

      <div className="text-center mt-8">
        <a
          href="/"
          className="inline-flex items-center text-red-600 hover:text-red-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default DholRegister;
