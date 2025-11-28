import React, { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import axiosInstance from "../../../../../config/axiosInstance";

export default function WhatsappDisconnectedCard() {
    const title = "WHATSAPP DISCONNECTED";
    const [value, setValue] = useState(0);
    const bgGradient = "from-[#F45B75] to-[#E73257]";

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axiosInstance.get("/api/whatsapp-scanner/status");
                const apiData = response?.data || response;
                
        // Normalize/collect accounts from various API shapes
        let accounts = [];
        if (Array.isArray(apiData?.accounts)) accounts = apiData.accounts;
        else if (Array.isArray(apiData)) accounts = apiData;
        else if (Array.isArray(apiData?.data)) accounts = apiData.data;
        else if (apiData && typeof apiData === 'object') {
          // single account object
          accounts = [apiData];
        }

        // load stored accounts history from localStorage (if present)
        let storedAccounts = [];
        try {
          storedAccounts = JSON.parse(localStorage.getItem('whatsapp_accounts_v1') || '[]');
        } catch {
          storedAccounts = [];
        }

        const normalizeNumber = (num) => {
          if (!num && num !== 0) return "";
          try { return String(num).replace(/\D/g, ''); } catch { return ""; }
        };

        const storedMap = (storedAccounts || []).reduce((m, a) => {
          const key = normalizeNumber(a?.number || a?.phone || a?.jid);
          if (key) m[key] = a;
          return m;
        }, {});

        const apiMap = (accounts || []).reduce((m, a) => {
          const key = normalizeNumber(a?.number || a?.phone || a?.jid);
          if (key) m[key] = a;
          return m;
        }, {});

        const merged = { ...storedMap };
        // keep stored-only as disconnected if API does not have it
        Object.keys(storedMap).forEach(k => {
          if (!apiMap[k]) merged[k] = { ...storedMap[k], connected: false };
        });
        // overwrite with API data
        Object.keys(apiMap).forEach(k => { merged[k] = apiMap[k]; });

        const mergedList = Object.values(merged || {});

        const disconnectedCount = (mergedList || []).filter(acc => !acc?.connected).length;
        setValue(disconnectedCount);
            } catch {
                setValue(1); // Show disconnected if API fails
            }
        };

        fetchStatus();
        // Refresh every 10 seconds
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const bgClass = bgGradient ? `bg-gradient-to-br ${bgGradient}` : 'bg-gray-200';

  return (
    <div
      className={`${bgClass} text-white rounded-lg p-4 sm:p-6 flex items-center justify-between`}
    >
      <div>
        <p className="text-sm xl:text-base sm:text-sm font-semibold mb-1 sm:mb-2 opacity-90">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl mt-8 sm:mt-12">
          {String(value).padStart(2, "0")}
        </p>
      </div>
      <div className="p-1.5 sm:p-2 bg-white/15 text-white rounded-lg">
        <FaExclamationCircle size={24} className="sm:size-[30px]" />
      </div>
    </div>
  );
}
