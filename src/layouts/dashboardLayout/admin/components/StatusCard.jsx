import { CircleAlert, CircleDollarSign, CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axiosInstance";
const StatusCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      color: "bg-gradient-to-r from-[#2AC78F] to-[#12A777]",
      icon: <CircleUser className="w-6 h-6 md:w-8 md:h-8" />,
    },

    {
      label: "Total Referrals Amount",
      value: totalReferrals,
      color: "bg-gradient-to-r from-[#1BC2DE] to-[#10A4C3]",
      icon: <CircleDollarSign className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      label: "Daily Messages",
      value: totalMessages,
      color: "bg-gradient-to-r from-[#F2AC1C] to-[#E28B0E]",
      icon: <CircleDollarSign className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      label: "Total Tickets",
      value: totalTickets,
      color: "bg-gradient-to-r from-[#F45B75] to-[#E73257]",
      icon: <CircleAlert className="w-6 h-6 md:w-8 md:h-8" />,
    },
  ];

  useEffect(() => {
    // Simulate an API call to fetch user data
    const fetchUsers = async () => {
      const response = await axiosInstance.get("/api/auth/admin/users");
      setTotalUsers(response.total);
    };
    const fetchReferrals = async () => {
      const response = await axiosInstance.get(
        "/api/auth/admin/referrals/summary"
      );
      setTotalReferrals(response.totalReferralBalanceCents);
    };
    const fetchTotalMessages = async () => {
      const response = await axiosInstance.get(
        "/api/admin/campaigns/message-stats/overview"
      );
      console.log(response.data)
      setTotalMessages(response.data.totalMessages);
    };
    const fetchTickets = async () => {
      const response = await axiosInstance.get(
        "/api/notifications/admin/tickets/all"
      );
      setTotalTickets(response.total);
    };

    fetchUsers();
    fetchReferrals();
    fetchTotalMessages();
    fetchTickets();
  }, []);

  return (
    <div className="rounded-lg  mb-6 flex items-center gap-2 md:gap-3 lg:gap-4">
      <div className="w-full grid md:grid-cols-2 gap-3 md:gap-4 mb-2 md:mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-6 text-white`}>
            <p className="text-sm md:text-base  mb-2">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <div className="w-10 h-10 md:w-15 md:h-15 bg-white/30 bg-opacity-20 rounded flex items-center justify-center text-white">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCard;
