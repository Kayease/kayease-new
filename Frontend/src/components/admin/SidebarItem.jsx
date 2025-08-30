import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const SidebarItem = ({
  name,
  href,
  icon,
  count = 0,
  showCount = true,
  className = "",
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === href ||
    (href !== "/admin" && location.pathname.startsWith(href));

  // Contextual tooltip for count badge
  const countTooltip = (() => {
    if (!showCount || count <= 0) return "";
    if (name.toLowerCase().includes("application"))
      return `Pending applications: ${count}`;
    if (name.toLowerCase().includes("contact"))
      return `New/unread contacts: ${count}`;
    if (name.toLowerCase().includes("callback"))
      return `New callback requests: ${count}`;
    return `${count} pending`;
  })();

  return (
    <Link
      to={href}
      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${className} ${
        isActive
          ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>
      )}

      <Icon
        name={icon}
        size={20}
        className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${
          isActive ? "text-white" : "text-slate-600 group-hover:text-slate-700"
        }`}
      />

      <span className="relative z-10 flex-1 font-medium">{name}</span>

      {/* Count Badge */}
      {showCount && count > 0 && (
        <div
          className={`relative z-10 flex items-center justify-center min-w-[22px] h-6 px-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
            isActive
              ? "bg-white/20 text-black border border-black/30"
              : "bg-white text-black border border-primary shadow-sm group-hover:bg-primary/90 group-hover:scale-105"
          }`}
          title={countTooltip}
          aria-label={countTooltip}
        >
          {count > 99 ? "99+" : count}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
      )}
    </Link>
  );
};

export default SidebarItem;
