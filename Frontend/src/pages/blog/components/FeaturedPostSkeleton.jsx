import React from "react";

const FeaturedPostSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image skeleton */}
        <div className="lg:order-2">
          <div className="w-full h-64 lg:h-full bg-slate-200"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {/* Badge skeleton */}
          <div className="h-6 bg-slate-200 rounded-full w-24 mb-4"></div>
          
          {/* Title skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-8 bg-slate-200 rounded w-full"></div>
            <div className="h-8 bg-slate-200 rounded w-4/5"></div>
          </div>
          
          {/* Excerpt skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
          
          {/* Meta info skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-slate-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-12 bg-slate-200 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostSkeleton;