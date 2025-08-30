import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = "+919887664666";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s+/g, "")}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="whatsapp-button relative bg-green-500 hover:bg-green-600 text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          boxShadow: isHovered
            ? "0 12px 40px rgba(37, 211, 102, 0.4)"
            : "0 8px 32px rgba(37, 211, 102, 0.3)",
        }}
        aria-label="Chat on WhatsApp with +91 98876 64666"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-xl md:text-2xl" />

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 whatsapp-pulse"></div>

        {/* Tooltip */}
        <div
          className={`absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs md:text-sm px-2 md:px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
            isHovered ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <span className="font-medium">Chat on WhatsApp</span>
          <div className="text-xs text-slate-300 mt-1">+91 98876 64666</div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;
