"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart = [], removeFromCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();

  useEffect(() => { 
    const isLogged = document.cookie.split(';').some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
    if (!isLogged && !localStorage.getItem('ssd_user')) {
        router.push('/login?callbackUrl=/wholesalers/dashboard/cart');
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
          <h2 className="text-2xl font-serif font-bold text-brand-primary">Registry (Cart)</h2>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] text-center border border-brand-primary/5 shadow-xl">
            <Icon icon="solar:cart-large-bold-duotone" className="w-16 h-16 text-brand-primary/10 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-brand-primary">Empty Registry</h3>
            <p className="text-xs text-brand-primary/40 mt-2 max-w-[280px] mx-auto leading-relaxed">We're personalizing elite B2B promotions and volume-based incentives just for your boutique.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-sm space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-4 border-b border-brand-primary/5 last:border-0 group">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-brand-primary/5 bg-brand-primary/2 shrink-0">
                         {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} /> : <Icon icon="solar:camera-bold-duotone" className="w-8 h-8 text-brand-primary/10" />}
                      </div>
                      <div>
                         <h4 className="text-base font-serif font-bold text-brand-primary">{item.name}</h4>
                         <p className="text-[10px] text-brand-primary/30 uppercase font-bold tracking-widest mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-[#fcfbf7] border border-brand-primary/5 rounded-xl px-3 py-1 text-[11px] font-bold text-brand-primary">
                         Qty: {item.quantity}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-500/40 hover:text-rose-500 transition-colors">
                         <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-primary p-6 lg:p-8 rounded-[32px] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1">Estimated Valuation</p>
                   <p className="text-2xl font-serif font-bold text-white italic">₹{totalPrice.toLocaleString()}</p>
                </div>
                <button onClick={() => router.push('/cart')} className="w-full sm:w-auto px-10 py-4 bg-brand-secondary text-white font-bold rounded-2xl uppercase tracking-widest text-[11px] shadow-lg hover:-translate-y-1 transition-all">
                   Finalize Registry
                </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
