import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const ValidationItem = ({ isValid, text }) => (
  <div className="flex items-center space-x-2">
    <div
      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
        isValid ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {isValid ? "✓" : "×"}
    </div>
    <span className={`${isValid ? "text-green-600" : "text-red-600"}`}>
      {text}
    </span>
  </div>
);

const PasswordInput = ({ register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false,
    hasSpecial: false,
  });

  const validatePassword = (value) => {
    setValidations({
      minLength: value.length >= 8,
      hasNumber: /\d/.test(value),
      hasLetter: /[a-zA-Z]/.test(value),
      hasSpecial: /[!@#$%^&*]/.test(value),
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const getStrength = () => {
    const trueCount = Object.values(validations).filter(Boolean).length;
    if (trueCount === 4) return 100;
    if (trueCount === 3) return 75;
    if (trueCount === 2) return 50;
    if (trueCount === 1) return 25;
    return 0;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...register("user_password", {
            required: "Password is required",
            onChange: handlePasswordChange,
            validate: {
              length: (value) =>
                value.length >= 8 || "Must be at least 8 characters",
              hasNumber: (value) => /\d/.test(value) || "Must contain a number",
              hasLetter: (value) =>
                /[a-zA-Z]/.test(value) || "Must contain a letter",
              hasSpecial: (value) =>
                /[!@#$%^&*]/.test(value) || "Must contain a special character",
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${getStrength()}%`,
            backgroundColor:
              getStrength() <= 25
                ? "#ef4444"
                : getStrength() <= 50
                ? "#eab308"
                : getStrength() <= 75
                ? "#22c55e"
                : "#15803d",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <ValidationItem
          isValid={validations.minLength}
          text="At least 8 characters"
        />
        <ValidationItem
          isValid={validations.hasNumber}
          text="Contains a number"
        />
        <ValidationItem
          isValid={validations.hasLetter}
          text="Contains a letter"
        />
        <ValidationItem
          isValid={validations.hasSpecial}
          text="Contains !@#$%^&*"
        />
      </div>

      {errors.user_password && (
        <p className="text-red-500 text-sm mt-1">
          {errors.user_password.message}
        </p>
      )}
    </div>
  );
};

const UserRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        "https://backend.onetouchmoments.com/user_controller/user_register/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === 1) {
        setSuccess("Registration successful! Redirecting to login...");
        reset();
        // Store user data in session storage
        sessionStorage.setItem("user_email", data.user_email);
        sessionStorage.setItem("user_password", data.user_password);
        sessionStorage.setItem("user_data", JSON.stringify(result.data[0]));
        setTimeout(() => {
          navigate("/UserLogin");
        }, 2000);
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4">
      <div className="max-w-[490px] mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <p className="text-center py-3 text-xl font-semibold">
            Create Your Account (As A user)
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register("user_name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name should only contain letters and spaces",
                  },
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              {errors.user_name && (
                <p className="text-red-600 text-sm">
                  {errors.user_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register("user_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              {errors.user_email && (
                <p className="text-red-600 text-sm">
                  {errors.user_email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("user_phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                })}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              {errors.user_phone && (
                <p className="text-red-600 text-sm">
                  {errors.user_phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <PasswordInput register={register} errors={errors} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/UserLogin"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
