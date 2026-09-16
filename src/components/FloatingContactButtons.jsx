import React from "react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

const PHONE_NUMBER = "+917838489517";
const WHATSAPP_NUMBER = "917838489517";

export default function FloatingContactButtons() {
  const whatsappHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    "Hi, I'm interested in Jawahar Global Foundation courses."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 print:hidden">

      {/* WhatsApp Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* Call Button */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        aria-label="Call us"
        className="w-14 h-14 rounded-full bg-[#C62828] hover:bg-[#8E0000] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <FaPhoneAlt size={22} />
      </a>

    </div>
  );
}