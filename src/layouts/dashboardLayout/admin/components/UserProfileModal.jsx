import React, { useEffect } from "react";
import { X, CreditCard, Archive } from "lucide-react";

export default function UserProfileModal({ user, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-lg shadow-xl w-[520px] max-w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4">
          <div>
            <h3 className="text-lg md:text-xl">User Profile: {user.name}</h3>
            <p className="text-sm md:text-base text-[#5C5C5C]">
              View and manage user account details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded p-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs md:text-sm text-[#5C5C5C]">Email</p>
            <p className="font-medium">{user.email}</p>

            <p className="mt-3 text-xs text-[#5C5C5C]">Plan</p>
            <p className="font-medium">{user.plan}</p>
          </div>

          <div>
            <p className="text-xs md:text-sm text-[#5C5C5C]">Credits</p>
            <p className="font-medium">{user.credits}</p>

            <p className="mt-3 text-xs md:text-sm text-[#5C5C5C]">WABA Status</p>
            <p className="font-medium">{user.status}</p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-3">
          <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white border rounded text-sm hover:bg-gray-50">
            <CreditCard className="w-4 h-4" />
            Edit Credits
          </button>

          <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white border rounded text-sm hover:bg-gray-50">
            <Archive className="w-4 h-4" />
            View Campaigns
          </button>

          <div className="ml-auto text-sm text-gray-500">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}
