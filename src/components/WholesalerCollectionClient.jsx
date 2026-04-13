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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 lg:mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-brand-secondary/10 px-4 py-1.5 rounded-full border border-brand-secondary/20"
            >
              <div className="rotate-45">
                 <Icon icon={type === 'offers' ? "solar:tag-bold-duotone" : "solar:box-minimalistic-bold-duotone"} className="w-3.5 h-3.5 text-brand-secondary" />
              </div>
              <span className="text-brand-secondary text-[8px] font-bold uppercase tracking-widest">{subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-7xl font-serif font-black text-brand-primary uppercase tracking-tighter leading-none"
            >
              {title}
            </motion.h1>
          </div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-brand-primary/5"
          >
             <div className="text-right">
                <p className="text-[9px] font-bold text-brand-primary/30 uppercase tracking-widest">Available Collection</p>
                <p className="text-xl font-serif font-bold text-brand-primary">{products.length} Products</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                <Icon icon="solar:shop-bold-duotone" className="w-6 h-6" />
             </div>
          </motion.div>
        </div>

        {/* Product Grid */}
        {/* Liked Products Section */}
        {likedProducts.length > 0 && (
          <div className="mb-4 lg:mb-6">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-4 mb-4 lg:mb-6"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-[24px] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                <Icon icon="solar:heart-bold" className="w-6 h-10 lg:w-8 lg:h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-4xl font-serif font-black text-brand-primary uppercase tracking-tighter">Your Choice</h2>
                <p className="text-[9px] lg:text-[11px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Ready for your selection</p>
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
              className="mt-4 lg:mt-8 h-px bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent"
            />
          </div>
        )}

        {/* Main Product Grid */}
        {otherProducts.length > 0 && likedProducts.length > 0 && (
           <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 lg:mb-6"
           >
              <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary uppercase tracking-widest">More from {title}</h2>
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
            <div className="col-span-full py-32 lg:py-48 bg-white/40 rounded-[40px] border border-dashed border-brand-primary/10 flex flex-col items-center justify-center text-center space-y-6 text-left">
               <div className="w-20 h-20 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary/20">
                  <Icon icon="solar:ghost-bold-duotone" className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-brand-primary/40 uppercase tracking-widest">The Vault is Empty</h3>
                  <p className="text-[10px] lg:text-xs text-brand-primary/20 font-bold uppercase tracking-[0.3em]">Check back soon for new treasures</p>
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
