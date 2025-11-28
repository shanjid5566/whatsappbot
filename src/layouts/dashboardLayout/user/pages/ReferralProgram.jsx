import { useEffect, useState } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { get } from "../../../../service/apiService";
import TodaysEarningsCard from "../components/statusCards/TodaysEarningsCard";
import WhatsappActiveCard from "../components/statusCards/WhatsappActiveCard";
import WhatsappDisconnectedCard from "../components/statusCards/WhatsappDisconnectedCard";
import StepsSectionCard from "../components/StepsSectionCard";

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referralList, setReferralList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  // Fetch referral link
  useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        const response = await get("/api/referrals/my-share-link");
        if (response?.success) {
          setReferralLink(response.shareLink || "");
        }
      } catch {
        // suppressed
      } finally {
        setLoading(false);
      }
    };
    fetchReferralLink();
  }, []);

  // Fetch referral list
  useEffect(() => {
    const fetchReferralList = async () => {
      try {
        const response = await get("/api/referrals/my-list");
        if (response?.success && response?.data) {
          setReferralList(response.data);
        }
      } catch {
        // suppressed
      } finally {
        setListLoading(false);
      }
    };
    fetchReferralList();
  }, []);

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-4 md:py-8 px-3 sm:px-5 md:px-8 lg:px-11 w-full">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        Referral Program
      </h1>
      <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 md:mb-8">
        Invite friends and earn commission from their earnings
      </p>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <WhatsappActiveCard />
        <WhatsappDisconnectedCard />
        <TodaysEarningsCard />
      </div>

      {/* Campaign Section */}
      <div className="bg-gradient-to-r from-[#CA3BDE] to-[#B228C1] text-white rounded-lg p-4 sm:p-6 md:p-8 mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-3 sm:mb-4">
          Campaign Name
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#E383EF] rounded-lg p-3 xl:p-4 mb-6">
          <input
            type="text"
            value={loading ? "Loading..." : referralLink}
            readOnly
            placeholder="Your referral link will appear here"
            className="flex-1 w-full rounded-md border-0 text-white placeholder-white placeholder-opacity-70 focus:outline-none bg-transparent text-sm sm:text-base"
          />
          <button
            onClick={handleCopyLink}
            disabled={!referralLink || loading}
            className="rounded-md bg-white text-[#747474] px-4 py-2 sm:px-6 text-sm sm:text-base transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-center"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <p className="text-white text-opacity-90 text-xs sm:text-sm md:text-base mb-1">
          Earn commission from each of your referrals' earnings
        </p>
        <p className="text-white text-opacity-90 text-xs sm:text-sm md:text-base">
          Share this link with your friends and start earning commissions!
        </p>
      </div>

      {/* How It Works Section */}
      <div className="mb-8 bg-white rounded-lg px-3 sm:px-6 md:px-8 py-6">
        <div className="border-b mb-4 sm:mb-6 border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
            How the Referral Program Works
          </h2>
        </div>
        <StepsSectionCard />
      </div>

      {/* Referral List Section */}
      <div className="bg-white rounded-lg px-3 sm:px-6 md:px-8 py-6 ">
        <div className="border-b mb-6 sm:mb-8 border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-2">
            Referral List
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-3">
            All friends who register using your referral link
          </p>
        </div>

        {listLoading ? (
          <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        ) : referralList.length === 0 ? (
          <div className="rounded-lg p-4 text-center w-full transition">
            <HiOutlineUsers
              size={40}
              className="text-[#08A171] mx-auto mb-3 sm:mb-5"
            />
            <h3 className="text-base sm:text-lg md:text-xl text-[#000000] font-medium mb-1">
              Share Link
            </h3>
            <p className="text-[#555555] text-xs sm:text-sm md:text-base">
              Share your referral link with your friends on WhatsApp
            </p>
          </div>
        ) : (
        
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                    SL
                  </th>
                  <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                    Requested At
                  </th>
                  <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                    Approved At
                  </th>
                  <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {referralList.map((referral, index) => (
                  <tr
                    key={referral.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-gray-600">
                      {index + 1}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-gray-900">
                      {referral.referredUser.fullName}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-gray-600">
                      {referral.referredUser.email}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-gray-600">
                      {new Date(referral.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          referral.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
