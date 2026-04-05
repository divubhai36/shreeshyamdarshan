"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function SavedPage() {
  const { saved = [], toggleSave, addToCart, isAuthenticated, isLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    const isLogged = document.cookie.split(';').some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
    if (!isLogged && !localStorage.getItem('ssd_user')) {
        router.push('/login?callbackUrl=/wholesalers/dashboard/saved');
        return;
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] selection:bg-brand-secondary/20">
      <main className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-36 pb-20 max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.push('/wholesalers/dashboard')}
              className="flex items-center gap-2 text-brand-primary/40 hover:text-brand-primary transition-colors mb-4 group"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Dashboard</span>
            </button>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary">Saved Products</h1>
            <p className="text-[10px] font-bold text-brand-secondary tracking-[0.3em] uppercase mt-2">Your Curated B2B Registry</p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border border-brand-primary/5 shadow-sm flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold">
                {saved.length}
             </div>
             <div>
                <p className="text-[8px] font-bold text-brand-primary/30 uppercase tracking-widest">Total Saved</p>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-tight">Masterpieces</p>
             </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[40px] aspect-square animate-pulse border border-brand-primary/5" />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[48px] p-20 text-center border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                <Icon icon="solar:heart-bold" className="w-64 h-64" />
             </div>

             <div className="relative z-10">
                <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Icon icon="solar:heart-add-bold-duotone" className="w-12 h-12 text-brand-primary/20" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Your registry is empty</h2>
                <p className="text-sm text-brand-primary/40 mb-10 max-w-md mx-auto leading-relaxed">
                   Explore our divine collection and curate the pieces that define your elite inventory. Save them here for quick procurement and registry management.
                </p>
                <Link href="/" className="inline-flex items-center gap-4 bg-brand-primary text-white px-12 py-5 rounded-[24px] text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-brand-secondary transition-all shadow-xl hover:translate-y-[-4px] active:scale-95 group">
                   <span>Explore Divine Boutique</span>
                   <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
               {saved.map((product) => (
                 <motion.div
                   layout
                   variants={itemVariants}
                   exit={{ opacity: 0, scale: 0.8 }}
                   key={product.id}
                   className="bg-white rounded-[40px] overflow-hidden border border-brand-primary/5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative flex flex-col"
                 >
                    {/* Floating Remove Button */}
                    <button
                      onClick={() => toggleSave(product)}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/80 backdrop-blur-md shadow-xl rounded-full z-20 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-90 transition-all border border-white/20"
                    >
                      <Icon icon="solar:heart-bold" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                    </button>

                    <Link href={`/product/${product.id}`} className="aspect-square block overflow-hidden bg-brand-accent/30 relative">
                       <img
                        src={product.image || product.images?.[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        alt={product.name}
                       />
                       <div className="absolute inset-0 bg-linear-to-t from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <div className="p-8 grow flex flex-col">
                       <div className="mb-4">
                          <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-[0.2em] mb-2">{product.category}</p>
                          <h3 className="text-xl font-serif font-bold text-brand-primary line-clamp-2 leading-tight group-hover:text-brand-secondary transition-colors">{product.name}</h3>
                       </div>

                       <div className="mt-auto pt-6 border-t border-brand-primary/5 flex items-center justify-between gap-4">
                          <div className="text-left">
                             <p className="text-[8px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1 italic font-serif">Procurement Price</p>
                             <p className="text-xl font-serif font-bold text-brand-primary">₹{product.price?.toLocaleString()}</p>
                          </div>

                          {isAuthenticated && (
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-brand-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-all active:scale-90 group"
                              title="Add to Registry"
                            >
                              <Icon icon="solar:cart-plus-bold" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[10%] right-[-5%] w-[40%] aspect-square bg-brand-secondary/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[5%] left-[-5%] w-[30%] aspect-square bg-brand-primary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
