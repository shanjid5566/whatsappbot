import React, { useState, useEffect } from "react";
import auth from "../../../auth/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../../config/axiosInstance";

const Register = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const navigate = useNavigate();

  // debug: location inspected during development

  // Extract referral code from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [location.search]);
  // Validation handlers
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Please fill in your full name.");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Please provide your email address.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
  };

  const validatePassword = (value) => {
    if (value.length === 0) {
      setPasswordError("");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      if (!hasLetter || !hasNumber) {
        setPasswordError("Password must contain both letters and numbers.");
      } else {
        setPasswordError("");
      }
    }
  };

  const validateConfirmPassword = (value) => {
    if (value.length === 0) {
      setConfirmPasswordError("");
    } else if (password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Change handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    // Re-validate confirm password if it has value
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  // Custom Checkbox component to match the purple style
  const CustomCheckbox = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden" // Hide the default checkbox
      />
      {/* Custom checkbox visual */}
      <span
        className={`w-5 h-5 flex items-center justify-center rounded border-2 ${
          checked ? "bg-[#BD31CE] border-[#BD31CE]" : "bg-white border-gray-300"
        } transition-colors`}
      >
        {/* Checkmark icon (only visible when checked) */}
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <span className="text-sm text-black">{label}</span>
    </label>
  );

  const handleRegister = async (e) => {
    e.preventDefault();

    // Run all validations on submit
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    // Check if there are any errors
    let hasError = false;

    if (!name.trim()) {
      hasError = true;
    }

    if (!email.trim()) {
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        hasError = true;
      }
    }

    if (password.length < 8) {
      hasError = true;
    } else {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);

      if (!hasLetter || !hasNumber) {
        hasError = true;
      }
    }

    if (password !== confirmPassword) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    // Register user with backend API
    try {
      const res = await auth.registerWithEmail(
        name,
        email,
        password,
        confirmPassword
      );

      if (!res.success) {
        setMessage(res.message);
        setIsLoading(false);
        return;
      }

      // If registration successful and referral code exists, accept the referral
      if (referralCode) {
        try {
          await axiosInstance.post("/api/referrals/accept", {
            referralCode: referralCode,
          });
        } catch {
          // referral acceptance failed (suppressed)
        }
      }

      // Registration successful - redirect to login
      setMessage("");
      window.location.href = "/";
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Main Title with Back Button */}
        <div className="flex items-center gap-4 mb-4 md:mb-6 lg:mb-8 w-full max-w-lg justify-center">
          <div className="md:w-1/4 mt-2">
            <button
              onClick={() => {
                navigate('/');
              }}
              className="px-4 py-2 text-black  transition-colors rounded cursor-pointer"
            >
              <ArrowLeft />
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black w-4/6 md:w-3/4 ">
            Bulk Whatsapp
          </h1>
        </div>

        {/* Login Card */}
        <div className="w-xs md:w-lg lg:w-xl p-6 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-lg">
          {/* Card Title */}
          <div>
            <h2 className="text-xl sm:text-xl  md:text-2xl lg:text-3xl font-bold text-black mb-1 md:mb-2">
              Create Account
            </h2>
            <p className="text-sm md:text-base text-[#565656] mb-3 md:mb-6 lg:mb-8">
              Start your free trial today
            </p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="mb-1 md:mb-3">
              <label
                htmlFor="first_name"
                className="block text-base md:text-lg lg:text-xl text-black mb-2 text-left"
              >
                Full Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={name}
                onChange={handleNameChange}
                placeholder="First Name"
                required
                className={`w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 ${
                  nameError
                    ? "focus:ring-red-500 ring-2 ring-red-500"
                    : "focus:ring-[#BD31CE]/50"
                } placeholder:text-gray-400`}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600">{nameError}</p>
              )}
            </div>
            {/* Email Field */}
            <div className="mb-1 md:mb-5">
              <label
                htmlFor="email"
                className="block text-base md:text-lg lg:text-xl text-black mb-2 text-left"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="enter your email here"
                required
                className={`w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 ${
                  emailError
                    ? "focus:ring-red-500 ring-2 ring-red-500"
                    : "focus:ring-[#BD31CE]/50"
                } placeholder:text-gray-400`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3 md:mb-5">
              <label
                htmlFor="password"
                className="block text-base md:text-lg lg:text-xl text-black mb-2 text-left"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "focus:ring-red-500 ring-2 ring-red-500"
                      : "focus:ring-[#BD31CE]/50"
                  } placeholder:text-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            {/* Confirm Password Field */}
            <div className="mb-3 md:mb-5">
              <label
                htmlFor="confirm-password"
                className="block text-base md:text-lg lg:text-xl text-black mb-2 text-left"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Re-enter your password"
                  required
                  className={`w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 ${
                    confirmPasswordError
                      ? "focus:ring-red-500 ring-2 ring-red-500"
                      : "focus:ring-[#BD31CE]/50"
                  } placeholder:text-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            {message && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{message}</p>
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-2 md:p-3 px-4 bg-[#BD31CE] text-[#FFFCFC] font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          {/* Error Message */}

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 mt-4 md:mt-8">
            Already have an account?{" "}
            <Link
              to={"/"}
              className="font-medium text-[#BD31CE] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
