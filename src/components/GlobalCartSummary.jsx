"use client";
import React from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';

export default function GlobalCartSummary() {
  const { cartCount, cartTotal, originalCartTotal, isAuthenticated } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  // Hide on specifically excluded pages
  const isCartPage = pathname === '/wholesalers/dashboard/cart';
  const isAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // Only show for authenticated wholesalers with items in cart, and not on the cart page itself
  if (!isAuthenticated || cartCount === 0 || isCartPage || isAdmin || isLoginPage) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="container mx-auto max-w-lg bg-white/90 p-4 sm:p-4 rounded-[28px] sm:rounded-4xl border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4 pointer-events-auto backdrop-blur-md"
        >
          <div className="flex items-center gap-3 sm:gap-6 border-r border-brand-primary/5 pr-4 sm:pr-8 min-w-0">
            <div className="hidden sm:block">
              <p className="text-[7px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1">Items</p>
              <p className="text-lg font-bold text-brand-primary">{cartCount}</p>
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold text-brand-primary/80 uppercase tracking-widest mb-1 opacity-60">Total Amount</p>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-3xl font-bold text-brand-primary tracking-tighter">₹{(cartTotal || 0).toLocaleString()}</p>
                {originalCartTotal > cartTotal && (
                  <span className="text-sm sm:text-lg font-bold text-brand-primary/20 line-through decoration-brand-primary/30 leading-none">₹{originalCartTotal.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-grow min-w-0 hidden xs:block">
            {originalCartTotal > cartTotal && (
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-[0.1em]">
                    Partner Benefit
                  </span>
                  <span className="text-[10px] font-black text-brand-secondary italic">
                    {Math.round((originalCartTotal - cartTotal) / originalCartTotal * 100)}% Off
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-brand-primary/70">
                  Total Savings: <span className="text-green-600">₹{(originalCartTotal - cartTotal).toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push('/wholesalers/dashboard/cart')}
            className="shrink-0 sm:px-8 px-5 py-4 sm:py-5 bg-brand-secondary text-white font-bold rounded-2xl sm:rounded-3xl uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 group cursor-pointer"
          >
            <Icon icon="material-symbols:shopping-cart-checkout-rounded" className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="inline">Checkout</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
