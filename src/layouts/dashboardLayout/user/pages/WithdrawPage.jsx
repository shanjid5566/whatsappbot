import { Settings, ClipboardList, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";
import IconWrapper from "../components/IconWrapper";
import WithdrawModal from "../components/WithdrawModal";
import WithdrawDetailsModal from "../components/WithdrawDetailsModal";
import Pagination from "../common/Pagination";

export default function WithdrawPage() {
  const [bankData, setBankData] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [availableBalance, setAvailableBalance] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [bankCurrentPage, setBankCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

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
    const fetchBankData = async () => {
      try {
        const data = await axiosInstance.get("/api/profile/bank");
        // Check if data.data is an array or object and handle accordingly
        if (Array.isArray(data.data)) {
          setBankData(data.data);
        } else if (data.data) {
          // If it's a single object, wrap it in an array
          setBankData([data.data]);
        } else {
          setBankData([]);
        }
      } catch {
        setBankData([]);
      }
    };

    const fetchWithdrawHistory = async () => {
      try {
  const response = await axiosInstance.get("/api/withdrawals/me");
        if (response.data && Array.isArray(response.data.items)) {
          setWithdrawHistory(response.data.items);
        } else if (Array.isArray(response.data)) {
          setWithdrawHistory(response.data);
        } else {
          setWithdrawHistory([]);
        }
      } catch {
        setWithdrawHistory([]);
      }
    };
    fetchAvailableBanks();
    fetchBankData();
    fetchWithdrawHistory();
  }, []);

  const handleWithdrawClick = (bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBank(null);
  };

  const handleDetailsClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedWithdrawal(null);
  };

  // Calculate pagination
  const totalItems = withdrawHistory.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistory = withdrawHistory.slice(startIndex, endIndex);

  // Calculate bank pagination
  const totalBankItems = bankData.length;
  const bankStartIndex = (bankCurrentPage - 1) * itemsPerPage;
  const bankEndIndex = bankStartIndex + itemsPerPage;
  const paginatedBankData = bankData.slice(bankStartIndex, bankEndIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBankPageChange = (pageNumber) => {
    setBankCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:py-8 py-4 px-4 sm:px-6 md:px-8 lg:px-11">
      <div>
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Withdraw
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8">
          Manage your marketing campaigns
        </p>

        {/* Available Balance Card */}

        <div className="bg-gradient-to-r from-[#CB3CDF] to-[#B127C1] text-white rounded-xl p-4 sm:p-8 md:p-10 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4 relative">
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-medium mb-3 sm:mb-4">
              Available Balance
            </p>
            <p className="text-2xl sm:text-3xl md:text-[32px] mb-3 sm:mb-4">
              Rp : {availableBalance}
            </p>
            <p className="text-sm sm:text-base">
              Minimum withdrawal: IDR 10.000
            </p>
          </div>

          <div className="absolute bottom-6 right-6 sm:static sm:mr-8 bg-[#CB6BD7] rounded-lg p-3  mb-4 lg:mb-0">
            <BiMoneyWithdraw className="w-6 h-6 sm:w-10 sm:h-10" />
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Request Withdraw */}
          <div className="flex flex-col">
            <div className="pl-0 ">
              <h2 className="text-xl sm:text-2xl font-medium mb-2">
                Request Withdraw
              </h2>
              <p className="text-[#4B5563] mb-6 sm:mb-8 text-sm sm:text-base">
                Withdraw the entire balance <span className="sm:hidden">to the registered account</span>
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 sm:p-8 flex-1 min-h-80">
              {bankData.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <FiAlertTriangle
                      size={40}
                      className="text-red-400 sm:w-[50px] sm:h-[50px]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-[#000000] mb-3">
                    Bank Data Not Yet Regulated
                  </h3>
                  <p className="text-[#747474] text-sm sm:text-base max-w-[350px] sm:max-w-[410px] mx-auto mb-6 sm:mb-8">
                    You need to set up your bank information first before you
                    can make a withdrawal.
                  </p>

                  <button
                    onClick={() => {
                      navigate("/dashboard/profile");
                    }}
                    className="bg-gradient-to-r from-[#06B5D4] to-[#2564EB] text-sm xl:text-base cursor-pointer text-white px-6 sm:px-7 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto transition"
                  >
                    <Settings className="w-4 h-4 xl:w-6 xl:h-6" />
                    Profile Settings
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[450px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                          SL
                        </th>
                        <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                          Account Holder Name
                        </th>
                        <th className="text-left py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                          Account Number
                        </th>
                        <th className="text-center py-3 px-2 text-sm sm:text-base font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBankData.map((bank, index) => (
                        <tr
                          key={bank.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800 font-medium">
                            {bankStartIndex + index + 1}.
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800">
                            {bank.accountHolderName}
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800">
                            {bank.accountNumber}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <button
                              onClick={() => handleWithdrawClick(bank)}
                              className="bg-gradient-to-r from-[#CB3CDF] to-[#B127C1] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Bank Pagination */}
                  <Pagination
                    currentPage={bankCurrentPage}
                    totalItems={totalBankItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handleBankPageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Withdraw History */}
          <div className="flex flex-col">
            <div className="pl-0 ">
              <h2 className="text-xl sm:text-2xl font-medium mb-2">
                Withdraw History
              </h2>
              <p className="text-[#4B5563] mb-6 sm:mb-8 text-sm sm:text-base">
                Last 10 withdrawals
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 sm:p-8 flex-1">
              {withdrawHistory.length === 0 ? (
                <div className="text-center flex flex-col justify-center items-center h-full py-8">
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <ClipboardList
                      size={40}
                      className="text-gray-400 sm:w-12 sm:h-12"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-[#000000] text-sm sm:text-base">
                    There is no withdrawal history yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
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
                          Approved/Rejected At
                        </th>
                        
                        <th className="py-3 px-2 text-sm sm:text-base font-semibold text-gray-700 text-center">
                          Status
                        </th>
                        <th className="py-3 px-2 text-sm sm:text-base font-semibold text-gray-700 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map((withdrawal, index) => (
                        <tr
                          key={withdrawal.id || index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800 font-medium">
                            {startIndex + index + 1}.
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800">
                            {withdrawal.amountCents}
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800">
                            {withdrawal.requestedAt
                              ? new Date(withdrawal.requestedAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )
                              : "-"}
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800">
                            {withdrawal.status?.toLowerCase() === "rejected"
                              ? (withdrawal.requestedAt
                                  ? new Date(withdrawal.requestedAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )
                                  : "-")
                              : (withdrawal.approvedAt
                                  ? new Date(withdrawal.approvedAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )
                                  : "-")}
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base">
                            <span
                              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold  ${
                                withdrawal.status?.toLowerCase() === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : withdrawal.status?.toLowerCase() ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : withdrawal.status?.toLowerCase() ===
                                    "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {withdrawal.status
                                ? withdrawal.status.charAt(0).toUpperCase() +
                                  withdrawal.status.slice(1).toLowerCase()
                                : "Unknown"}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-sm sm:text-base text-gray-800 text-center">
                            <button 
                              onClick={() => handleDetailsClick(withdrawal)}
                              className="bg-gradient-to-r from-[#CB3CDF] to-[#B127C1] text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition text-center">
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdraw Modal */}
        <WithdrawModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bankData={selectedBank}
        />

        {/* Withdraw Details Modal */}
        <WithdrawDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          withdrawal={selectedWithdrawal}
        />
      </div>
    </div>
  );
}
