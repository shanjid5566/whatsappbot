import { useNavigate } from "react-router-dom";

export default function App() {
  const Navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] font-sans p-4">
      {/* Logo - Top Left */}
      {/* <div className="absolute top-8 left-8">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#8B5CF6]"
        >
          <path
            d="M38 8L28 18L38 28M18 8L8 18L18 28L28 18L38 8M8 28L18 38L28 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div> */}

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-2xl">
        {/* 401 Text */}
        <div className="relative">
          <div className="text-[120px] md:text-[180px] lg:text-[240px] font-bold text-[#E9D5F5] leading-none select-none">
            401
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#7C3AED]">
          No authorization found.
        </h1>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-gray-500 text-lg">
            This page is not publically available.
          </p>
          <p className="text-gray-500 text-lg">
            To access it please login first.
          </p>
        </div>

        {/* Return Home Button */}
        <button
          onClick={() => Navigate("/")}
          className="px-8 py-3 bg-[#8B5CF6] text-white font-semibold rounded-lg shadow-md hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 transition-all duration-300 ease-in-out"
        >
          RETURN HOME
        </button>
      </div>
    </div>
  );
}
