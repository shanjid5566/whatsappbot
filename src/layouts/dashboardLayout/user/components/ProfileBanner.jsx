import { TriangleAlert } from "lucide-react";

const ProfileBanner = ({title="" ,text ="" }) => (
  <div className="flex flex-col md:flex-row items-center p-4 bg-[#FEFCE8] rounded-md">
    <div className="w-12 h-12 bg-white flex justify-center items-center">
      <TriangleAlert className="w-8 h-8" />
    </div>
    <div className="ml-3">
      <h3 className="font-semibold text-lg md:text-xl text-[#000000] mb-1 md:mb-2">{title}</h3>
      <p className="text-sm sm:text-base md:text-sm lg:text-base text-[#000000]">
        {text}
      </p>
    </div>
  </div>
);
export default ProfileBanner;
