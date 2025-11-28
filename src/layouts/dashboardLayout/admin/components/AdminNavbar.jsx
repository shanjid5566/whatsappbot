import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../../../auth/auth";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const user = getCurrentUser();
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const logOutHandler = () => {
    logout();
    // window.location.reload();
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
    <header className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pt-5 pb-10 md:pt-10 md:pb-20 ">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg bg-[#0051FF] flex items-center justify-center shadow-sm"></div>
            <Link
              to="/admin"
              className="text-xl md:text-2xl font-semibold text-[#0051FF]"
            >
              Bulk Whatsapp
            </Link>
          </div>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#E4F5EB] `}
            >
              <span className="w-2 h-2 rounded-full bg-[#00FF69] block" />
              <span className="text-base font-medium text-[#5B5B5B]">
                Active
              </span>
            </div>

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
            </button>
            {/* mobile-only small green dot centered under avatar */}
            <div className="md:hidden absolute top-7 right-0 flex justify-center mt-1">
              <span
                className="w-3 h-3 bg-[#00FF69] rounded-full border-2 border-white"
                aria-hidden="true"
              />
            </div>

            {/* dropdown menu with premium styling */}
            <div
              className={`absolute top-12 right-0 w-56 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right transition-all duration-200 ease-out
                    ${
                      open
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
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
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
