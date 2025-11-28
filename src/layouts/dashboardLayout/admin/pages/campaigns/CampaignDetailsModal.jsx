import React from "react";
import { X, Calendar, Hash, Phone } from "lucide-react";

export default function CampaignDetailsModal({ campaign, onClose }) {
  if (!campaign) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 animate-fadeIn">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 sm:px-6 sm:py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Campaign Details
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Complete campaign information
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          {/* Campaign Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            {/* Campaign Name */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="bg-blue-600 rounded-md sm:rounded-lg p-1.5 sm:p-2">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Campaign Name
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 ml-8 sm:ml-10 md:ml-11 wrap-break-word">
                {campaign.name || "N/A"}
              </p>
            </div>

            {/* Campaign ID */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="bg-purple-600 rounded-md sm:rounded-lg p-1.5 sm:p-2">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Campaign ID
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 ml-8 sm:ml-10 md:ml-11">
                #{campaign.id || "N/A"}
              </p>
            </div>

            {/* Phone Count */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="bg-orange-600 rounded-md sm:rounded-lg p-1.5 sm:p-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Phone Numbers
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 ml-8 sm:ml-10 md:ml-11">
                {campaign.phoneNumberCount ||
                  (campaign.phoneNumbers
                    ? campaign.phoneNumbers.length
                    : 0)}{" "}
                Numbers
              </p>
            </div>

            {/* Created At */}
            <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="bg-indigo-600 rounded-md sm:rounded-lg p-1.5 sm:p-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Created At
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 ml-8 sm:ml-10 md:ml-11">
                {formatDate(campaign.createdAt)}
              </p>
            </div>
          </div>

          {/* Message Section */}
          {campaign.message && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 shadow-sm mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                <div className="w-1 h-4 sm:h-5 md:h-6 bg-blue-600 rounded-full"></div>
                Campaign Message
              </h3>
              <div className="bg-white rounded-md sm:rounded-lg p-3 sm:p-4 border border-gray-300 shadow-inner">
                <p className="text-xs sm:text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {campaign.message}
                </p>
              </div>
            </div>
          )}

          {/* Phone Numbers Section */}
          {campaign.phoneNumbers && campaign.phoneNumbers.length > 0 && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-4 sm:h-5 md:h-6 bg-green-600 rounded-full"></div>
                Phone Numbers List
                <span className="ml-auto text-xs sm:text-sm font-semibold bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {campaign.phoneNumbers.length} Total
                </span>
              </h3>
              <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 border border-gray-300 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {campaign.phoneNumbers.map((phone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 sm:gap-2 bg-linear-to-r from-blue-50 to-blue-100 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {phone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
