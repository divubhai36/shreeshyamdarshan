"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReviewSection from './ReviewSection';

export default function WholesalerDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const isLogged = cookies.some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
    const storedUser = localStorage.getItem('ssd_user');

    if (!isLogged && !storedUser) {
        router.push('/login?callbackUrl=/wholesalers/dashboard');
        return;
    }

    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    document.cookie = "ssd_wholesale_logged=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem('ssd_user');
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <main className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-36 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header (App Like) */}
          <div className="flex items-center gap-5 p-2 bg-white/50 backdrop-blur-sm rounded-[32px] border border-brand-primary/5 pr-6">
            <div className="w-20 h-20 rounded-[24px] bg-brand-primary text-white flex items-center justify-center text-3xl font-serif font-bold shadow-xl">
              {user?.name?.charAt(0) || 'W'}
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-serif font-bold text-brand-primary">{user?.name || 'Valued Partner'}</h1>
              <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-[0.2em] mt-1">SSD Elite Wholesaler</p>
            </div>
            <button onClick={handleLogout} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors">
              <Icon icon="solar:logout-bold-duotone" className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Options (WhatsApp/Settings Style) */}
          <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 overflow-hidden">
            <MenuOption
              icon="solar:cart-large-bold-duotone"
              label="Cart"
              sub="Your procurement registry"
              onClick={() => router.push('/wholesalers/dashboard/cart')}
            />
            <MenuOption
              icon="solar:heart-bold-duotone"
              label="Saved Product"
              sub="Curated favorites"
              onClick={() => router.push('/wholesalers/dashboard/saved')}
            />
            <MenuOption
              icon="solar:bill-list-bold-duotone"
              label="Orders"
              sub="Fulfillment history & status"
              onClick={() => router.push('/wholesalers/dashboard/orders')}
            />
            <MenuOption
              icon="solar:tag-bold-duotone"
              label="Offers For You"
              sub="Exclusive B2B promotions"
              onClick={() => router.push('/wholesalers/dashboard/offers')}
            />
            <MenuOption
              icon="si:inventory-duotone"
              label="Ready Stock"
              sub="Exclusive B2B promotions"
              onClick={() => router.push('/wholesalers/dashboard/collection/ready-stock')}
            />
          </div>

          <ReviewSection />

          <div className="text-center p-8 bg-brand-primary/2 rounded-[32px] border border-dashed border-brand-primary/10">
             <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] leading-relaxed">
               Authorized B2B Portal <br/> Shree Shyam Darshan © 2026
             </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function MenuOption({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-5 p-6 hover:bg-brand-primary/2 active:bg-brand-primary/5 transition-all group text-left border-b border-brand-primary/5 last:border-0"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#fcfbf7] flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
        <Icon icon={icon} className="w-7 h-7" />
      </div>
      <div className="flex-grow">
        <h4 className="text-lg font-serif font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">{label}</h4>
        <p className="text-[10px] text-brand-primary/30 font-bold uppercase tracking-widest mt-1">{sub}</p>
      </div>
      <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-brand-primary/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
    </button>
  );
}
