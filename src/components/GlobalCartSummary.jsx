"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import CartSummaryPill from './CartSummaryPill';

export default function GlobalCartSummary() {
  const { cartCount, isAuthenticated } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  // Hide on specifically excluded pages
  const isCartPage = pathname === '/wholesalers/dashboard/cart';
  const isAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // Only show for authenticated wholesalers with items in cart, and NOT on the cart page (Cart page uses it locally)
  if (!isAuthenticated || cartCount === 0 || isCartPage || isAdmin || isLoginPage) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 sm:bottom-5 left-0 right-0 sm:right-5 z-[100] px-0 pointer-events-none flex justify-center sm:justify-end">
        <div className="w-full sm:w-auto pointer-events-auto">
          <div className="hidden sm:block">
            <CartSummaryPill onClick={() => router.push('/wholesalers/dashboard/cart')} />
          </div>
          <div className="sm:hidden">
            <CartSummaryPill
              onClick={() => router.push('/wholesalers/dashboard/cart')}
              isFullWidth={true}
            />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
