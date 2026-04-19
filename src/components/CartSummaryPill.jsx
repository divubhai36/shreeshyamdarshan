"use client";
import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function CartSummaryPill({ onClick, isProcessing = false, isFullWidth = false }) {
  const { cartCount, productCount, cartTotal, originalCartTotal } = useCart();
  const pathname = usePathname();
  const isCartPage = pathname === '/wholesalers/dashboard/cart';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      whileHover={!isFullWidth ? { scale: 1.01 } : {}}
      whileTap={!isFullWidth ? { scale: 0.98 } : {}}
      onClick={!isProcessing ? onClick : undefined}
      className={`${isFullWidth ? 'w-full rounded-none border-x-0' : 'w-full sm:w-auto rounded-[24px] sm:rounded-[32px] border'} bg-white/95 p-4 sm:p-5 border-brand-primary/10 shadow-[0_-10px_40px_rgba(0,0,0,0.04),0_20px_50px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4 pointer-events-auto backdrop-blur-md cursor-pointer group`}
    >
      <div className="min-w-0 flex-grow">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-xl sm:text-2xl font-bold text-brand-primary tracking-tighter">₹{(cartTotal || 0).toLocaleString()}</p>
          {originalCartTotal > cartTotal && (
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-lg font-bold text-brand-primary/20 line-through decoration-brand-primary/30">₹{originalCartTotal.toLocaleString()}</span>
              {isCartPage && (
                <span className="hidden xs:inline-block text-[8px] sm:text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-widest whitespace-nowrap">
                  Saved ₹{(originalCartTotal - cartTotal).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em] leading-none">
          <span>{productCount} Items</span>
          <span className="opacity-30">•</span>
          <span>{cartCount} Units</span>
        </div>
      </div>

      <div
        className={`shrink-0 h-12 sm:h-16 px-6 sm:px-10 bg-brand-primary text-white font-bold rounded-2xl sm:rounded-[24px] uppercase tracking-[0.2em] text-[10px] sm:text-[12px] shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-brand-secondary ${isProcessing ? 'opacity-50 grayscale' : ''}`}
      >
        {isProcessing ? (
          <Icon icon="line-md:loading-loop" className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Icon icon="material-symbols:shopping-cart-checkout-rounded" className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
        <span className="inline">{isProcessing ? "Wait..." : "Checkout"}</span>
      </div>
    </motion.div>
  );
}
