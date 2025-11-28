import React, { useState } from "react";
import { X } from "lucide-react";
import { get } from "../../../../../service/apiService";

export default function RecentMessagesModal({ isOpen, onClose }) {
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    const id = searchId && String(searchId).trim();
    if (!id) {
      setError("Please enter an ID to search.");
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await get(`/api/admin/campaigns/message-stats/users/${id}/stats`);
      // API may return { ok: true, data: { user, summary, recentMessages } }
      const data = res?.data || res;
      setResult(data || null);
    } catch (err) {
      setError((err && err.message) || (err && err.error) || "Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl mx-0 sm:mx-2 overflow-hidden z-10 h-[90vh] sm:h-auto">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <p className="text-sm text-gray-500">Search recent messages by user ID</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-4 h-full flex flex-col">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter user ID (e.g. 21)"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          {!result && !loading && (
            <div className="text-sm text-gray-500">Enter an ID and click Search to load recent messages.</div>
          )}

          {result && (
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              {/* User / Image */}
              <div className="flex items-center gap-4">
                {result.user && (
                  <>
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {result.user.avatar || result.user.imageUrl ? (
                        <img src={result.user.avatar || result.user.imageUrl} alt={result.user.fullName || "user"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-sm font-semibold text-gray-700">{(result.user.fullName || "").slice(0,1)}</div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-900">{result.user?.fullName || result.user?.fullName || "User"}</div>
                      <div className="text-xs text-gray-500">{result.user?.email || ""}</div>
                    </div>
                  </>
                )}

                {result.summary && (
                  <div className="ml-auto bg-gray-50 rounded-md p-2 border border-gray-100 text-xs text-gray-700">
                    <div>Total: {result.summary?.totalMessages ?? "-"}</div>
                    <div>Success: {result.summary?.successfulMessages ?? "-"}</div>
                    <div>Failed: {result.summary?.failedMessages ?? "-"}</div>
                  </div>
                )}
              </div>

                {/* Desktop/table view */}
                <div className="hidden sm:block overflow-x-auto flex-1">
                  <div className="max-h-72 sm:max-h-96 overflow-y-auto border border-gray-100 rounded-md">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2 font-medium text-gray-600">ID</th>
                          <th className="px-3 py-2 font-medium text-gray-600">Phone</th>
                          <th className="px-3 py-2 font-medium text-gray-600">Message</th>
                          <th className="px-3 py-2 font-medium text-gray-600">Status</th>
                          <th className="px-3 py-2 font-medium text-gray-600">Sent At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(result.recentMessages) && result.recentMessages.length > 0 ? (
                          result.recentMessages.map((m) => (
                            <tr key={m.id} className="border-b last:border-b-0 align-top">
                              <td className="px-3 py-2 text-gray-700 align-top">{m.id}</td>
                              <td className="px-3 py-2 text-gray-700 align-top">{m.recipientPhone}</td>
                              <td className="px-3 py-2 text-gray-700 align-top wrap-break-word max-w-md">{m.message}</td>
                              <td className="px-3 py-2 text-gray-700 align-top">{m.status}</td>
                              <td className="px-3 py-2 text-gray-700 align-top">{m.sentAt ? new Date(m.sentAt).toLocaleString() : "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-3 py-6 text-center text-gray-500">No recent messages</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile/card view - stacked messages, scrollable */}
                <div className="sm:hidden flex-1 overflow-y-auto space-y-3">
                  {Array.isArray(result.recentMessages) && result.recentMessages.length > 0 ? (
                    result.recentMessages.map((m) => (
                      <div key={m.id} className="bg-gray-50 border border-gray-100 rounded-md p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs text-gray-500">#{m.id}</div>
                          <div className="text-xs text-gray-500">{m.sentAt ? new Date(m.sentAt).toLocaleString() : "-"}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-800 wrap-break-word">{m.message}</div>
                        <div className="mt-2 text-xs text-gray-600">{m.recipientPhone} · {m.status}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">No recent messages</div>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
