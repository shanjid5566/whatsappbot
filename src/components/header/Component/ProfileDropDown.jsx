import { FiBell, FiSettings } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { getCurrentUser, logout } from "../../../auth/auth";

const ProfileDropDown = () => {
  const user = getCurrentUser()
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logOutHandler = async () => {
    await logout();
    window.location.reload();
    navigate("/");
  };
  

  // click outside close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative flex items-end justify-center gap-3"
      ref={dropdownRef}
    >
      {/* user info - shown first on desktop */}
      <div className="hidden lg:flex flex-col items-end">
        <p className="text-gray-900 text-sm font-semibold leading-tight">
          {user?.user?.fullName || user?.name || "User"}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">{user?.user?.role || user?.role || "Member"}</p>
      </div>

      {/* avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className=" flex items-center justify-center w-11 h-11 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#3574ED] transition-all duration-200 group"
      >
        <img
          src="https://randomuser.me/api/portraits/men/60.jpg"
          alt="profile avatar"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
        {/* Online status indicator */}
        
        <span className="absolute -bottom-4 right-0 text-xs text-green-500">online</span>
      </button>

      {/* dropdown menu with premium styling */}
      <div
        className={`absolute top-12 right-0 w-56 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right transition-all duration-200 ease-out
        ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
      >
        {/* User info header in dropdown */}
        <div className="px-4 py-3 bg-linear-to-br from-gray-50 to-white border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.user?.fullName || user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {user?.user?.email || user?.email || "user@example.com"}
          </p>
        </div>

        {/* Menu items */}
        <div className="py-2 px-2">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3574ED] rounded-lg transition-all duration-150 group"
          >
            <MdOutlineDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-2"></div>

          {/* Logout */}
          <button
            onClick={logOutHandler}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-red-50 text-red-600 rounded-lg transition-all duration-150 group"
          >
            <RiLogoutBoxRLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
