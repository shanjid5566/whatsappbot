import { CiFacebook } from "react-icons/ci";
import { IoLogoInstagram } from "react-icons/io5";
import { PiYoutubeLogo } from "react-icons/pi";
import { TbBrandLinkedin } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    legal: [
      { name: "Privacy Policy", path: "privacy" },
      { name: "Terms of Service", path: "terms" },
      { name: "Cookie Policy", path: "cookies" },
    ],
  };

  const socialLinks = [
    { icon: CiFacebook, href: "#facebook", label: "Facebook" },
    { icon: TbBrandLinkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: IoLogoInstagram, href: "#instagram", label: "Instagram" },
    { icon: PiYoutubeLogo, href: "#youtube", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-[#3574ED] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute  -right-20 -bottom-10  opacity-100">
        <figure>
          <img src="/assets/footerBg.svg" alt="bg" />
        </figure>
      </div>

      {/* Content */}
      <div className="relative z-10 container paddingContainer py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 xl:gap-25">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to={'/'} className="text-xl sm:text-2xl lg:text-[40px] font-bold mb-1 sm:mb-2">
              Bulk Whatsapp
            </Link>
            <p className="text-blue-100 text-sm lg:text-xl leading-relaxed  z-50">
              Enterprise WhatsApp messaging platform  <br className="hidden xl:inline" /> for{" "}
              modern businesses.
            </p>
          </div>

          {/* Social Media Section */}
          <div className="">
            <h3 className="text-xl lg:text-2xl font-semibold mb-2 sm:mb-4">
              Social medias
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  to={social.href}
                  aria-label={social.label}
                  className="sm:w-10 sm:h-10 w-8 h-8 rounded-lg bg-[#4D88F9] text-white flex items-center justify-center  hover:text-blue-200 transition-all duration-200"
                >
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Column */}
        <div className="w-full flex sm:justify-center mx-auto">
          <ul className="gap-3.5 sm:gap-10 text-center lg:text-left flex sm:flex-row justify-between items-start mt-10 lg:mt-20">
            {footerLinks.legal.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className="text-blue-100 text-xs lg:text-[16px] whitespace-nowrap hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
