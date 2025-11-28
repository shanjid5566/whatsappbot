import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Shield } from "lucide-react";
import axiosInstance from "../../../config/axiosInstance";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step control: 'email' → ask email; 'reset' → enter OTP + new password
  const [step, setStep] = useState("email");

  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // UI state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(""); // 'success' | 'error' | ''
  const [message, setMessage] = useState("");

  // timers
  const stepTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);

  // resend cooldown
  const [cooldown, setCooldown] = useState(0);
  const cooldownIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
    };
  }, []);

  const startCooldown = (seconds = 60) => {
    setCooldown(seconds);
    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    cooldownIntervalRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownIntervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const goStepResetSoon = () => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    stepTimerRef.current = setTimeout(() => {
      setStep("reset");
      setMessage("");
      setMessageType("");
    }, 1200);
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) throw new Error("Email is required.");

      const res = await axiosInstance.post("/api/auth/forgot-password", {
        email: normalizedEmail,
      });

      setMessageType("success");
      setMessage(res.data?.message || "OTP has been sent. Check your inbox.");
      goStepResetSoon();
      startCooldown(60);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.replace(/\D/g, "").slice(0, 6);

    // client checks
    if (!normalizedEmail) {
      setMessageType("error");
      setMessage("Email is required.");
      return;
    }
    if (cleanOtp.length !== 6) {
      setMessageType("error");
      setMessage("Please enter the 6-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/reset-password", {
        email: normalizedEmail,
        otp: cleanOtp,
        newPassword,
        confirmNewPassword,
      });

      setMessageType("success");
      setMessage(
        res.data?.message || "Password reset successful! Redirecting…"
      );

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to reset password. Check your OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Real resend (does NOT jump back a step)
  const handleResend = async () => {
    if (cooldown > 0 || !email.trim()) return;
    setMessage("");
    setMessageType("");
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await axiosInstance.post("/api/auth/forgot-password", {
        email: normalizedEmail,
      });
      setMessageType("success");
      setMessage("OTP resent. Check your inbox.");
      startCooldown(60);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6">
          Bulk Whatsapp
        </h1>

        <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-2xl shadow-lg">
          {step === "email" && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">
                  Forgot Password?
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Enter your email and we’ll send you a one-time code (OTP).
                </p>
              </div>

              <form onSubmit={handleRequestOTP}>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-lg text-black mb-2 text-left"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="enter your email here"
                      className="w-full px-4 py-3 pl-11 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {message && (
                  <div
                    className={`mb-4 p-3 rounded-lg border ${
                      messageType === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        messageType === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full p-3 bg-[#BD31CE] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#BD31CE] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">
                  Reset Password
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Enter the OTP sent to{" "}
                  <span className="font-semibold">{email}</span> and your new
                  password.
                </p>
              </div>

              <form onSubmit={handleResetPassword}>
                {/* OTP */}
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="block text-lg text-black mb-2 text-left"
                  >
                    OTP Code
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 pl-11 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
                    />
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* New password */}
                <div className="mb-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-lg text-black mb-2 text-left"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full px-4 py-3 pl-11 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div className="mb-5">
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-lg text-black mb-2 text-left"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full px-4 py-3 pl-11 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    className={`mb-4 p-3 rounded-lg border ${
                      messageType === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        messageType === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    otp.replace(/\D/g, "").length !== 6 ||
                    newPassword.length < 6 ||
                    newPassword !== confirmNewPassword
                  }
                  className="w-full p-3 bg-[#BD31CE] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={handleBackToEmail}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#BD31CE] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Email Address
                </button>

                <div className="text-sm text-gray-600">
                  Didn’t receive OTP?{" "}
                  <button
                    onClick={handleResend}
                    disabled={isLoading || cooldown > 0}
                    className="text-[#BD31CE] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#BD31CE] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
