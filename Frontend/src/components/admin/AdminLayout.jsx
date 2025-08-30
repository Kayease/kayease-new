import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Icon from "../AppIcon";
import Button from "../ui/Button";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../contexts/AuthContext";
import { usePendingCounts } from "../../contexts/PendingCountsContext";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { pendingCounts, loading } = usePendingCounts();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarNavRef = useRef(null);

  // Persist sidebar scroll position between page navigations
  useEffect(() => {
    const savedScroll = Number(
      sessionStorage.getItem("adminSidebarScroll") || 0
    );
    if (sidebarNavRef.current) {
      sidebarNavRef.current.scrollTop = savedScroll;
    }

    const handleScroll = () => {
      if (!sidebarNavRef.current) return;
      sessionStorage.setItem(
        "adminSidebarScroll",
        String(sidebarNavRef.current.scrollTop)
      );
    };

    const navEl = sidebarNavRef.current;
    if (navEl) navEl.addEventListener("scroll", handleScroll);
    return () => {
      if (navEl) navEl.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Navigation items with pending counts
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: "LayoutDashboard",
      showCount: false,
    },
    { name: "Users", href: "/admin/users", icon: "Users", showCount: false },
    {
      name: "API Test",
      href: "/admin/api-test",
      icon: "TestTube",
      showCount: false,
    },
    { name: "Blogs", href: "/admin/blogs", icon: "FileText", showCount: false },
    {
      name: "Portfolio",
      href: "/admin/portfolio",
      icon: "FolderOpen",
      showCount: false,
    },
    {
      name: "Careers",
      href: "/admin/careers",
      icon: "Briefcase",
      showCount: false,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: "UserCheck",
      showCount: true,
      count: pendingCounts.applications,
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: "Building",
      showCount: false,
    },
    { name: "Team", href: "/admin/team", icon: "UserPlus", showCount: false },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: "Mail",
      showCount: true,
      count: pendingCounts.contacts,
    },
    {
      name: "Callback Requests",
      href: "/admin/callback-requests",
      icon: "Phone",
      showCount: true,
      count: pendingCounts.callbackRequests,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r border-slate-300 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="flex items-center h-20 px-6 border-b border-slate-300 bg-gradient-to-r from-slate-50 to-white">
            <Link to="/">
              <div className="relative">
                <img
                  src="/Kayease-logo.png"
                  alt="Kayease"
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            <div className="absolute left-1/2 -translate-x-1/4">
              <span className="text-xl font-semibold text-slate-800">
                {user?.name.split(" ")[0]}
              </span>
              <span className="block text-sm font-medium text-primary">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  <Icon name="Shield" size={10} className="mr-1" />
                  {user?.role}
                </span>
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <Icon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

          {/* User info */}
          {/* <div className="px-6 py-6 border-b border-slate-300 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="User" size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <Icon name="Shield" size={10} className="mr-1" />
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <nav
            ref={sidebarNavRef}
            className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide bg-white"
          >
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                count={item.count || 0}
                showCount={item.showCount}
              />
            ))}
          </nav>

          {/* Logout button */}
          <div className="px-4 py-6 border-t border-slate-300 bg-gradient-to-r from-slate-50 to-white">
            <Button
              onClick={handleLogout}
              variant="default"
              size="lg"
              className="w-full bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-300 shadow-sm"
              iconName="LogOut"
              iconPosition="left"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area with proper spacing for fixed sidebar */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-300 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <Icon name="Menu" size={20} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {navigationItems.find(
                    (item) =>
                      location.pathname === item.href ||
                      (item.href !== "/admin" &&
                        location.pathname.startsWith(item.href))
                  )?.name || "Admin Panel"}{" "}
                  Management
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-slate-500 hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-300"
                title="View Website"
              >
                <Icon name="Home" size={18} />
              </Link>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleLogout}
                  variant="default"
                  size="lg"
                  className="w-full bg-transparent border-2 hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable page content */}
        <main className="min-h-screen p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
