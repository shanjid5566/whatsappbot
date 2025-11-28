import React from "react";

const steps = [
  {
    number: "01",
    color: "#2D6EEF",
    title: "Share Link",
    description: "Share your referral link with your friends",
  },
  {
    number: "02",
    color: "#08A171",
    title: "Friends List",
    description: "Friends register using your link",
  },
  {
    number: "03",
    color: "#9F46F1",
    title: "Earn Commission",
    description: "Earn commission from their earnings",
  },
];

export default function StepsSectionCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-[#F2F1F1] rounded-lg p-4 sm:p-6 md:p-8 flex flex-col h-full"
        >
          {/* Step Number */}
          <div
            className="text-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center font-bold text-base sm:text-lg md:text-xl mb-4 lg:mb-6 "
            style={{ backgroundColor: step.color }}
          >
            {step.number}
          </div>

          {/* Step Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl text-[#000000] font-medium mt-4 sm:mt-6 md:mt-6 mb-1">
            {step.title}
          </h3>

          {/* Step Description */}
          <p className="text-[#555555] text-sm sm:text-base md:text-base leading-relaxed md:w-[90%]">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
