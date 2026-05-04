import React from 'react';
import { ProductSkeleton, PageHeaderSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-accent pt-24 lg:pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeaderSkeleton />
        <ProductSkeleton />
      </div>
    </div>
  );
}
