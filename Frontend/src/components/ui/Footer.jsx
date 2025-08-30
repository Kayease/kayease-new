import React, { useState, useEffect } from "react";
// Import only the Lucide icons needed for the footer
import {
  Users,
  Settings,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Code,
  Smartphone,
  Palette,
  TrendingUp,
  Cloud,
  Send,
  Heart,
} from "lucide-react";
// Brand icons from Simple Icons
import { SiInstagram, SiLinkedin, SiYoutube, SiSnapchat } from "react-icons/si"; // <-- Add SiSnapchat
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const socials = [
  // Lucide icon names: Instagram, Twitter, Linkedin, Youtube
  {
    name: "Instagram",
    url: "https://www.instagram.com/Kayease.global/",
    icon: "Instagram",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
  {
    name: "Twitter",
    url: "https://x.com/Kayeaseglobal",
    icon: "Twitter",
    color: "hover:text-blue-400",
    bgColor: "hover:bg-blue-50",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/kayease/",
    icon: "Linkedin", // Correct Lucide name
    color: "hover:text-blue-600",
    bgColor: "hover:bg-blue-50",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: "Youtube", // Correct Lucide name
    color: "hover:text-red-500",
    bgColor: "hover:bg-red-50",
  },
];

const quickLinks = [
  { name: "About Us", path: "/about", icon: "Users" },
  { name: "Services", path: "/services", icon: "Settings" },
  { name: "Portfolio", path: "/portfolio", icon: "Briefcase" },
  { name: "Blog", path: "/blog", icon: "FileText" },
  { name: "Contact", path: "/contact", icon: "Mail" },
];

const services = [
  { name: "Web Development", icon: "Code" },
  { name: "Mobile Apps", icon: "Smartphone" },
  { name: "UI/UX Design", icon: "Palette" },
  { name: "Digital Marketing", icon: "TrendingUp" },
  { name: "Cloud Solutions", icon: "Cloud" },
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("footer");
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 border-t border-slate-200/50 text-slate-800 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl animate-pulse-slow animation-delay-400"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-primary/20 rounded-full geometric-float"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-secondary/20 rounded-full geometric-float animation-delay-200"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary/30 rounded-full geometric-float animation-delay-600"></div>
      </div>

      {/* Wave Pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-gradient-flow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand Section */}
          <div
            className={`lg:col-span-1 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Logo */}
            <Link to="/homepage" className="flex items-center space-x-3 group">
              <div className="relative flex items-center space-x-3">
                <img
                  src={"/Kayease-black.png"}
                  alt="Kayease Logo"
                  className="w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 lg:w-44 lg:h-22 object-contain rounded-lg transition-all duration-300"
                />
              </div>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed mb-4 sm:mb-6">
              Transforming ideas into digital reality with innovative solutions
              that drive business growth and user engagement.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Mail size={16} className="text-primary" strokeWidth={2} />
                </div>
                <a
                  href="mailto:sales@kayease.com"
                  className="text-sm text-slate-600 hover:text-primary transition-colors duration-200 hover:underline"
                >
                  sales@kayease.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Mail size={16} className="text-primary" strokeWidth={2} />
                </div>
                <a
                  href="mailto:support@kayease.com"
                  className="text-sm text-slate-600 hover:text-primary transition-colors duration-200 hover:underline"
                >
                  support@kayease.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Phone size={16} className="text-primary" strokeWidth={2} />
                </div>
                <a
                  href="tel:+919887664666"
                  className="text-sm text-slate-600 hover:text-primary transition-colors duration-200 hover:underline"
                >
                  +91 98876 64666
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-6 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="flex items-center space-x-3 text-sm text-slate-600 hover:text-primary transition-all duration-200 group py-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {link.icon === "Users" && (
                      <Users
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {link.icon === "Settings" && (
                      <Settings
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {link.icon === "Briefcase" && (
                      <Briefcase
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {link.icon === "FileText" && (
                      <FileText
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {link.icon === "Mail" && (
                      <Mail
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-6 relative">
              Our Services
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={service.name}>
                  <Link
                    to="/services"
                    className="flex items-center space-x-3 text-sm text-slate-600 hover:text-primary transition-all duration-200 group py-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {service.icon === "Code" && (
                      <Code
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {service.icon === "Smartphone" && (
                      <Smartphone
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {service.icon === "Palette" && (
                      <Palette
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {service.icon === "TrendingUp" && (
                      <TrendingUp
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    {service.icon === "Cloud" && (
                      <Cloud
                        size={14}
                        className="text-slate-400 group-hover:text-primary transition-colors duration-200"
                        strokeWidth={2}
                      />
                    )}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {service.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-6 relative">
              Stay Connected
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 justify-start flex-wrap">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/Kayease.global/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 group"
              >
                <SiInstagram
                  size={28}
                  className="text-slate-600 p-1 group-hover:text-pink-500 transition-colors duration-200"
                />
              </a>
              {/* Twitter/X */}
              <a
                href="https://x.com/Kayeaseglobal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group"
              >
                <FaXTwitter
                  size={28}
                  className="text-slate-600 p-1 group-hover:text-blue-400 transition-colors duration-200"
                />
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/kayease/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 group"
              >
                <SiLinkedin
                  size={28}
                  className="text-slate-600 p-1 group-hover:text-blue-600 transition-colors duration-200"
                />
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow hover:bg-red-50 hover:border-red-300 transition-all duration-200 group"
              >
                <SiYoutube
                  size={28}
                  className="text-slate-600 p-1 group-hover:text-red-500 transition-colors duration-200"
                />
              </a>
              {/* Snapchat */}
              <a
                href="https://www.snapchat.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 group"
              >
                <SiSnapchat
                  size={28}
                  className="text-slate-600 p-1 group-hover:text-yellow-400 transition-colors duration-200"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider with Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-primary to-secondary w-16 h-0.5 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Kayease. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link
                to="/privacy"
                className="hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Made with</span>
            <Heart
              size={12}
              className="text-red-500 animate-pulse"
              strokeWidth={2}
            />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
