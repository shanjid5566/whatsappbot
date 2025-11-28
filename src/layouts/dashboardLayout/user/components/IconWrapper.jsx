const IconWrapper = ({ icon: Icon, bgColor = "", textColor = "text-black" }) => (
  <div className={`p-3 ${bgColor} ${textColor} rounded`}>
    <Icon className="w-8 h-8" />
  </div>
);
export default IconWrapper;