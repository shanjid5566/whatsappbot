import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import {
  LayoutDashboard,
  Settings,
  User,
  Users,
  Wallet,
  BarChart,
  MessageSquareCodeIcon,
  DollarSign,
  Tickets,
  Megaphone,
  Repeat2,
} from "lucide-react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { logout, getCurrentUser } from "../../auth/auth";
import ROLE from "../../auth/role";
import { TbBrandCampaignmonitor } from "react-icons/tb";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  // User menu items
  const userMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "userdashboard" },
    { name: "Referral", icon: Users, path: "referral" },
    { name: "Withdraw", icon: Wallet, path: "withdraw" },
    { name: "Profile", icon: User, path: "profile" },
    { name: "Connectivity", icon: Settings, path: "connectivity" },
    { name: "WhatsApp Bots", icon: FaWhatsapp, path: "whatsappbots" },
    {
      name: "Notifications",
      icon: MessageSquareCodeIcon,
      path: "notifications",
    },
  ];

  // Admin menu items
  const adminMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "User Management", icon: Users, path: "/admin/user-management" },
    { name: "Withdraw", icon: DollarSign, path: "/admin/Withdraw" },
    { name: "Referrals", icon: Repeat2 , path: "/admin/referrals" },
    { name: "Tickets", icon: Tickets, path: "/admin/ticket" },
    { name: "Campaigns", icon: Megaphone, path: "/admin/campaigns" }
  
  ];

  // Determine which menu to show based on current user's role
  const currentUser = getCurrentUser();
  const isAuthenticated = currentUser?.isAuthenticated;
  const isAdmin = currentUser?.role === ROLE.ADMIN;

  // If not authenticated, don't render the sidebar (or render minimal UI)
  if (!isAuthenticated) return null;

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button (only when sidebar is closed) */}
      {!sidebarOpen && (
        <div className="lg:hidden fixed bg-white w-full z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 hover:bg-gray-50 transition-all duration-200 rounded-full "
          >
            <HiMenuAlt2 className="w-8 h-7 text-gray-700" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-[#FFFFFF] shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out
                  fixed inset-y-0 left-0 z-50 w-[304px] xl:pl-9 pt-10 flex flex-col`}
      >
        {/* Mobile Close Button */}
        {sidebarOpen && (
          <div className="lg:hidden absolute top-4 right-4 z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <HiX className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="px-6 pb-4 text-2xl font-bold text-gray-800">
            My Dashboard
          </Link>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin" || item.path === "userdashboard"}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg mb-1  transition-all duration-300 ${
                      isActive ||
                      (item.path === "userdashboard" &&
                        window.location.pathname === "/dashboard") ||
                      (item.path === "/admin" &&
                        window.location.pathname === "/admin")
                        ? "bg-[#EFF6FF] font-semibold shadow-sm"
                        : "border-transparent text-black hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button at the bottom */}
        <div className="border-t mr-12 ml-12 lg:ml-0 border-[#A0A0A0]">
          <div className="px-6 py-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center border p-2 border-gray-400 gap-3 px-4 py-3  text-left rounded-lg text-white cursor-pointer bg-black  transition-all duration-200"
            >
              <RiLogoutBoxLine className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
