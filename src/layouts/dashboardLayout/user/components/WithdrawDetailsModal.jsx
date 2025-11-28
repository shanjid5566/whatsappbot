import { X, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function WithdrawDetailsModal({ isOpen, onClose, withdrawal }) {
  if (!isOpen || !withdrawal) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-4 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Withdrawal Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          {getStatusIcon(withdrawal.status)}
          <div className="flex-1">
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(
                withdrawal.status
              )}`}
            >
              {withdrawal.status
                ? withdrawal.status.charAt(0).toUpperCase() +
                  withdrawal.status.slice(1).toLowerCase()
                : "Unknown"}
            </span>
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-linear-to-r from-[#CB3CDF] to-[#B127C1] text-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-sm opacity-90 mb-2">Withdrawal Amount</p>
          <p className="text-3xl sm:text-4xl font-bold">
            Rp {withdrawal.amountCents?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Transaction Time
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Requested At</p>
              <p className="text-base font-medium text-gray-800">
                {formatDate(withdrawal.requestedAt)}
              </p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {withdrawal.status?.toLowerCase() === "rejected" 
                  ? "Rejected At" 
                  : "Approved At"}
              </p>
              <p className="text-base font-medium text-gray-800">
                {withdrawal.status?.toLowerCase() === "rejected"
                  ? formatDate(withdrawal.requestedAt)
                  : formatDate(withdrawal.approvedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        {withdrawal.bankSnapshot && (
          <div className="pt-2 sm:pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Bank Account Information
            </h3>
            <div className="bg-linear-to-r from-[#EEF6FF] to-[#DBEAFE] p-4 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Account Holder Name
                </span>
                <span className="text-base font-medium text-gray-800">
                  {withdrawal.bankSnapshot.accountHolderName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bank Name</span>
                <span className="text-base font-medium text-gray-800">
                  {withdrawal.bankSnapshot.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="text-base font-medium text-gray-800">
                  {withdrawal.bankSnapshot.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Branch</span>
                <span className="text-base font-medium text-gray-800">
                  {withdrawal.bankSnapshot.branch}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Routing Number</span>
                <span className="text-base font-medium text-gray-800">
                  {withdrawal.bankSnapshot.routingNumber}
                </span>
              </div>
              {withdrawal.bankSnapshot.username && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Username</span>
                  <span className="text-base font-medium text-gray-800">
                    {withdrawal.bankSnapshot.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
