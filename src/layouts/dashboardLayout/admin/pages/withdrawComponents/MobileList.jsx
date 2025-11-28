import React from "react";
import { Check, X } from "lucide-react";

const MobileList = ({
  items,
  loading,
  activeTab,
  processingIds,
  approveWithdrawal,
  confirmReject,
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
}) => {
  return (
    <div className="md:hidden p-4 space-y-3">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500">No {activeTab.toLowerCase()} withdrawals</div>
      ) : (
        items.map((w) => (
          <div key={w.id} className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">{w.user?.fullName || "—"}</div>
              <div className="text-base text-gray-600">#{w.id}</div>
            </div>
            <div className="text-base text-gray-600 mt-2">{w.user?.email || "—"}</div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <div>
                <div className="text-sm text-gray-600">Amount</div>
                <div className="font-medium text-gray-800">{formatCurrency(w.amountCents)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Requested</div>
                <div className="font-medium text-gray-800">{formatDate(w.requestedAt)}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">Bank</div>
              <div className="text-sm font-medium text-gray-800">{w.bankSnapshot?.bankName || "—"}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">Status</div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(w.status)}`}>
                {w.status}
              </span>
            </div>
            {activeTab === "PENDING" && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-2 py-1.5 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 disabled:opacity-60"
                  onClick={() => approveWithdrawal(w.id)}
                  disabled={!!processingIds[w.id]}
                  aria-label={`Approve withdrawal ${w.id}`}
                >
                  {processingIds[w.id] ? (
                    "Processing..."
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Approve</span>
                    </>
                  )}
                </button>

                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-2 py-1.5 bg-white border border-red-200 text-red-700 rounded-md shadow-sm hover:bg-red-50 disabled:opacity-60"
                  onClick={() => confirmReject(w.id)}
                  disabled={!!processingIds[w.id]}
                  aria-label={`Reject withdrawal ${w.id}`}
                >
                  {processingIds[w.id] ? (
                    "Processing..."
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span className="font-medium">Reject</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MobileList;
