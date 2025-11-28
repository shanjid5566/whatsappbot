import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../layouts/mainLayout/homeLayout/Mainlayout";
import Home from "../pages/home/Home";
import Login from "../pages/authentication/login/Login";
import PrivateRoute from "./privateRoutes/PrivateRoute";
import Role from "../auth/role";

import UserDashBoard from "../layouts/dashboardLayout/user/pages/UserDashBoard";
import DashBoardLayOut from "../layouts/dashboardLayout/user/DashBoardLayOut";
import ReferralProgram from "../layouts/dashboardLayout/user/pages/ReferralProgram";
import Profile from "../layouts/dashboardLayout/user/pages/Profile";
import Connectivity from "../layouts/dashboardLayout/user/pages/Connectivity";
import WithdrawPage from "../layouts/dashboardLayout/user/pages/WithdrawPage";
import Register from "../pages/authentication/register/Register";
import WhatsappBot from "../layouts/dashboardLayout/user/pages/WhatsappBot";
import CookiePolicy from "../pages/legal/CookiePolicy";
import Terms from "../pages/legal/Terms";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import NotificationPage from "../layouts/dashboardLayout/user/pages/NotificationPage";
import ForgotPassword from "../pages/authentication/login/ForgotPassword";
import Unauthorized from "../pages/authentication/unauthorized/Unauthorized";
import AdminDashboard from "../layouts/dashboardLayout/admin/pages/AdminDashboard";
import UserManagement from "../layouts/dashboardLayout/admin/pages/UserManagement";
import WithDraw from "../layouts/dashboardLayout/admin/pages/WithDraw";
import UserProfile from "../layouts/dashboardLayout/admin/pages/UserProfile";
import Ticket from "../layouts/dashboardLayout/admin/pages/Ticket";
import Referral from "../layouts/dashboardLayout/admin/pages/ReferralNew";
import CampaignsPage from "../layouts/dashboardLayout/admin/pages/CampaignsPage";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Mainlayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <Home />,
  //     },
  //     {
  //       path: "privacy",
  //       element: <PrivacyPolicy />,
  //     },
  //     {
  //       path: "cookies",
  //       element: <CookiePolicy />,
  //     },
  //     {
  //       path: "terms",
  //       element: <Terms />,
  //     },
  //   ],
  // },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={[Role.USER]}>
        <DashBoardLayOut />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashBoard />,
      },
      {
        path: "userdashboard",
        element: <UserDashBoard />,
      },
      {
        path: "referral",
        element: <ReferralProgram />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "connectivity",
        element: <Connectivity />,
      },
      {
        path: "withdraw",
        element: <WithdrawPage />,
      },
      {
        path: "whatsappbots",
        element: <WhatsappBot />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      // Admin page should require the ADMIN role
      <PrivateRoute allowedRoles={[Role.ADMIN]}>
        <DashBoardLayOut />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "user-management/:id",
        element: <UserProfile />,
      },
      {
        path: "Withdraw",
        element: <WithDraw />,
      },
      {
        path: "referrals",
        element: <Referral />,
      },
      {
        path: "ticket",
        element: <Ticket />,
      },
      {
        path: "campaigns",
        element: <CampaignsPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
