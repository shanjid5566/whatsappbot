import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Link as ReactScrollLink } from "react-scroll";
import { getCurrentUser, logout } from "../../auth/auth";
import ProfileDropDown from "./Component/ProfileDropDown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  const user = getCurrentUser();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: "Features", path: "features" },
    { name: "How It Works", path: "works" },
    { name: "Reviews", path: "reviews" },
  ];

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const updateNavHeight = () => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setNavHeight(rect.bottom);
    }
  };

  // Initial measure before first paint
  useLayoutEffect(() => {
    updateNavHeight();
  }, []);

  // Keep height in sync on nav resize, window resize, and page load
  useEffect(() => {
    const target = navRef.current;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateNavHeight()) : null;
    if (ro && target) ro.observe(target);

    window.addEventListener("resize", updateNavHeight);
    window.addEventListener("load", updateNavHeight);

    return () => {
      if (ro && target) ro.unobserve(target);
      window.removeEventListener("resize", updateNavHeight);
      window.removeEventListener("load", updateNavHeight);
    };
  }, []);

  // Recalculate right before showing the menu to avoid stale value
  useEffect(() => {
    if (isMenuOpen) updateNavHeight();
  }, [isMenuOpen]);

  return (
    <nav ref={navRef} className="bg-white mt-5 lg:mt-10 relative z-50">
      <div className="container paddingContainer">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex shrink-0">
            <Link
              to="/"
              className="text-xl sm:text-2xl lg:text-[32px] font-normal text-gray-900"
            >
              Bulk Whatsapp
            </Link>
          </div>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden lg:flex items-center ml-2 lg:space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              isHomePage ? (
                <ReactScrollLink
                  key={link.name}
                  to={link.path}
                  spy={true}
                  smooth={true}
                  offset={-120}
                  duration={800}
                  activeClass="text-[#3574ED] font-semibold"
                  className="text-black hover:text-gray-900 text-[16px] font-normal transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </ReactScrollLink>
              ) : (
                <Link
                  key={link.name}
                  to={`/#${link.path}`}
                  className="text-black hover:text-gray-900 text-[16px] font-normal transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop & Tablet Auth Buttons */}
          <div className="hidden lg:flex items-center justify-end space-x-4 min-w-[260px]">
            {user?.isAuthenticated ? (
              <ProfileDropDown />
            ) : (
              <>
                <Link
                  to="/"
                  className="px-6 lg:px-8 lg:py-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 lg:px-8 py-2 lg:py-3 text-sm font-normal text-white bg-[#3574ED] rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`lg:hidden fixed left-0 right-0 bottom-0 bg-black z-40 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-30 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: `${navHeight}px` }}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu */}
      <div
        className={`lg:hidden absolute left-0 right-0 top-full z-50 bg-white shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container paddingContainer pt-2 pb-4 space-y-3 border-t border-gray-200">
          {/* User header (avatar + name + role) for small devices */}
          {user?.isAuthenticated && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-md">
              <img
                src="https://randomuser.me/api/portraits/men/60.jpg"
                alt="profile avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate line-clamp-1">
                  {user?.user?.fullName || user?.name || "User"}
                </p>
                {(user?.user?.role || user?.role) && (
                  <p className="text-xs text-gray-500 truncate">
                    {user?.user?.role || user?.role}
                  </p>
                )}
              </div>
            </div>
          )}
          {navLinks.map((link) => (
            isHomePage ? (
              <ReactScrollLink
                key={link.name}
                to={link.path}
                spy={true}
                smooth={true}
                offset={-120}
                duration={800}
                activeClass="text-[#3574ED] font-semibold"
                className="block px-3 text-sm sm:text-[16px] font-medium cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </ReactScrollLink>
            ) : (
              <Link
                key={link.name}
                to={`/#${link.path}`}
                className="block px-3 text-sm sm:text-[16px] font-medium cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="pt-4 space-y-2">
            {user?.isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  window.location.reload();
                }}
                className="block w-full px-3 py-2 text-center text-sm sm:text-[16px] font-medium text-white bg-red-400 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/"
                  className="block w-full px-3 py-2 text-center text-base font-medium text-black border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-3 py-2 text-center text-base font-medium text-white bg-[#3574ED] rounded hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
