import React from "react";

const LoadingSpinner = ({ size = "md", message = "Loading...", fullScreen = true, className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const content = (
    <div className="text-center">
      <div
        className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2`}
      ></div>
      {message && (
        <p className="text-slate-600 text-sm">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {content}
    </div>
  );
};

export default LoadingSpinner;