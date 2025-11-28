import { PiChartLineUpBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { scroller } from "react-scroll";
import { getCurrentUser } from "../../../auth/auth";

const HeroSection = () => {
  const user = getCurrentUser();
  const isLoggedIn = user?.isAuthenticated;
  
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Left Background Pattern */}
      <div className="absolute hidden sm:flex left-0 bottom-0 w-64 xl:w-96 lg:w-80 pointer-events-none opacity-40">
        <figure>
          <img src="/assets/left.png" alt="" />
        </figure>
      </div>

      {/* Right Background Pattern */}
      <div className="absolute hidden sm:flex right-0  bottom-0 w-64 lg:w-80 xl:w-96 pointer-events-none opacity-40 ">
        <figure>
          <img src="/assets/right.png" alt="rightbg" />
        </figure>
      </div>

      {/* Content */}
      <div className="relative z-10 container paddingContainer pt-10 lg:pt-20 pb-12 sm:pb-24 xl:pt-28 lg:pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 lg:gap-4 px-2 py-1.5 lg:px-4 lg:py-3 lg:-ml-6 bg-[#ECE5DB] rounded-full mb-4 lg:mb-6">
            <div className="sm:w-8 sm:h-8 h-4 w-4 bg-[#20BA85] rounded-full flex items-center justify-center shrink-0">
              <PiChartLineUpBold
                className="w-2 h-2 sm:w-4 sm:h-4 text-white"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-xs sm:text-sm xl:text-[16px] text-[#7E7E7E] font-normal">
              Now with Advanced Analytics
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl font-heroBg sm:text-4xl lg:text-5xl font-medium text-black mb-4 leading-tight">
            Send Bulk WhatsApp Messages <br className="hidden sm:block" />
            That Actually Get Delivered
          </h1>

          {/* Description */}
          <p className="text-[16px] lg:text-lg text-[#6F6F6F] font-normal mb-10 max-w-3xl mx-auto lg:leading-relaxed">
            Reach thousands of customers instantly with our enterprise WhatsApp
            <br className="hidden sm:block" />
            Business API platform. Create campaigns, track analytics,
            <br className="hidden sm:block" />
            and grow your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
            <Link
              to={`${isLoggedIn ? '/dashboard' : '/register'}`}
              className="w-full sm:w-auto px-7 py-3 text-sm lg:text-[16px]  font-medium text-white bg-[#3574ED] rounded-sm hover:bg-blue-700 transition-colors duration-200"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
            <Link
              onClick={() => {
                scroller.scrollTo("pricing", {
                  duration: 800,
                  delay: 0,
                  smooth: "easeInOutQuart",
                  offset: -120,
                });
              }}
              className="w-full sm:w-auto px-7 py-3 text-sm lg:text-[16px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
