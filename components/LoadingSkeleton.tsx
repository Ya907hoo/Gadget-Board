import React from "react";

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-3xl bg-white border border-doraemon-cream-border p-5 shadow-doraemon-sm overflow-hidden flex flex-col justify-between h-64 relative"
        >
          {/* Skeleton Shimmer Sweep Effect */}
          <div className="absolute inset-0 skeleton-shimmer opacity-40"></div>

          <div>
            {/* Top Badge Skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-24 bg-doraemon-cream rounded-full"></div>
              <div className="h-5 w-12 bg-doraemon-cream rounded-full"></div>
            </div>

            {/* Title Skeleton */}
            <div className="h-6 w-5/6 bg-doraemon-cream rounded-xl mb-2"></div>
            <div className="h-6 w-3/5 bg-doraemon-cream rounded-xl mb-4"></div>

            {/* Description Lines Skeleton */}
            <div className="h-4 w-full bg-doraemon-cream rounded-lg mb-2"></div>
            <div className="h-4 w-4/5 bg-doraemon-cream rounded-lg"></div>
          </div>

          {/* Footer Skeleton */}
          <div className="pt-4 border-t border-doraemon-cream-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-doraemon-cream"></div>
              <div className="h-4 w-20 bg-doraemon-cream rounded-lg"></div>
            </div>
            <div className="h-8 w-16 bg-doraemon-cream rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
