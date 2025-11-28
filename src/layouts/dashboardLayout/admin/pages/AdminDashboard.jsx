import RecentSingup from "../components/RecentSingup";
import StatusCard from "../components/StatusCard";
import SystemOperationBanner from "../components/SystemOperationBanner";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen py-2 md:py-8 px-4 lg:px-11 relative z-0">
      <div className="mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000000] mb-2">
          Admin Overview
        </h2>
        <p className="text-base md:text-lg text-[#313131]">
          Monitor system health and manage platform operations
        </p>
      </div>
      <SystemOperationBanner />
      <StatusCard />
      <RecentSingup />
    </div>
  );
};

export default AdminDashboard;
