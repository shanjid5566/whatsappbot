import React, { useState, useEffect } from "react";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { get } from "../../../../../service/apiService";

export default function TodaysEarningsCard() {
    const title = "TODAY'S EARNINGS";
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const bgGradient = "from-[#F2AC1C] to-[#E28B0E]";

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                setLoading(true);
                const response = await get("/api/referrals/my-earnings");
                if (response.success && response.data) {
                    // balanceCents theke cents to dollars conversion
                    const balanceInDollars = response.data.balanceCents;
                    setValue(balanceInDollars);
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    const bgClass = bgGradient ? `bg-gradient-to-br ${bgGradient}` : 'bg-gray-200';

    return (
        <div className={`${bgClass} text-white rounded-lg p-4 sm:p-6 flex items-center justify-between`}>
            <div>
                <p className="text-sm xl:text-base sm:text-sm font-semibold mb-1 sm:mb-2 opacity-90">{title}</p>
                <p className="text-2xl sm:text-3xl mt-8 sm:mt-12">
                    {loading ? "..." : `${value}`}
                </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-white/15 text-white rounded-lg">
                <MdOutlineMonetizationOn size={24} className="sm:size-[30px]" />
            </div>
        </div>
    );
}
