import React, { useState } from 'react';
import SideBar from '../../../components/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../../../components/ScrollToTop/ScrollToTop';

const DashBoardLayOut = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Use static class for large screen margin */}
      <main className="flex-1 bg-[#F3F4F6] lg:ml-[304px]  pt-14 lg:pt-0">
        <Outlet />
        <ScrollToTop />
      </main>
    </div>
  );
};

export default DashBoardLayOut;
