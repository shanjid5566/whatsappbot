import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] font-sans p-4">
      {/* Main Content */}
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Text */}
        <div className="relative">
          <div className="text-[120px] md:text-[180px] lg:text-[240px] font-bold text-[#DBEAFE] leading-none select-none">
            404
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#2563EB]">
          Page Not Found
        </h1>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-gray-500 text-lg">
            The page you are looking for doesn't exist.
          </p>
          <p className="text-gray-500 text-lg">
            It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white text-[#2563EB] font-semibold rounded-lg shadow-md border-2 border-[#2563EB] hover:bg-[#DBEAFE] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            GO BACK
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#2563EB] text-white font-semibold rounded-lg shadow-md hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    </div>
  );
}
