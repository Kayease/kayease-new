import React from "react";

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse h-full flex flex-col">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-slate-200"></div>
      
      {/* Content skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category and date skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        
        {/* Author and read time skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;