import React, { useState, useEffect } from "react";
import Icon from "./AppIcon";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform";
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-500 text-white`;
      case "error":
        return `${baseStyles} bg-red-500 text-white`;
      case "info":
        return `${baseStyles} bg-blue-500 text-white`;
      case "warning":
        return `${baseStyles} bg-yellow-500 text-white`;
      default:
        return `${baseStyles} bg-gray-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "info":
        return "Info";
      case "warning":
        return "AlertTriangle";
      default:
        return "Info";
    }
  };

  return (
    <div className={getToastStyles()}>
      <Icon name={getIcon()} size={20} />
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 hover:opacity-75"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

export default Toast;