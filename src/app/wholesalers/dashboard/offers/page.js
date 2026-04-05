"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OffersPage() {
  const router = useRouter();

  useEffect(() => {
    const isLogged = document.cookie.split(';').some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
    if (!isLogged && !localStorage.getItem('ssd_user')) {
        router.push('/login?callbackUrl=/wholesalers/dashboard/offers');
        return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <main className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-36 pb-12 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/wholesalers/dashboard')} className="p-3 bg-white rounded-2xl border border-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center gap-2 group">
            <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Back</span>
          </button>
          <h2 className="text-2xl font-serif font-bold text-brand-primary font-serif">Offers For You</h2>
        </div>

        <div className="bg-white p-20 rounded-[40px] text-center border border-brand-primary/5 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-bl-[100px]" />
           <div className="relative z-10 scale-110 mb-8 w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto">
             <Icon icon="solar:tag-bold-duotone" className="w-12 h-12 text-brand-secondary" />
           </div>
           <h3 className="text-xl font-serif font-bold text-brand-primary italic">Exclusives Coming Soon</h3>
           <p className="text-xs text-brand-primary/40 mt-2 max-w-[280px] mx-auto leading-relaxed">We're personalizing elite B2B promotions and volume-based incentives just for your boutique.</p>
        </div>
      </main>

    </div>
  );
}
