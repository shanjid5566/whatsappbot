import React, { useState, useEffect } from "react";
import auth from "../../../auth/auth";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import ROLE from "../../../auth/role";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = Cookies.get("rememberedEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Custom Checkbox component to match the purple style
  const CustomCheckbox = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await auth.loginWithEmail(email.trim(), password);

      if (!res.success) {
        // Better error message handling
        const errorMsg = res.message?.toLowerCase() || "";
        
        // Check for specific error types
        if (errorMsg.includes("user not found") || 
            errorMsg.includes("email not found") || 
            errorMsg.includes("user does not exist") ||
            errorMsg.includes("no user found")) {
          setMessage("Email doesn't match. Please check your email address.");
        } else if (errorMsg.includes("invalid password") || 
                   errorMsg.includes("incorrect password") || 
                   errorMsg.includes("password is incorrect") ||
                   errorMsg.includes("wrong password")) {
          setMessage("Password doesn't match. Please check your password.");
        } else if (errorMsg.includes("invalid credentials")) {
          setMessage("Invalid email or password. Please try again.");
        } else {
          // Fallback to original error message
          setMessage(res.message || "Login failed. Please try again.");
        }
        
        setIsLoading(false);
        return;
      }

      // Save or clear credentials based on Remember Me checkbox
      if (rememberMe) {
        // Only save email in cookie for 30 days, not password for security
        Cookies.set("rememberedEmail", email.trim(), {
          expires: 30,
          secure: true, // Only transmitted over HTTPS
          sameSite: "strict", // CSRF protection
        });
      } else {
        Cookies.remove("rememberedEmail");
      }

      // Redirect to appropriate dashboard based on user role
      if (res.user.role === ROLE.ADMIN) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Title with Back Button */}
        <div className="flex items-center gap-4 mb-4 md:mb-6 lg:mb-8 w-full max-w-lg justify-center">
          <div className="md:w-1/4 mt-2">
            <button
              onClick={()=>{navigate('/')}}
              className="px-4 py-2 text-black  transition-colors rounded cursor-pointer"
            >
              <ArrowLeft  />
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black w-4/6 md:w-3/4 ">
            Bulk Whatsapp
          </h1>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-xs md:max-w-lg lg:max-w-xl p-6 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-lg">
          {/* Card Title */}

          <h2 className="text-xl sm:text-xl  md:text-2xl lg:text-3xl font-bold text-black mb-3 md:mb-8">
            Welcome Back
          </h2>

          <form onSubmit={handleEmailLogin}>
            {/* Email Field */}
            <div className="mb-3 md:mb-5">
              <label
                htmlFor="email"
                className="block text-base md:text-lg lg:text-xl text-black mb-2 text-left"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                required
                placeholder="enter your email here"
                className="w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
              />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="************"
                  required
                  className="w-full px-4 py-3 bg-[#F4F4F4] text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password Link */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <CustomCheckbox
                id="remember-me"
                label="Remember Me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <Link to={'/forgot-password'} className="text-sm text-black hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-2 md:p-3 px-4 bg-[#BD31CE] text-[#FFFCFC] font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BD31CE]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          {message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <p className="text-sm text-red-600 font-medium">{message}</p>
            </div>
          )}

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 mt-4 md:mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#BD31CE] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
