import React, { useState } from "react";
import { Send, Bell, TrendingUp, Headphones } from "lucide-react";
import FeatureListItem from "../components/FeatureListItem";
import TelegramConnectionModal from "../components/TelegramConnectionModal";

// Reusable component for the feature list items

// Main Connectivity Page Component
export default function Connectivity() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-4 lg:py-8 px-4 lg:px-11">
      <div className="mx-auto space-y-6">
        {/* Page Title and Description */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000000] mb-1 md:mb-2">
            Connectivity
          </h1>
          <p className="text-[#656565] text-base md:text-lg lg:text-xl mt-2">
            Manage Telegram connections for notifications and additional
            features
          </p>
        </div>

        {/* Telegram Status Card */}
        <div className="relative p-6 rounded-lg shadow-md overflow-hidden bg-linear-to-r from-[#3375EE] to-[#B127C1] text-white  md:px-6 lg:px-14">
          <div className="flex items-center justify-between mb-2 ">
            <div className="w-full">
              <p className="text-sm md:text-lg lg:text-xl font-medium mb-4 md:mb-6 text-white">
                Telegram Status
              </p>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold  text-white">
                  Not Connected Yet
                </h2>
                <div className="xl:w-18 w-14 h-14 xl:h-18 bg-[#C836DF] flex justify-center items-center rounded-sm">
                  <Send className="w-8 h-8 " />
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm md:text-base text-white">
            Connect to get notifications
          </p>
        </div>

        {/* Two-column layout for Connect Telegram and Withdraw History */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Connect Telegram Card */}
          <div className="bg-[#FFFFFF]  rounded-lg shadow-md space-y-4 rounded-t-xl">
            <div className="text-left bg-linear-to-r from-[#EEF6FF] to-[#DBEAFE] p-4 lg:px-8 xl:px-14 mb-4 md:mb-6 lg:mb-9 rounded-t-xl ">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#000000] mb-1 md:mb-2 lg:mb-4 whitespace-nowrap">
                Connect Telegram
              </h3>
              <p className="text-sm lg:text-base text-[#000000] flex">
                Get notifications<span className="hidden 2xl:block">and additional features</span>
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Send className="w-18 h-18 text-blue-500 my-4 lg:my-1" />
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-[#000000] mb-1 md:mb-2">
                Start Connection
              </p>
              <p className="text-sm lg:text-base xl:text-lg text-[#000000] mb-4">
                Click the button below to get this connection code
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center md:px-6 py-3 bg-[#1D4FD9] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-9/10 mb-4 md:mb-6 lg:mb-8">
                <Send className="w-5 h-5 mr-2" />
                Get Connection Code
              </button>
            </div>
          </div>

          {/* Withdraw History Card (acting as Features List for now) */}
          <div className="bg-[#FFFFFF] rounded-lg shadow-md space-y-4">
            <div className="text-left bg-linear-to-r from-[#FAF5FF] to-[#F3E8FF] p-4 mb-4 md:mb-6 lg:mb-9 lg:px-8 xl:px-14">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#000000] mb-1 md:mb-2 lg:mb-4">
                Withdraw History
              </h3>
              <p className="text-sm lg:text-base text-[#000000]">
                Last 10 withdrawals
              </p>
            </div>

            <div className="space-y-4 p-4 md:px-6 xl:px-14">
              <FeatureListItem
                icon={Bell}
                title="Real-time Notifications"
                description="Get notifications directly on Telegram"
                bgColor="bg-[#DCFCE7]"
              />
              <FeatureListItem
                icon={TrendingUp}
                title="Automatic Report"
                description="Receive daily and weekly reports"
                bgColor="bg-[#DBEAFE]"
              />
              <FeatureListItem
                icon={Headphones}
                title="24/7 Support"
                description="Access direct support via bot"
                bgColor="bg-[#F3E8FF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Connection Modal */}
      <TelegramConnectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}