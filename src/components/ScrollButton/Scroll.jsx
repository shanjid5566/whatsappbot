import React, { useEffect, useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import { HiOutlineArrowUp } from "react-icons/hi";

const Scroll = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={`fixed bottom-5 group hover:scale-110 right-5 z-50 grid place-items-center w-10 sm:w-11 sm:h-11 h-10 rounded-full bg-[#4ED35C] text-white shadow-xl transition-all duration-300 cursor-pointer ${
        visible
          ? "opacity-100 translate-y-0 "
          : "opacity-0 pointer-events-none translate-y-3"
      }`}
    >
      <HiOutlineArrowUp  className="w-4 h-4 group-hover:mb-1.5 transition-all duration-300" />
    </button>
  );
};

export default Scroll;
