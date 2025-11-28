import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";

const AddWhatsAppModal = ({ isOpen, onClose, onContinue }) => {
  const handleContinue = () => {
    // Close the modal immediately
    onClose();
    
    // Call onContinue to show QR modal (parent will handle the loading state)
    if (typeof onContinue === "function") {
      onContinue();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
              <IoMdAddCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">Add WhatsApp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Warning box */}
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-md p-4 mb-6">
            <p className="font-semibold">Warning: Do not delete messages that have already been sent.</p>
            <p className="text-sm mt-1">Violations may result in account suspension.</p>
          </div>

          {/* Connection Method */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Connection Method</p>

            <div className="flex items-center justify-between border border-blue-400 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                  {/* QR icon placeholder */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                    <rect x="3" y="3" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="9" y="3" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="3" y="9" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">QR Code</p>
                  <p className="text-sm text-gray-500">Scan the QR code with WhatsApp on your phone</p>
                </div>
              </div>

              {/* Radio dot */}
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-600" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWhatsAppModal;
