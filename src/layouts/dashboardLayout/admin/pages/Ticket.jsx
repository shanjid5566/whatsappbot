import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axiosInstance";
import Swal from "sweetalert2";
import { User, Tag, MessageSquare, Send } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Ticket = () => {
  // Tab state: 'create' or 'all' — default to 'all' so the list shows on page load
  const [activeTab, setActiveTab] = useState("all");

  // Create ticket form state
  const [userId, setUserId] = useState("");
  const [subject, setSubject] = useState("");
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);

  // All tickets state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

  const submitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { userId: Number(userId), subject, command };
      await axiosInstance.post("/api/notifications/admin/ticket", body);
      Swal.fire({
        icon: "success",
        title: "Sent",
        text: "Ticket created successfully",
        timer: 1400,
        showConfirmButton: false,
      });
      // reset form to defaults after successful send
      setUserId("");
      setSubject("");
      setCommand("");
    } catch (err) {
      console.error("Failed to send ticket", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create ticket",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    setTicketsError(null);
    try {
      const res = await axiosInstance.get(
        "/api/notifications/admin/tickets/all"
      );
      setTickets(res.tickets);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
      setTicketsError(
        err?.response?.data?.message || err?.message || "Failed to load tickets"
      );
    } finally {
      setLoadingTickets(false);
    }
  };

  // Helper to extract the command text when API returns combined "Subject: ... Command: ..." strings
  const extractCommand = (text) => {
    if (!text) return "";
    const str = String(text);
    // match the last 'Command:' (case-insensitive) and take the rest
    const regex = /command\s*:\s*([\s\S]*)$/i;
    const m = str.match(regex);
    if (m && m[1]) return m[1].trim();
    return str.trim();
  };

  // Helper to extract the subject text when API returns combined "Subject: ... Command: ..." strings
  const extractSubject = (text) => {
    if (!text) return "";
    const str = String(text);
    // Try to capture between 'Subject:' and 'Command:'
    const regex = /subject\s*:\s*([\s\S]*?)(?=\s*command\s*:|$)/i;
    const m = str.match(regex);
    if (m && m[1]) return m[1].trim();
    return str.trim();
  };

  useEffect(() => {
    if (activeTab === "all") fetchTickets();
  }, [activeTab]);

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 lg:px-12">
      <div className="mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold mb-2 flex items-center gap-">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Tickets
        </h1>
        <p className="text-sm md:text-base text-[#727272] mb-4">
          See all user tickets or create a new support ticket for a user.
        </p>

        {/* Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 bg-white rounded-md shadow-sm p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "create"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Create Ticket
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "all" && (
              <button
                onClick={fetchTickets}
                className="px-3 py-2 bg-white border rounded-md text-sm hover:bg-gray-50"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Panels */}
        <div>
          {activeTab === "create" ? (
            <form
              onSubmit={submitTicket}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col">
                  <span className="text-base md:text-lg  text-gray-700 flex items-center gap-2">
                    <User className="w-4 md:w-6 h-4 md:h-6 text-gray-500" />
                    User ID
                  </span>
                  <input
                    type="number"
                    value={userId}
                    placeholder="User Id"
                    onChange={(e) => setUserId(e.target.value)}
                    className="mt-1 px-3 py-2 md:py-3 border border-gray-300 rounded-md placeholder:text-gray-300"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-base md:text-lg  text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 md:w-6 h-4 md:h-6 text-gray-500" />
                    Subject
                  </span>
                  <input
                    value={subject}
                    placeholder="Add Your Subject"
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 px-3 py-2 md:py-3 border border-gray-300 rounded-md placeholder:text-gray-300"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-base md:text-lg  text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 md:w-6 h-4 md:h-6 text-gray-500" />
                    Command / Message
                  </span>
                  <textarea
                    value={command}
                    placeholder="Write your command or message here..."
                    onChange={(e) => setCommand(e.target.value)}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md min-h-[140px] md:min-h-[220px] placeholder:text-gray-300"
                    required
                  />
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? "Sending..." : "Send Ticket"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserId("");
                      setSubject("");
                      setCommand("");
                    }}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">All Tickets</h2>
                <div className="text-base text-gray-600">
                  {loadingTickets ? "Loading..." : `${tickets.length} tickets`}
                </div>
              </div>

              {loadingTickets ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : ticketsError ? (
                <div className="text-red-600">{ticketsError}</div>
              ) : tickets.length === 0 ? (
                <div className="text-gray-500 py-6 text-center">
                  No tickets found.
                </div>
              ) : (
                <>
                  {/* Table for md+ screens */}
                  <div className="hidden lg:block">
                    <div className=" rounded-lg overflow-hidden  ">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              Message
                            </th>

                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {tickets.map((t, idx) => {
                            // prefer userId as the visible id when available
                            const id =
                              t.userId ?? t.id ?? t._id ?? t.ticketId ?? idx;
                            const rawMsg =
                              t.command ?? t.message ?? t.body ?? "";
                            const displayMsg = extractCommand(rawMsg);
                            const rawSubject = t.subject ?? rawMsg;
                            const displaySubject = extractSubject(rawSubject);
                            const email =
                              t.userEmail ?? t.user?.email ?? t.email ?? "-";
                            const created =
                              t.createdAt ?? t.created_at ?? t.date ?? null;
                            const status =
                              t.read ?? false
                                ? "Read"
                                : t.status ??
                                  (t.isResolved ? "Resolved" : "Unread");
                            const isOpen =
                              String(status).toLowerCase() === "unread" ||
                              String(status).toLowerCase() === "open" ||
                              status === false;
                            return (
                              <tr
                                key={id + "-" + idx}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm text-gray-800 align-top">
                                  {id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 align-top">
                                  {email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 align-top">
                                  <div className="text-gray-800 text-sm  truncate">
                                    {displaySubject}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 align-top">
                                  <div className="text-gray-600 text-sm mt-1  truncate">
                                    {displayMsg}
                                  </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 align-top">
                                  {created
                                    ? new Date(created).toLocaleString()
                                    : ""}
                                </td>
                                <td className="px-6 py-4 text-sm align-top">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                      isOpen
                                        ? "bg-red-100 text-red-800"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {String(status)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cards for mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                    {tickets.map((t, idx) => {
                      // prefer userId as the visible id on cards too
                      const id = t.userId ?? t.id ?? t._id ?? t.ticketId ?? idx;
                      const uid =
                        t.userId ?? t.user?.id ?? t.user_id ?? t.user ?? "-";
                      const rawMsg = t.command ?? t.message ?? t.body ?? "";
                      const displayMsg = extractCommand(rawMsg);
                      const rawSubject = t.subject ?? rawMsg;
                      const sub = extractSubject(rawSubject) || "No subject";
                      const status =
                        t.status ??
                        (t.isResolved
                          ? "Resolved"
                          : t.read
                          ? "Read"
                          : "Unread") ??
                        "Unknown";
                      const isOpen =
                        String(status).toLowerCase() === "unread" ||
                        String(status).toLowerCase() === "open" ||
                        status === false;
                      const created =
                        t.createdAt ?? t.created_at ?? t.date ?? null;
                      return (
                        <div
                          key={id + "-card-" + idx}
                          className="border border-gray-300 rounded-md p-4 bg-white shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              ID:{" "}
                              <span className="font-medium text-gray-700">
                                {id}
                              </span>
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isOpen
                                  ? "bg-red-100 text-red-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {String(status)}
                            </div>
                          </div>
                          <div className="mt-2 font-semibold">
                            {" "}
                            Subject : {sub}
                          </div>
                          <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                            Message : {displayMsg}
                          </div>
                          <div className="mt-3 text-sm text-gray-700">
                            User: {uid}
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {created ? new Date(created).toLocaleString() : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
