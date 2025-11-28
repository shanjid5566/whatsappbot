import React from "react";
import AdminNavbar from "./components/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <section className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto ">
        <AdminNavbar />
        <main>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
