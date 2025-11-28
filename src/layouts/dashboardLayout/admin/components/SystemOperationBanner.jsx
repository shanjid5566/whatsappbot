import { ChartColumnIncreasing } from "lucide-react";
import React from "react";

const SystemOperationBanner = () => {
  return (
    <div className="bg-[#E4F5EB] rounded-lg p-4 mb-6 md:mb-10 flex items-center gap-2 md:gap-3 lg:gap-4">
      <div className="bg-[#87FAB7] p-3 md:p-4 rounded-xl ">
        <ChartColumnIncreasing className="w-6 h-6 md:w-8 md:h-8  text-[#565656]" />
      </div>
      <div>
        <p className="text-lg md:text-xl lg:text-2xl font-semibold text-black mb-1 md:mb-2">
          All Systems Operational
        </p>
      </div>
    </div>
  );
};

export default SystemOperationBanner;
