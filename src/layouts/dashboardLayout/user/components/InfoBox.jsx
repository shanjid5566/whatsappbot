import { AlertCircle } from "lucide-react";
const InfoBox = ({heading, text }) => (
  <div className="flex flex-col md:flex-row items-center p-4 bg-[#EFF6FF] text-blue-800">
    <div className="w-10 h-10 bg-white flex justify-center items-center rounded mr-2">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-1 text-[#000000]">{heading}</h3>
      <p className="text-sm text-[#000000]">{text}</p>
    </div>
  </div>
);
export default InfoBox;
