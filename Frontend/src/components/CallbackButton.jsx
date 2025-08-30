import React, { useState } from "react";
import { toast } from "react-toastify";
import Icon from "./AppIcon";
import CallbackModal from "./CallbackModal";

const CallbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    toast.success("Your callback request has been submitted!");
    closeModal();
  };

  return (
    <>
      {/* Floating Callback Button */}
      <button
        onClick={openModal}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-full transition-all duration-500 hover:scale-110 group border-4 border-white/20 backdrop-blur-sm flex items-center justify-center"
        title="Request a callback"
        aria-label="Request a callback"
      >
        {/* Phone Icon - Perfectly Centered */}
        <Icon
          name="Phone"
          size={28}
          className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
        />

        {/* Enhanced Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-blue-300/30 animate-ping animation-delay-300"></div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl group-hover:bg-blue-300/30 transition-all duration-500"></div>

        {/* Enhanced Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap shadow-2xl border border-slate-700/50">
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={16} className="text-blue-400" />
            <span>Request Callback</span>
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>

        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Callback Modal */}
      <CallbackModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CallbackButton;
