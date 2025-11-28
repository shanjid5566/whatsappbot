import React, { useEffect, useState } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { TbMoneybag } from "react-icons/tb";
import WhatsappActiveCard from "../components/statusCards/WhatsappActiveCard";
import WhatsappDisconnectedCard from "../components/statusCards/WhatsappDisconnectedCard";
import TodaysBlastCard from "../components/statusCards/TodaysBlastCard";
import TodaysEarningsCard from "../components/statusCards/TodaysEarningsCard";
import { useProfile } from "../../../../context/ProfileContext";
import axiosInstance from "../../../../config/axiosInstance";

export default function UserDashBoard() {
  const [userName, setUserName] = useState("User");
  const [joinDate, setJoinDate] = useState("");
  const [availableBalance, setAvailableBalance] = useState();

  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchAvailableBanks = async () => {
      try {
        const data = await axiosInstance.get("/api/referrals/my-earnings");
        setAvailableBalance(data.data.balanceCents);
        // Check if data.data is an array or object and handle accordingly
      } catch {
        // suppressed
      }
    };
    fetchAvailableBanks();
  }, []);

  useEffect(() => {
    try {
      const current = profile || null;
      const name =
        current?.data?.fullName ||
        current?.fullName ||
        current?.name ||
        current?.email ||
        "User";
      setUserName(name);

      const rawDate =
        current?.data?.joinDate ||
        current?.data?.createdAt ||
        current?.joinDate ||
        current?.createdAt ||
        null;
      if (rawDate) {
        let d;
        if (typeof rawDate === "number") {
          d = new Date(rawDate * (rawDate < 1e12 ? 1000 : 1));
        } else {
          d = new Date(rawDate);
        }
        if (!isNaN(d)) {
          setJoinDate(
            d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }
      } else {
        setJoinDate("");
      }
    } catch {
      setUserName("User");
      setJoinDate("");
    }
  }, [profile, profileLoading]);

  return (
    <div className="min-h-screen py-2 md:py-8 px-4 lg:px-11 relative z-0 ">
      <div className="">
        {/* Header */}

        <h1 className="text-3xl sm:text-4xl font-bold mb-0 md:mb-2">
          Dashboard
        </h1>

        <p className="text-gray-600 text-lg sm:text-xl mb-4 md:mb-8">
          Welcome to your user portal, {userName}!
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <WhatsappActiveCard />
          <WhatsappDisconnectedCard />
          <TodaysBlastCard />
          <TodaysEarningsCard />
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-lg p-4 sm:p-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">BALANCE</h2>
              <div className="bg-[#CC6BD7] p-1.5 sm:p-2 rounded-lg text-white">
                <TbMoneybag size={26} className="sm:size-[34px]" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl mt-5 sm:mt-7">{availableBalance}</p>
          </div>

          {/* Add Bot Card */}
          <Link
            to="/dashboard/whatsappbots"
            className="bg-white rounded-lg p-4 sm:p-8"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">ADD BOT</h2>
              <div className="bg-[#00DEF9] rounded-lg p-1.5 sm:p-2">
                <Plus size={26} className="text-white sm:size-[34px]" />
              </div>
            </div>
            <p className="text-[#000000] text-sm sm:text-base mt-8 sm:mt-16">
              Manage WhatsApp Bot
            </p>
          </Link>

          {/* Withdraw Card */}
          <Link
            to="/dashboard/withdraw"
            className="bg-white rounded-lg p-4 sm:p-8"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">WITHDRAW</h2>
              <div className="bg-[#00DEF9] rounded-lg p-1.5 sm:p-2">
                <BiMoneyWithdraw
                  className="text-white sm:size-[34px]"
                  size={26}
                />
              </div>
            </div>
            <p className="text-[#000000] text-sm sm:text-base mt-8 sm:mt-16">
              Withdraw Balance
            </p>
          </Link>
        </div>
        {/* Referral Program Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Referral Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Referral Program
            </h2>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-600 text-base mb-2">Referral Program</p>

                <p className="text-3xl sm:text-4xl font-bold">0</p>
              </div>
              <div className="text-right mt-12 sm:mt-20">
                <p className="text-gray-600 text-base ">Commission Rate</p>
                <p className="flex items-baseline justify-end text-2xl font-semibold">
                  Rp. 50
                  <span className="text-base font-normal ml-1">/order</span>
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/referral"
              className="text-blue-600 text-base font-semibold hover:underline"
            >
              View referral details →
            </Link>
          </div>
          {/* Right Referral Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Referral Program
            </h2>
            <hr className="my-4 border-gray-200" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-base text-gray-600">Rate per message:</p>
                <p className="text-base font-semibold text-gray-900">Rp. 600</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base text-gray-600">Minimum withdrawal:</p>
                <p className="text-base font-semibold text-gray-900">
                  Rp. 10,000
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base text-gray-600">Member since:</p>
                <p className="text-base font-semibold text-gray-900">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
