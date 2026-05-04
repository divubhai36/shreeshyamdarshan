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
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <main className="pt-20 lg:pt-24">
        {/* Simple Page Header */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.4em]">{subtitle}</span>
            <h1 className="text-3xl lg:text-6xl font-serif font-black text-brand-primary uppercase tracking-tighter leading-none">{title}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* 'YOUR SELECTION' - Standard 2-Column Grid */}
          <AnimatePresence>
            {likedProducts.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Icon icon="solar:heart-bold" className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest italic leading-none">Your Selection</p>
                    <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">{likedProducts.length} Personal Registry Items</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
                  {likedProducts.map((product, idx) => (
                    <motion.div
                      key={`liked-${product.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <div className="h-px w-10 bg-brand-primary/10" />
                  <span className="flex-shrink-0 text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.5em]">Explore Collection</span>
                  <div className="h-px flex-grow bg-brand-primary/10" />
                </div>
              </section>
            )}
          </AnimatePresence>

          {/* Main Collection Grid */}
          <section className="mt-8 lg:mt-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
              {(likedProducts.length > 0 ? otherProducts : products).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-28 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] rounded-full scale-150" />
                  <Icon icon="solar:box-minimalistic-bold-duotone" className="h-20 w-20 lg:h-32 lg:w-32 text-brand-primary/10 relative z-10" />
                </div>
                <h3 className="text-xl lg:text-3xl font-serif font-bold text-brand-primary uppercase tracking-[0.1em] mb-4 max-w-xs">Collection Updating Soon</h3>
                <p className="text-[10px] lg:text-xs font-bold text-brand-primary/30 uppercase tracking-[0.1em] max-w-md leading-relaxed">
                  Our artisans are currently curating new excellence for this collection. Please revisit soon.
                </p>
                <button
                  onClick={() => router.push('/wholesalers/dashboard')}
                  className="mt-8 px-10 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-secondary transition-all shadow-xl active:scale-95"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
