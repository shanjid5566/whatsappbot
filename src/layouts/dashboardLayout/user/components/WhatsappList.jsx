import { ChevronDown, Smartphone, Zap } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { get, post } from "../../../../service/apiService";
import Swal from "sweetalert2";

const WhatsappList = () => {
  // global delay used for 'Blast All'
  const [globalSelectedOption, setGlobalSelectedOption] = useState(null);
  // header select open state (so header chevron rotates independently)
  const [isHeaderSelectOpen, setIsHeaderSelectOpen] = useState(false);
  // per-account select open state keyed by account number/id
  const [accountSelectOpen, setAccountSelectOpen] = useState({});
  const [responseData, setResponseData] = useState(null);

  console.log(responseData);

  const whatsappOptions = [
    { id: 1, label: " FAST 5s", value: "5" },
    { id: 2, label: " MEDIUM 15s", value: "15" },
    { id: 3, label: " SLOW 30s", value: "30" },
    { id: 4, label: " VERY SLOW 60s", value: "60" },
  ];


  const handleGlobalSelectChange = (e) => {
    const value = e.target.value;
    const option = whatsappOptions.find((o) => o.value === value) || null;
    console.log("Global selected:", option);
    setGlobalSelectedOption(option);
  };

  // per-account sending state for Start Blast button
  const [sendingAccounts, setSendingAccounts] = useState({});
  // global sending state for Blast All
  const [sendingAll, setSendingAll] = useState(false);
  console.log(sendingAccounts);

  const handleBlastAll = async () => {
    if (!globalSelectedOption) {
      Swal.fire({
        icon: "warning",
        title: "No Delay Selected",
        text: "Please select a delay before using Blast All",
        confirmButtonColor: "#BD31CE",
      });
      return;
    }

    const connectedAccounts = accounts.filter(
      (acct) => acct?.connected === true
    );

    if (connectedAccounts.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Connected Accounts",
        text: "No connected WhatsApp accounts found",
        confirmButtonColor: "#BD31CE",
      });
      return;
    }

    try {
      setSendingAll(true);

      // Send to all connected accounts
      for (const acct of connectedAccounts) {
        const number = acct?.number || acct?.phone;
        if (!number) continue;

        try {
          setSendingAccounts((s) => ({ ...s, [number]: true }));

          const seconds = Number(globalSelectedOption.value) || 0;

          const start = Date.now();
          let resp = null;
          try {
            resp = await post("/api/whatsapp-scanner/send-message", {
              number,
              seconds,
            });

            // Update account sent/earnings based on response
            updateAccountFromResponse(number, resp);

            console.log(`Blast sent to ${number}`);
          } catch (err) {
            // still allow minimum loading duration even if send fails
            console.error(`Failed to blast ${number}:`, err);
          }

          // ensure UI shows loading for at least `seconds` seconds
          try {
            const elapsed = Date.now() - start;
            const minMs = seconds * 1000;
            const remaining = minMs - elapsed;
            if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
          } catch {
            // ignore timing errors
          }
        } catch (err) {
          console.error(`Failed to blast ${number}:`, err);
        } finally {
          setSendingAccounts((s) => ({ ...s, [number]: false }));
        }
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Blast All Complete!",
        text: `Messages sent to ${connectedAccounts.length} connected account(s)`,
        confirmButtonColor: "#BD31CE",
      });

      // Refetch status to update connected/disconnected state (backend may auto-logout after blast)
      if (fetchStatusRef.current) {
        setTimeout(() => fetchStatusRef.current(), 1000);
      }
    } catch (err) {
      console.error("Blast All failed:", err);
      Swal.fire({
        icon: "error",
        title: "Blast All Failed",
        text: err?.message || "An error occurred while sending messages",
        confirmButtonColor: "#BD31CE",
      });
    } finally {
      setSendingAll(false);
    }
  };

  const handleStartBlast = async (number) => {
    // Check if account is connected
    const account = accounts.find(
      (acct) => (acct?.number || acct?.phone) === number
    );

        const connected = account?.connected === true;
        if (!connected) {
      Swal.fire({
        icon: "warning",
        title: "WhatsApp Not Connected",
        text: "This WhatsApp account is not connected. Please connect it first.",
        confirmButtonColor: "#BD31CE",
      });
      return;
    }

    try {
      setSendingAccounts((s) => ({ ...s, [number]: true }));

      // determine seconds from per-account setting or global fallback
      const seconds =
        Number(
          accountDelays[number] ??
            (globalSelectedOption ? globalSelectedOption.value : 0)
        ) || 0;

      const start = Date.now();
      let response = null;
      try {
        // POST to send-message endpoint with account number and seconds
        response = await post("/api/whatsapp-scanner/send-message", {
          number,
          seconds,
        });
        console.log(response?.data || response);

        // Update account sent/earnings based on response
        updateAccountFromResponse(number, response);

        // Show success alert if response indicates messages were sent
        try {
          const sentCount = parseSentFromSendResponse(response);
          if (Number(sentCount) > 0) {
            Swal.fire({
              icon: "success",
              title: "Message Sent",
              text: `${sentCount} message${sentCount > 1 ? "s" : ""} sent to ${number}`,
              confirmButtonColor: "#BD31CE",
            });
          }
        } catch {
          // ignore alert errors
        }
      } catch (err) {
        console.error("Failed to start blast for", number, err);
      }

      // ensure UI shows loading for at least `seconds` seconds
      try {
        const elapsed = Date.now() - start;
        const minMs = seconds * 1000;
        const remaining = minMs - elapsed;
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      } catch {
        // ignore timing errors
      }

      // Refetch status to update connected/disconnected state (backend may auto-logout after blast)
      if (fetchStatusRef.current) {
        setTimeout(() => fetchStatusRef.current(), 1000);
      }
    } finally {
      setSendingAccounts((s) => ({ ...s, [number]: false }));
    }
  };

  // per-account selected delays (keyed by account number or id)
  const [accountDelays, setAccountDelays] = useState({});

  const handleAccountDelayChange = async (acctKey, e) => {
    const value = e.target.value;
    console.log(acctKey, "selected delay:", value);

    // update local state immediately for responsive UI
    setAccountDelays((prev) => ({ ...prev, [acctKey]: value }));

    // send to backend: POST /api/whatsapp/delay?seconds=<value> with JSON body { seconds: <number> }
    try {
      const secondsNum = Number(value);
      await post(`/api/whatsapp/delay?seconds=${secondsNum}`, {
        seconds: secondsNum,
      });
      console.log(`Delay set for ${acctKey}: ${secondsNum}s`);
    } catch (err) {
      console.error("Failed to set delay:", err);
      // optionally revert state or show an error — for now we keep the selection and log the error
    }
  };

  const [accounts, setAccounts] = useState([]);
  console.log("Current accounts:", accounts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevAccountsRef = useRef([]); // keep previous snapshot to detect newly-connected
  const STORAGE_KEY = "whatsapp_order_v1";
  const STORAGE_ACCOUNTS_KEY = "whatsapp_accounts_v1";
  const fetchStatusRef = useRef(null); // ref to fetchStatus so handlers can call it

  // Helper: parse send API response to determine number of sent messages (absolute) or delta
  const parseSentFromSendResponse = (resp) => {
    try {
      const data = resp?.data || resp;
      // 1) reportSummary.sent or report.sent
      if (data?.reportSummary?.sent != null) return Number(data.reportSummary.sent);
      if (data?.report?.sent != null) return Number(data.report.sent);
      // 2) direct sent field
      if (data?.sent != null) return Number(data.sent);
      // 3) lastReport.results or report.results or results array -> count ok === true
      const results =
        data?.lastReport?.results || data?.report?.results || data?.results || data?.data?.results;
      if (Array.isArray(results)) {
        return results.filter((r) => !!r?.ok).length;
      }
      // 3) fallback: if operation succeeded, assume 1 message sent
      return 1;
    } catch {
      return 1;
    }
  };

  // Update an account in state + persist to localStorage using the response from send-message
  const updateAccountFromResponse = (number, resp) => {
    try {
      const key = number;
      const sentFromResp = parseSentFromSendResponse(resp);

      setAccounts((prev) => {
        const next = prev.map((acct) => {
          const acctNum = acct?.number || acct?.phone;
          if (!acctNum) return acct;
          if (acctNum === key) {
            // If response provides absolute value, use it; otherwise increment
            const newSent = typeof sentFromResp === 'number' ? sentFromResp : (acct.sent || 0) + 1;
            return { ...acct, sent: newSent };
          }
          return acct;
        });

        // persist merged history for other components/metrics
        try {
          localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }

        // update prev ref snapshot as well
        prevAccountsRef.current = next;
        return next;
      });
    } catch (err) {
      void err;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get("/api/whatsapp-scanner/status");
        console.log(res);
        setResponseData(res?.data || null);

        // Normalize possible response shapes
        let items = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res && typeof res === "object") {
          // Some APIs return an object when single account present
          // or return { data: [...] }
          if (Array.isArray(res.data)) items = res.data;
          else items = [res];
        }

        // Normalize each account: prefer reportSummary.sent, else count successful results
        const normalized = items?.filter(Boolean).map((a) => {
          const sentFromReport = a?.reportSummary?.sent;
          const sentFromResults = Array.isArray(a?.lastReport?.results)
            ? a.lastReport.results.filter((r) => !!r.ok).length
            : undefined;
          return {
            ...a,
            sent: sentFromReport ?? sentFromResults ?? 0,
          };
        });

        // --- load stored order + stored accounts from localStorage ---
        let storedOrder = [];
        let storedAccounts = [];
        try {
          storedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
          storedOrder = [];
        }
        try {
          storedAccounts = JSON.parse(
            localStorage.getItem(STORAGE_ACCOUNTS_KEY) || "[]"
          );
        } catch {
          storedAccounts = [];
        }

        // build maps keyed by number for easy merge
        const storedMap = (storedAccounts || []).reduce((m, a) => {
          const num = a?.number || a?.phone;
          if (num) m[num] = a;
          return m;
        }, {});

        const normalizedMap = (normalized || []).reduce((m, a) => {
          const num = a?.number || a?.phone;
          if (num) m[num] = a;
          return m;
        }, {});

        // Merge stored with normalized: normalized wins (fresh data), stored provides history for missing entries
        const mergedMap = { ...storedMap };
        // mark stored-only entries as disconnected if they're absent in normalized
        Object.keys(storedMap).forEach((num) => {
          if (!normalizedMap[num]) {
            mergedMap[num] = { ...storedMap[num], connected: false };
          }
        });
        // overwrite with normalized (fresh) entries
        Object.keys(normalizedMap).forEach((num) => {
          mergedMap[num] = normalizedMap[num];
        });

        const mergedList = Object.values(mergedMap);

        // build prev map from previous merged snapshot (so we detect newly connected correctly)
        const prev = prevAccountsRef.current || [];
        const prevConnectedMap = prev.reduce((m, a) => {
          const num = a?.number || a?.phone;
          if (num) m[num] = !!a.connected;
          return m;
        }, {});

        // If an account is newly connected (connected now but wasn't before), put at front of storedOrder
        let newOrder = Array.isArray(storedOrder) ? [...storedOrder] : [];
        Object.values(normalizedMap).forEach((a) => {
          const num = a?.number || a?.phone;
          if (!num) return;
          const nowConnected = !!a.connected;
          const wasConnected = !!prevConnectedMap[num];
          if (nowConnected && !wasConnected) {
            // move to front
            newOrder = [num, ...newOrder.filter((n) => n !== num)];
          } else if (!newOrder.includes(num) && nowConnected) {
            // ensure connected items appear (if not present)
            newOrder.push(num);
          }
        });

        // If an account was just connected (newly connected), reset its sent count to 0
        Object.values(normalizedMap).forEach((a) => {
          const num = a?.number || a?.phone;
          if (!num) return;
          const nowConnected = !!a.connected;
          const wasConnected = !!prevConnectedMap[num];
          if (nowConnected && !wasConnected) {
            // reset sent/earnings for the freshly connected account until it actually sends
            if (mergedMap[num]) mergedMap[num].sent = 0;
          }
        });

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
          localStorage.setItem(
            STORAGE_ACCOUNTS_KEY,
            JSON.stringify(mergedList)
          );
        } catch {
          // ignore storage errors
        }

        const indexMap = (num) => {
          const i = newOrder.indexOf(num);
          return i === -1 ? Number.MAX_SAFE_INTEGER : i;
        };

        const sortedMerged = [...mergedList].sort((a, b) => {
          const na = a?.number || a?.phone || "";
          const nb = b?.number || b?.phone || "";
          return indexMap(na) - indexMap(nb);
        });

        if (mounted) setAccounts(sortedMerged);
        // update prev ref for next fetch comparison
        prevAccountsRef.current = sortedMerged;
      } catch (err) {
        if (mounted) setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Store fetchStatus in ref so blast handlers can call it
    fetchStatusRef.current = fetchStatus;

    fetchStatus();

    // Listen for global event fired by QRModal when a connection is made
    const onConnected = () => {
      // refetch immediately
      fetchStatus();
    };
    try {
      window.addEventListener("whatsapp:connected", onConnected);
    } catch {
      // ignore in non-browser env
    }

    return () => {
      mounted = false;
      try {
        window.removeEventListener("whatsapp:connected", onConnected);
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div className="w-full bg-white font-sans text-black">
      <div className=" mx-auto p-4 sm:p-6 md:p-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Side: Title and Subtitle */}
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#000000]">
              WhatsApp List
            </h1>
            <p className="text-base md:text-lg text-[#656565] mt-1">
              WhatsApp accounts registered to your profile
            </p>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex justify-center items-center shrink-0 gap-2 md:gap-3">
            {/* Native select for delay */}
            <div className="relative">
              <select
                value={globalSelectedOption ? globalSelectedOption.value : ""}
                onChange={handleGlobalSelectChange}
                onFocus={() => setIsHeaderSelectOpen(true)}
                onBlur={() => setIsHeaderSelectOpen(false)}
                className="appearance-none h-10 leading-tight py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors w-40 md:w-44 md:px-4 px-2 pr-8"
              >
                <option value="">Add Delay</option>
                {whatsappOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
                  isHeaderSelectOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <button
              type="button"
              onClick={handleBlastAll}
              disabled={sendingAll || !globalSelectedOption}
              className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-[#BD31CE] text-white rounded-lg shadow-sm text-sm font-medium ${
                sendingAll || !globalSelectedOption
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-[#a028b5]"
              }`}
            >
              {sendingAll ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Blasting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Blast All
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        {loading ? (
          <main className="flex items-center justify-center mt-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
          </main>
        ) : accounts.length === 0 ? (
          <main className="flex flex-col items-center justify-center text-center mt-24 md:mt-32">
            {/* Icon */}
            <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              {/* Reverted to the inline SVG component */}
              <Smartphone className="w-18 h-18 text-gray-400" />
            </div>

            {/* Empty State Text */}
            <h2 className="text-xl font-semibold text-[#000000] mb-2">
              No WhatsApp accounts yet
            </h2>
            <p className="text-base text-[#656565]">
              Click + Add WhatsApp to add your first account.
            </p>
          </main>
        ) : (
          <main className="mt-6">
            {error && (
              <div className="text-sm text-red-600 mt-3">{String(error)}</div>
            )}
            <div className="space-y-4">
              {accounts.map((acct, idx) => {
                const connected = acct?.connected === true;
                const number = acct?.number || acct?.phone || "Unknown";
                return (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-pink-50 flex items-center justify-center text-pink-600">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-medium text-gray-900 text-base md:text-lg lg:text-xl">
                            {number}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            connected
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {connected ? "Connected" : "Disconnected"}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm md:text-base lg:text-lg text-gray-700 ml-14">
                      Delivered: {acct?.sent ?? 0} | Earnings:{" "}
                      {(acct?.sent ?? 0) * 100}
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={
                            accountDelays[number] ??
                            (globalSelectedOption
                              ? globalSelectedOption.value
                              : "")
                          }
                          onChange={(e) => handleAccountDelayChange(number, e)}
                          onFocus={() =>
                            setAccountSelectOpen((prev) => ({
                              ...prev,
                              [number]: true,
                            }))
                          }
                          onBlur={() =>
                            setAccountSelectOpen((prev) => ({
                              ...prev,
                              [number]: false,
                            }))
                          }
                          className="appearance-none h-10 leading-tight py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors w-full px-2 pr-8"
                        >
                          <option value="">Add Delay</option>
                          {whatsappOptions.map((option) => (
                            <option key={option.id} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
                            accountSelectOpen[number] ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <div className="shrink-0">
                        <button
                          onClick={() => handleStartBlast(number)}
                          disabled={!!sendingAccounts[number] || !connected}
                          className={`rounded-lg px-4 py-2 text-white ${
                            sendingAccounts[number] || !connected
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {sendingAccounts[number]
                            ? "Sending..."
                            : "Start Blast"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default WhatsappList;
