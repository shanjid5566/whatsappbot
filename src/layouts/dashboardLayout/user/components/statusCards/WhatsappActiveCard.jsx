import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import axiosInstance from "../../../../../config/axiosInstance";

export default function WhatsappActiveCard() {
    const title = "WHATSAPP ACTIVE";
    const [value, setValue] = useState(0);
    const bgGradient = "from-[#2AC78F] to-[#12A777]";

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axiosInstance.get("/api/whatsapp-scanner/status");
                const apiData = response?.data || response;
                
                // Handle both single account and multiple accounts
                if (Array.isArray(apiData?.accounts)) {
                    // Multiple accounts - count connected ones
                    const connectedCount = apiData.accounts.filter(acc => acc.connected).length;
                    setValue(connectedCount);
                } else {
                    // Single account - set 1 if connected, 0 if not
                    setValue(apiData?.connected ? 1 : 0);
                }
            } catch {
                setValue(0);
            }
        };

        fetchStatus();
        // Refresh every 10 seconds
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const bgClass = bgGradient ? `bg-gradient-to-br ${bgGradient}` : 'bg-gray-200';

    return (
        <div className={`${bgClass} text-white rounded-lg p-4 sm:p-6 flex items-center justify-between`}>
            <div>
                <p className="text-sm xl:text-base sm:text-sm font-semibold mb-1 sm:mb-2 opacity-90">{title}</p>
                <p className="text-2xl sm:text-3xl mt-8 sm:mt-12">{String(value).padStart(2, "0")}</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-white/15 text-white rounded-lg">
                <FaWhatsapp size={24} className="sm:size-[30px]" />
            </div>
        </div>
    );
}
