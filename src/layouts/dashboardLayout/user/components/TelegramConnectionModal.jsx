import { X, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../../../../config/axiosInstance";

export default function TelegramConnectionModal({ isOpen, onClose }) {
  const [connectionCode, setConnectionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchConnectionCode();
    }
  }, [isOpen]);

  const fetchConnectionCode = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axiosInstance.get("/api/connectivity/generate-code");
      
      // Adjust based on your API response structure
      setConnectionCode(response.code || response.data?.code || response);
    } catch (err) {
      setError("Failed to generate connection code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(connectionCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenTelegram = () => {
    if (connectionCode) {
      window.open(`https://t.me/tarimama_bot?start=${connectionCode}`, "_blank");
      handleClose();
    }
  };

  const handleClose = () => {
    setConnectionCode("");
    setError("");
    setIsCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Telegram Connection Code</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-base text-gray-600 mb-4">
                Follow these steps:
              </p>
              <ol className="text-sm text-gray-700 space-y-2 mb-4">
                <li>1. Open the Telegram application</li>
                <li>2. Search for bot: <span className="font-semibold">@tarimama_bot</span></li>
                <li>3. Send the following message to the bot:</li>
              </ol>

              <div className="relative">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 pr-12 break-all font-mono text-sm">
                  {connectionCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition"
                  title="Copy code"
                >
                  {isCopied ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} className="text-gray-500" />
                  )}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">⚠️ Important:</span> Do not share this code with anyone. This code is valid only for your account.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button> */}
              <button
                onClick={handleOpenTelegram}
                className="flex-1 px-6 py-3 bg-[#1D4FD9] text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Open Telegram
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
