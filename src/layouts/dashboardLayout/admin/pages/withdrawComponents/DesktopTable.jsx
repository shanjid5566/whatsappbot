import React from "react";
import { GripVertical } from "lucide-react";

const DesktopTable = ({
  items,
  loading,
  activeTab,
  processingIds,
  openMenuId,
  menuDirection,
  onToggleMenu,
  setMenuDirection,
  approveWithdrawal,
  confirmReject,
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] hidden md:table">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">Bank</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">Account</th>
            <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">Requested</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            {activeTab === "PENDING" && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={activeTab === "PENDING" ? 9 : 8} className="px-4 py-6 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={activeTab === "PENDING" ? 9 : 8} className="px-4 py-6 text-center text-gray-500">
                No {activeTab.toLowerCase()} withdrawals
              </td>
            </tr>
          ) : (
            items.map((w, idx) => {
              const isLastTwoItems = idx >= items.length - 2;
              return (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-base text-gray-700">{w.id}</td>
                  <td className="px-4 py-4 text-base text-gray-700">{w.user?.fullName || "-"}</td>
                  <td className="px-4 py-4 text-base text-gray-700">{w.user?.email || "-"}</td>
                  <td className="px-4 py-4 text-base text-gray-700">{formatCurrency(w.amountCents)}</td>
                  <td className="px-4 py-4 text-base text-gray-700">{w.bankSnapshot?.bankName || "-"}</td>
                  <td className="px-4 py-4 text-base text-gray-700">{w.bankSnapshot?.accountNumber || "-"}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatDate(w.requestedAt)}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(w.status)}`}>
                      {w.status}
                    </span>
                  </td>
                  {activeTab === "PENDING" && (
                    <td className="px-4 py-4 text-sm text-left relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isLastTwoItems) setMenuDirection("up");
                            else setMenuDirection("down");
                            onToggleMenu(w.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 action-button"
                          aria-haspopup="true"
                          aria-expanded={openMenuId === w.id}
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === w.id && (
                          <div
                            className={`absolute right-1 z-50 w-48 bg-white rounded-md shadow-lg action-menu ${
                              menuDirection === "down" ? "top-8" : "bottom-8"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxHeight: 220, overflow: "auto" }}
                          >
                            <ul className="py-2">
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                  onClick={() => approveWithdrawal(w.id)}
                                  disabled={!!processingIds[w.id]}
                                >
                                  Approve
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                  onClick={() => confirmReject(w.id)}
                                  disabled={!!processingIds[w.id]}
                                >
                                  Reject
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopTable;
