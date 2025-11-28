import React from "react";
import { X } from "lucide-react";

export default function ActiveCampaignModal({ isOpen, onClose, campaign, loading, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-2 overflow-hidden z-10">
        <div className="flex items-start justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Active Campaign</h3>
            <p className="text-xs sm:text-sm text-gray-500">Currently active campaign details</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading active campaign...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : !campaign ? (
            <div className="text-center py-8 text-gray-500">No active campaign</div>
          ) : (
            <div className="space-y-4">
              {/* Banner / Image area */}
              <div className="w-full rounded-lg overflow-hidden bg-linear-to-r from-sky-600 to-indigo-600 text-white">
                {campaign.imageUrl ? (
                  <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-36 sm:h-44 object-cover" />
                ) : (
                  <div className="w-full h-36 sm:h-44 flex items-center justify-center">
                    <div className="text-center px-3 sm:px-4">
                      <div className="text-lg sm:text-2xl font-bold">{campaign.name?.slice(0, 40) || "Campaign"}</div>
                      <div className="text-xs sm:text-sm opacity-90 mt-1">{campaign.message ? campaign.message.slice(0, 120) : "No description"}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="text-base font-semibold text-gray-900">#{campaign.id}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Phone Count</div>
                  <div className="text-base font-semibold text-gray-900">{campaign.phoneNumberCount ?? (campaign.phoneNumbers ? campaign.phoneNumbers.length : 0)}</div>
                </div>

                <div className="sm:col-span-2 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Message</div>
                  <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap mt-1">{campaign.message || "-"}</div>
                </div>

                <div className="sm:col-span-2 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">Phone Numbers</div>
                    <div className="text-xs text-gray-500">Total: {campaign.phoneNumbers ? campaign.phoneNumbers.length : (campaign.phoneNumberCount ?? 0)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {campaign.phoneNumbers && campaign.phoneNumbers.length > 0 ? (
                      campaign.phoneNumbers.map((p, i) => (
                        <div key={i} className="text-xs sm:text-sm text-gray-800 p-2 rounded-md bg-gray-50 border border-gray-100 truncate">{p}</div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No phone numbers available</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
