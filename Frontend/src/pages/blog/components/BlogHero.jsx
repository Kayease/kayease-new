import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BlogHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-6">
            <Icon name="BookOpen" size={16} className="text-primary" />
            <span className="text-sm font-medium text-slate-700">
              Knowledge Hub
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-4">
            Insights &<span className="brand-gradient-text"> Innovation</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
            Discover the latest trends, technical deep-dives, and strategic
            insights that drive digital transformation success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
