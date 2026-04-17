"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function WholesalerCollectionClient({ title, subtitle, products, type }) {
  const router = useRouter();
  const { saved } = useCart();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const hasUserSession = cookies.some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
    const storedUser = localStorage.getItem('ssd_user');

    if (!hasUserSession && !storedUser) {
      router.push(`/login?callbackUrl=/wholesalers/dashboard/collection/${type}`);
      return;
    }
    setIsLogged(true);
    window.scrollTo(0, 0);
  }, [type, router]);

  if (!isLogged) return null;

  const likedProducts = products.filter(p => saved.some(s => s.id === p.id));
  const otherProducts = products.filter(p => !saved.some(s => s.id === p.id));

  return (
    <div className="min-h-screen bg-brand-accent/30 relative text-left">
      <main className="pt-24 lg:pt-36 pb-20 container mx-auto px-4 lg:px-8 max-w-7xl text-left">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[8px] lg:text-[10px] font-bold tracking-widest text-brand-primary/30 uppercase mb-6 text-left">
          <Link href="/" className="hover:text-brand-secondary transition-colors">Home</Link>
          <span className="text-brand-primary/10">/</span>
          <Link href="/wholesalers/dashboard" className="hover:text-brand-secondary transition-colors text-brand-primary/40">Dashboard</Link>
          <span className="text-brand-primary/10">/</span>
          <span className="text-brand-secondary">{title}</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-4 lg:mb-8">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-brand-secondary/5 px-3 py-1 rounded-full border border-brand-secondary/10"
            >
              <Icon icon={type === 'offers' ? "solar:tag-bold-duotone" : "solar:box-minimalistic-bold-duotone"} className="w-3 h-3 text-brand-secondary" />
              <span className="text-brand-secondary text-[7px] lg:text-[8px] font-black uppercase tracking-[0.2em]">{subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg lg:text-5xl font-serif font-black text-brand-primary uppercase tracking-tighter leading-[0.85] lg:leading-none"
            >
              {title}
            </motion.h1>
          </div>
        </div>

        {/* Product Grid */}
        {/* Liked Products Section */}
        {likedProducts.length > 0 && (
          <div className="mb-10 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6 lg:mb-10"
            >
              <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-[18px] lg:rounded-[24px] bg-rose-500/5 flex items-center justify-center text-rose-500/40 border border-rose-500/10">
                <Icon icon="solar:heart-bold" className="w-5 h-5 lg:w-8 lg:h-8" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl lg:text-4xl font-serif font-black text-brand-primary uppercase tracking-tighter leading-none">Your Selection</h2>
                <p className="text-[8px] lg:text-[10px] font-bold text-brand-primary/20 uppercase tracking-[0.3em]">Personalized Registry Items</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
              {likedProducts.map((product, idx) => (
                <motion.div
                  key={`liked-${product.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="mt-8 lg:mt-16 h-px bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent"
            />
          </div>
        )}

        {/* Main Product Grid */}
        {otherProducts.length > 0 && likedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 lg:mb-10"
          >
            <h2 className="text-[10px] lg:text-sm font-black text-brand-primary/30 uppercase tracking-[0.4em]">Extended Collection</h2>
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
          {products.length > 0 ? (
            (likedProducts.length > 0 ? otherProducts : products).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 lg:py-48 bg-white/40 backdrop-blur-sm rounded-[48px] border border-dashed border-brand-primary/10 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden group/empty">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl opacity-50 transition-all duration-700 group-hover/empty:scale-150" />
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[32px] bg-brand-primary/[0.03] flex items-center justify-center text-brand-primary/20 mb-8 border border-brand-primary/[0.03] transition-transform duration-700 group-hover/empty:rotate-12">
                <Icon icon="solar:ghost-bold-duotone" className="w-10 h-10 lg:w-12 lg:h-12 grayscale " />
              </div>
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-serif font-black text-brand-primary/70 uppercase tracking-tighter leading-none">The Vault is Empty</h3>
                <p className="text-[11px] lg:text-xs text-brand-primary/20 font-bold uppercase tracking-[0.3em] max-w-[200px] lg:max-w-[400px] mx-auto leading-relaxed">Patience is a virtue. We are currently curating new treasures for your registry.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
}
