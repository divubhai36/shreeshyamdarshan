import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-accent pt-24 lg:pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left: Image Skeleton */}
          <div className="aspect-square rounded-3xl bg-brand-primary/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Right: Info Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-brand-primary/5 rounded-full" />
              <div className="h-12 w-full bg-brand-primary/5 rounded-full" />
              <div className="h-12 w-2/3 bg-brand-primary/5 rounded-full" />
            </div>
            <div className="h-8 w-32 bg-brand-primary/5 rounded-full" />
            <div className="h-32 w-full bg-brand-primary/5 rounded-2xl" />
            <div className="h-16 w-full bg-brand-primary/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
