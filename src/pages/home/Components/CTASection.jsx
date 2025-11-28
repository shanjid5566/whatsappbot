import { Link } from "react-router-dom";
import { getCurrentUser } from "../../../auth/auth";

const CTASection = () => {
  const user = getCurrentUser();
  const isLoggedIn = user?.isAuthenticated;
  
  return (
    <section className="bg-white py-10 lg:py-20">
      <div className="container paddingContainer">
        {/* The parent container clips the images */}
        <div className="relative bg-[#BC30CD]   xl:h-[525px] py-4 rounded-xl overflow-hidden">
          
          {/* Top Left Star Pattern */}
          <div className="absolute hidden lg:flex top-0 left-0 w-full h-full pointer-events-none">
            <img src="/assets/readyCardLeft.png" alt="LeftBg" className="absolute top-0 left-0 w-auto h-auto max-w-[60%] max-h-[60%]" />
          </div>

          {/* Bottom Right Cube Pattern */}
          <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none">
            <img src="/assets/readyCardRight.png" alt="RightBg" className="absolute bottom-0 right-0 w-auto h-auto max-w-[85%] max-h-[85%]" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center h-full flex flex-col items-center justify-center px-4 py-5 sm:py-10 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[40px]  font-semibold text-white mb-2">
              Ready to Engage Your Customers
              <br />
              Like Never Before?
            </h2>

            <p className="text-sm sm:text-[16px] lg:text-xl text-purple-100 font-normal mb-8 lg:mb-10 max-w-2xl mx-auto">
              Join thousands of businesses already using
              <br />
              our platform start Free Trial
            </p>

            <Link
              to={`${isLoggedIn ? '/dashboard' : '/register'}`}
              className="inline-block px-5 py-2 lg:px-9 lg:py-3 text-xs sm:text-[16px] bg-white text-black font-normal rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;