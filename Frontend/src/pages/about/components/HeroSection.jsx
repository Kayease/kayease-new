import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Kayease team collaboration"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-black-400/10"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse animation-delay-400"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/10 rounded-full blur-lg animate-pulse animation-delay-200"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 xxl:px-16 xxxl:px-24 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8 leading-tight px-4">
            We Are <span className="brand-gradient-text">Kayease</span>
          </h1>
          {/* Subheadline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-semibold mb-6">
            Your Growth-Driven Digital Transformation Partner
          </h2>
          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4">
            We help businesses grow through powerful digital marketing,
            innovative websites, and high-performing apps. From brand awareness
            to user experience, we deliver complete digital solutions.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
            {[
              { number: "150+", label: "Projects Delivered" },
              { number: "50+", label: "Happy Clients" },
              { number: "15+", label: "Years in Tech & Marketing" },
              { number: "24/7", label: "Client Success Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold brand-gradient-text mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4 mt-10">
            <Button
              variant="default"
              className="cta-button text-white font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={18}
              onClick={() => (window.location.href = "/contact")}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
