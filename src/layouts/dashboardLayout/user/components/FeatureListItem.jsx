const FeatureListItem = ({ icon: Icon, title, description, bgColor = "", textColor = "" }) => (
  <div className="flex items-start space-x-3">
    <div className={`xl:w-12 w-10 h-10 xl:h-12 bg ${bgColor} flex justify-center items-center rounded`}>
      <Icon className={`xl:w-7 w-5 h-5 xl:h-7 ${textColor} mt-1`} />
    </div>
    <div>
      <h4 className="text-base lg:text-lg font-medium text-[#000000]">{title}</h4>
      <p className="text-sm xl:text-base  text-[#000000]">{description}</p>
    </div>
  </div>
);
export default FeatureListItem;
