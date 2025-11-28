import { useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../../config/axiosInstance";

export default function StartWhatsappModal({ isOpen, onClose, onQrReady }) {
  const [delay, setDelay] = useState(5);
  const [message, setMessage] = useState("Hello! Welcome to our service");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setError("");
    setIsLoading(true);
    try {
      // POST start request
      await axiosInstance.post("/api/whatsapp-scanner/start", {
        sendDelaySeconds: Number(delay),
        // message: message,
        disconnectAfter: true,
      });

      // Some backends return the QR directly in the POST response. Handle both cases:
      // 1) POST returns an object with a data URL or base64 -> use it
      // 2) Otherwise fetch /api/whatsapp-scanner/qr.png as blob
      const startRes = await axiosInstance.post("/api/whatsapp-scanner/start", {
        sendDelaySeconds: Number(delay),
        message: message,
        disconnectAfter: true,
      });

      // startRes is likely response.data due to axiosInstance interceptor
      let url = null;

      // Check common fields where a QR might be returned
      const qrCandidate = startRes?.qr || startRes?.qrData || startRes?.qrBase64 || startRes?.data?.qr || startRes?.data?.qrBase64;

      if (qrCandidate) {
        // If it's already a data URL, use directly
        if (typeof qrCandidate === "string" && qrCandidate.startsWith("data:")) {
          url = qrCandidate;
        } else if (typeof qrCandidate === "string") {
          // assume raw base64 PNG, prepend data url prefix
          url = `data:image/png;base64,${qrCandidate}`;
        }
      }

      if (!url) {
        // Fall back to fetching the QR image as blob
        const blob = await axiosInstance.get("/api/whatsapp-scanner/qr.png", { responseType: "blob" });
        // If axiosInstance returns response.data (blob), use it directly; otherwise if it's a full response adjust accordingly
        const blobData = blob instanceof Blob ? blob : (blob?.data || blob);
        url = URL.createObjectURL(blobData);
      }

      if (onQrReady) onQrReady(url);

      // Start polling for connection status so we can show success/failure after scanning
      // Polling endpoint expected response: { status: 'PENDING'|'CONNECTED'|'FAILED', message?: string }
      let elapsed = 0;
      const intervalMs = 2000;
      const timeoutMs = 60000; // 60s timeout

      const poll = async () => {
        try {
          const statusRes = await axiosInstance.get("/api/whatsapp-scanner/status");
          const st = statusRes?.status || statusRes?.data?.status || statusRes;
          const msg = statusRes?.message || statusRes?.data?.message || null;

          // normalize when axiosInstance returned data directly
          const status = typeof st === "string" ? st : st?.status || st;

          if (status === "CONNECTED") {
            setError("");
            // Optionally inform the user and stop polling
            // We could also auto-close QR modal via parent callback if desired
            clearInterval(pollTimer);
            return;
          }

          if (status === "FAILED") {
            setError(msg || "Failed to pair. Please try again.");
            clearInterval(pollTimer);
            return;
          }
        } catch (err) {
          // Non-fatal - backend may not expose status endpoint; stop after timeout
          void err;
        }

        elapsed += intervalMs;
        if (elapsed >= timeoutMs) {
          setError("Timeout waiting for scanner to connect. Please try again.");
          clearInterval(pollTimer);
        }
      };

      const pollTimer = setInterval(poll, intervalMs);
      // run one immediately
      poll();
    } catch (err) {
      const msg = err?.message || err?.error || err?.data?.message || "Failed to generate QR code. Try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5">
          <h2 className="text-lg sm:text-xl font-semibold">Start WhatsApp Scanner</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <p className="text-sm text-gray-600 mb-4">Configure scanner start options. Disconnect after pairing will always be enabled.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Send delay</label>
            <select 
              value={delay} 
              onChange={(e) => setDelay(Number(e.target.value))} 
              className="w-full px-3 py-2 bg-[#F4F4F4] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 second</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message to send</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3 py-2 bg-[#F4F4F4] rounded-md" />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700">Disconnect after pairing: <span className="font-medium">true</span></p>
          </div>

          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded"><p className="text-sm text-red-600">{error}</p></div>}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 rounded-md bg-[#1D4FD9] text-white hover:bg-blue-700">
              {isLoading ? "Generating..." : "Generate QR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
