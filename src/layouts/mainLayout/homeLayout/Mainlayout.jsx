import React, { useEffect } from "react";
import Navbar from "../../../components/header/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Scroll from "../../../components/ScrollButton/Scroll";
import ScrollToTop from "../../../components/ScrollToTop/ScrollToTop";
import Lenis from "@studio-freight/lenis";

const Mainlayout = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <div className="font-body">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <Scroll />
    </div>
  );
};

export default Mainlayout;
