import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "../../contexts/AuthContext";
import { usePendingCounts } from "../../contexts/PendingCountsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { pendingCounts } = usePendingCounts();
  const totalPending =
    (pendingCounts?.contacts || 0) +
    (pendingCounts?.applications || 0) +
    (pendingCounts?.callbackRequests || 0);

  const navigationItems = [
    { name: "Home", path: "/homepage", icon: "Home" },
    { name: "About", path: "/about", icon: "Users" },
    { name: "Services", path: "/services", icon: "Settings" },
    { name: "Portfolio", path: "/portfolio", icon: "Briefcase" },
    { name: "Blog", path: "/blog", icon: "FileText" },
    { name: "Careers", path: "/careers", icon: "UserPlus" },
    { name: "Contact", path: "/contact", icon: "Mail" },
  ];

  // Resolve dashboard path based on roles
  const getDashboardPath = () => {
    const roles = user?.roles || [];
    const names = roles.map(r => r.name || r);
    if (names.includes('ADMIN')) return '/admin';
    if (names.includes('HR')) return '/hr';
    if (names.includes('MANAGER')) return '/manager';
    if (names.includes('WEBSITE MANAGER')) return '/website-manager';
    if (names.includes('EMPLOYEE')) return '/employee';
    return '/';
  };

  // Add Dashboard nav item if logged in (any role)
  const dashboardNavItem = {
    name: "Dashboard",
    path: getDashboardPath(),
    icon: "LayoutDashboard",
  };
  const navItemsWithDashboard = user
    ? [...navigationItems, dashboardNavItem]
    : navigationItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/20 backdrop-blur-lg ${
        isScrolled ? "shadow-brand border-b border-slate-200/50" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Centered on mobile, left-aligned on desktop */}
          <div className="flex-1 lg:flex-none">
            <Link
              to="/homepage"
              className="flex items-center justify-center lg:justify-start space-x-3 group"
              onClick={closeMenu}
            >
              <div className="relative flex items-center space-x-3">
                <img
                  src={"/Kayease-black.png"}
                  alt="Kayease Logo"
                  className="w-28 h-14 sm:w-32 sm:h-16 md:w-36 md:h-18 lg:w-40 lg:h-20 object-contain rounded-lg transition-all duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItemsWithDashboard.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                  isActivePath(item.path)
                    ? "text-primary bg-primary/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Icon
                    name={item.icon}
                    size={16}
                    className={`transition-colors duration-300 ${
                      isActivePath(item.path) ? "text-primary" : "text-black"
                    }`}
                  />
                  <span className="text-black">{item.name}</span>
                  {item.path === "/admin" && totalPending > 0 && (
                    <span
                      title={`Pending: ${totalPending}`}
                      className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200"
                    >
                      {totalPending}
                    </span>
                  )}
                </span>
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 flex-1 lg:flex-none justify-end">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={14}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                className="hidden md:flex cta-button text-white font-medium"
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
                onClick={() => navigate("/contact")}
              >
                Start Project
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-muted transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Icon
                name={isMenuOpen ? "X" : "Menu"}
                size={24}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-brand-lg transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-2">
            {(user ? [...navigationItems] : navigationItems).map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  isActivePath(item.path)
                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActivePath(item.path) ? "text-primary" : "text-current"
                  }`}
                />
                <span className="flex items-center">
                  {item.name}
                  {item.path === "/admin" && totalPending > 0 && (
                    <span
                      title={`Pending: ${totalPending}`}
                      className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200"
                    >
                      {totalPending}
                    </span>
                  )}
                </span>
                {isActivePath(item.path) && (
                  <Icon
                    name="ChevronRight"
                    size={16}
                    className="ml-auto text-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            {user ? (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={14}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                fullWidth
                className="cta-button text-white font-medium"
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
              >
                Start Your Project
              </Button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}
    </header>
  );
};

export default Header;
