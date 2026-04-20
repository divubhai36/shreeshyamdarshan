import React from 'react';

export const CategorySkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="relative aspect-[3/4] rounded-[24px] lg:rounded-[40px] bg-brand-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 flex flex-col items-center justify-end space-y-3">
          <div className="h-6 w-24 bg-brand-primary/10 rounded-full" />
          <div className="h-4 w-16 bg-brand-primary/5 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const ProductSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="flex flex-col h-full bg-white rounded-2xl lg:rounded-3xl border border-brand-primary/5 overflow-hidden">
        <div className="aspect-square m-2 lg:m-3 rounded-xl lg:rounded-2xl bg-brand-accent/50 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="px-3 lg:px-4 pb-4 space-y-3 mt-2">
          <div className="h-2 w-12 bg-brand-primary/5 rounded-full mx-auto" />
          <div className="h-4 w-full bg-brand-primary/5 rounded-full" />
          <div className="h-4 w-2/3 bg-brand-primary/5 rounded-full mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

export const PageHeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-12 lg:mb-20 text-center space-y-6">
    <div className="h-4 w-32 bg-brand-primary/5 rounded-full" />
    <div className="h-12 lg:h-20 w-64 lg:w-96 bg-brand-primary/5 rounded-full" />
  </div>
);
