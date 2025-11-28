import { useState, useRef, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import TodaysMessagesCard from "../components/statusCards/TodaysMessagesCard";
import axiosInstance from "../../../../config/axiosInstance";
import ProfileBanner from "../components/ProfileBanner";
import WhatsappList from "../components/WhatsappList";
import AddWhatsAppModal from "../components/AddWhatsappModal";
import QRModal from "../components/QRModal";

import WhatsappActiveCard from "../components/statusCards/WhatsappActiveCard";
import WhatsappDisconnectedCard from "../components/statusCards/WhatsappDisconnectedCard";
import TodaysBlastCard from "../components/statusCards/TodaysBlastCard";

export default function WhatsappBot() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const prevQrRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup object URL on unmount
      if (prevQrRef.current) {
        URL.revokeObjectURL(prevQrRef.current);
        prevQrRef.current = null;
      }
    };
  }, []);

  const fetchQrAndOpen = async () => {
    try {
      // Open QR modal immediately with loading state (no URL yet)
      setQrOpen(true);
      setQrUrl(""); // empty means loading
      
      // Wait 5 seconds before fetching QR
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Now fetch the QR image as blob
      const blob = await axiosInstance.get("/api/whatsapp-scanner/qr.png", {
        responseType: "blob",
      });

      // revoke previous object URL if any
      if (prevQrRef.current) {
        URL.revokeObjectURL(prevQrRef.current);
        prevQrRef.current = null;
      }

      const url = URL.createObjectURL(blob);
      prevQrRef.current = url;
      setQrUrl(url);
    } catch (err) {
      console.error("Failed to fetch QR:", err);
      // close QR modal on error
      setQrOpen(false);
      setQrUrl("");
    }
  };

  const closeQr = () => {
    setQrOpen(false);
    if (prevQrRef.current) {
      try {
        URL.revokeObjectURL(prevQrRef.current);
      } catch {
        // ignore
      }
      prevQrRef.current = null;
      setQrUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 lg:px-11">
      <div className="">
        {/* Header */}
        <div>
          <div className="flex w-full justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-[#000000]">
              WhatsApp
            </h1>
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#BD31CE] px-2 md:px-4 py-2 text-white rounded-md flex items-center justify-center gap-1 md:gap-2 hover:bg-[#A028B8] transition-colors"
            >
              <span>Add WhatsApp</span>
              <IoMdAddCircle className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[#656565] sm:mb-8 mb-4 text-base md:text-lg lg:text-xl">
            Manage your WhatsApp to receive messages
          </p>
        </div>
        {/* Top yellow banner */}
        <ProfileBanner
          title=" PENTINGPERINGATAN"
          text="Dilarang menghapus pesan yang sudah terkirim atau menggunakan timer."
        />
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 my-4 sm:my-8">
          <WhatsappActiveCard />
          <WhatsappDisconnectedCard />
          <TodaysBlastCard />
          <TodaysMessagesCard />
        </div>
        {/* Profile and Settings Sections */}
        <WhatsappList />
        {/* Add WhatsApp Modal */}
        <AddWhatsAppModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onContinue={fetchQrAndOpen}
        />
        <QRModal
          isOpen={qrOpen}
          imgUrl={qrUrl}
          onClose={closeQr}
          onConnected={closeQr}
        />
      </div>
    </div>
  );
}
