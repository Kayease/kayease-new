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

  // Get user roles
  const userRoles = user?.roles || [];
  const roleNames = userRoles.map((role) => role.name || role);

  // Navigation items based on user role
  const getNavigationItems = () => {
    // Check if user has specific roles
    const hasAdminRole = roleNames.some(
      (role) => role.toLowerCase() === "admin"
    );
    const hasEmployeeRole = roleNames.some(
      (role) => role.toLowerCase() === "employee"
    );
    const hasWebsiteManagerRole = roleNames.some(
      (role) => role.toLowerCase() === "website manager"
    );
    const hasHRRole = roleNames.some((role) => role.toLowerCase() === "hr");

    // Base dashboard - show appropriate dashboard based on role
    const dashboardItem = hasEmployeeRole
      ? {
          name: "Dashboard",
          href: "/admin/employee",
          icon: "LayoutDashboard",
          showCount: false,
        }
      : hasWebsiteManagerRole
      ? {
          name: "Dashboard",
          href: "/admin/website-manager",
          icon: "LayoutDashboard",
          showCount: false,
        }
      : {
          name: "Dashboard",
          href: "/admin",
          icon: "LayoutDashboard",
          showCount: false,
        };

    const items = [dashboardItem];

    // Admin-specific items
    if (hasAdminRole) {
      items.push(
        {
          name: "Users",
          href: "/admin/users",
          icon: "Users",
          showCount: false,
        },
        {
          name: "Projects",
          href: "/admin/projects",
          icon: "FolderOpen",
          showCount: false,
        },
        {
          name: "Blogs",
          href: "/admin/blogs",
          icon: "FileText",
          showCount: false,
        },
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
        {
          name: "Team",
          href: "/admin/team",
          icon: "UserPlus",
          showCount: false,
        },
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
        }
      );
    }

    // Website Manager items (if not admin, but has website manager role)
    if (hasWebsiteManagerRole && !hasAdminRole) {
      items.push(
        {
          name: "Projects",
          href: "/admin/projects",
          icon: "FolderOpen",
          showCount: false,
        },
        {
          name: "Blogs",
          href: "/admin/blogs",
          icon: "FileText",
          showCount: false,
        },
        {
          name: "Portfolio",
          href: "/admin/portfolio",
          icon: "FolderOpen",
          showCount: false,
        },
        {
          name: "Clients",
          href: "/admin/clients",
          icon: "Building",
          showCount: false,
        },
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
        }
      );
    }

    // HR items (if not admin, but has HR role)
    if (hasHRRole && !hasAdminRole) {
      items.push(
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
          name: "Team",
          href: "/admin/team",
          icon: "UserPlus",
          showCount: false,
        }
      );
    }

    // Employee-specific items (only for employees, not admins)
    if (hasEmployeeRole && !hasAdminRole) {
      items.push(
        {
          name: "My Projects",
          href: "/admin/employee/projects",
          icon: "FolderOpen",
          showCount: false,
        },
        {
          name: "Tasks",
          href: "/admin/employee/tasks",
          icon: "CheckSquare",
          showCount: false,
        },
        {
          name: "Attendance",
          href: "/admin/employee/attendance",
          icon: "Clock",
          showCount: false,
        },
        {
          name: "Payslips",
          href: "/admin/employee/payslips",
          icon: "FileText",
          showCount: false,
        },
        {
          name: "Calendar",
          href: "/admin/employee/calendar",
          icon: "Calendar",
          showCount: false,
        }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();
  console.log("Navigation items:", navigationItems);

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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r border-slate-300 transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
                {roleNames.some((role) => role.toLowerCase() === "admin") && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                    <Icon name="Shield" size={10} className="mr-1" />
                    Admin
                  </span>
                )}
                {roleNames.some((role) => role.toLowerCase() === "hr") &&
                  !roleNames.some((role) => role.toLowerCase() === "admin") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      <Icon name="Users" size={10} className="mr-1" />
                      HR
                    </span>
                  )}
                {roleNames.some(
                  (role) => role.toLowerCase() === "website manager"
                ) &&
                  !roleNames.some((role) => role.toLowerCase() === "admin") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <Icon name="Globe" size={10} className="mr-1" />
                      Website Manager
                    </span>
                  )}
                {roleNames.some((role) => role.toLowerCase() === "employee") &&
                  !roleNames.some((role) => role.toLowerCase() === "admin") &&
                  !roleNames.some((role) => role.toLowerCase() === "hr") &&
                  !roleNames.some(
                    (role) => role.toLowerCase() === "website manager"
                  ) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      <Icon name="User" size={10} className="mr-1" />
                      Employee
                    </span>
                  )}
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <Icon name="X" size={20} className="text-slate-600" />
            </button>
          </div>

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
                  {(() => {
                    const currentItem = navigationItems.find(
                      (item) =>
                        location.pathname === item.href ||
                        (item.href !== "/admin" &&
                          location.pathname.startsWith(item.href))
                    );

                    if (currentItem) {
                      return currentItem.name;
                    }

                    // Handle employee routes
                    if (location.pathname.startsWith("/admin/employee")) {
                      const employeeRoutes = {
                        "/admin/employee": "Employee Dashboard",
                        "/admin/employee/projects": "My Projects",
                        "/admin/employee/tasks": "Tasks",
                        "/admin/employee/attendance": "Attendance",
                        "/admin/employee/payslips": "Payslips",
                        "/admin/employee/calendar": "Calendar",
                      };
                      return (
                        employeeRoutes[location.pathname] ||
                        "Employee Dashboard"
                      );
                    }

                    return "Admin Panel";
                  })()}
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
