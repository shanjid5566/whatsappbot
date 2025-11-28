import React, { useEffect, useRef, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { get } from "../../../../service/apiService";

export default function QRModal({ isOpen, imgUrl, onClose, onConnected }) {
  const pollingIntervalRef = useRef(null);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (!isOpen || !imgUrl) {
      // Clear polling when modal is closed or no QR code
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Function to check connection status
    const checkConnectionStatus = async () => {
      try {
        const response = await get("/api/whatsapp-scanner/status");

        // Normalize response shapes: some backends return { connected: true } while
        // others return { status: 'CONNECTED' } or nested shapes. Handle common variants.
        const connectedFlag = !!(
          (response &&
            typeof response === "object" &&
            (response.connected === true ||
              response.data?.connected === true)) ||
          (typeof response === "object" &&
            String(
              response.status || response.data?.status || ""
            ).toUpperCase() === "CONNECTED") ||
          response === true ||
          String(response).toUpperCase() === "CONNECTED"
        );

        setStatusText(connectedFlag ? "Connected" : "Waiting for scan...");

        if (connectedFlag) {
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          // Notify parent that connection happened (optional)
          try {
            if (typeof onConnected === "function") onConnected();
          } catch (err) {
            // Ignore
          }

          // Dispatch a global event so other components (like WhatsappList) can react and refetch
          try {
            window.dispatchEvent(new Event('whatsapp:connected'));
          } catch {
            // ignore if window not available
          }
          // Close the modal
          try {
            if (typeof onClose === "function") onClose();
          } catch (err) {
            console.error("onClose callback threw:", err);
          }
        }
      } catch {
        // Log polling errors for debugging
        setStatusText("Error checking status");
      }
    };

    // Start polling every 3 seconds
    pollingIntervalRef.current = setInterval(checkConnectionStatus, 3000);

    // Initial check
    setStatusText("Waiting for scan...");
    checkConnectionStatus();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, imgUrl, onClose, onConnected]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-4">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                Scan the QR code
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Scan the following QR code with your WhatsApp
              </p>
              <p className="text-xs text-red-600 mt-1 flex items-center gap-2">
                <AlertTriangle className="w-16 h-16 text-red-600" />
                <span>
                  Warning: Deleting messages that have already been sent is
                  prohibited. Violations will result in account blocking.
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="WhatsApp QR"
              className="w-64 h-64 object-contain"
            />
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 font-medium">Loading QR Code...</p>
            </>
          )}
        </div>

        {/* Small instruction under the QR image */}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-700">Please scan the QR code</p>
          <p className="text-sm text-gray-600 mt-2">{statusText}</p>
        </div>
      </div>
    </div>
  );
}
