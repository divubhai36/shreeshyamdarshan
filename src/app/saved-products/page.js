"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedProductsPage() {
  const { saved = [], toggleSave, addToCart, isAuthenticated } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] selection:bg-brand-secondary/20">
      
      <main className="container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-brand-secondary"></div>
                <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.4em]">Curated Registry</span>
             </div>
             <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-primary leading-tight">Masterpiece <span className="italic font-normal text-brand-secondary">Collection</span></h1>
             <p className="text-sm text-brand-primary/40 mt-6 leading-relaxed">
                Discover your personal sanctuary of divine poshaks. Heart the pieces you wish to curate for your upcoming ceremonies or elite inventory.
             </p>
          </div>

          <div className="bg-white px-8 py-4 rounded-[32px] border border-brand-primary/5 shadow-xl shadow-brand-primary/2 flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-serif text-xl font-bold italic">
                {saved.length}
             </div>
             <div>
                <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-[0.2em] mb-0.5">Selection</p>
                <p className="text-sm font-bold text-brand-primary uppercase tracking-tight">Saved Items</p>
             </div>
          </div>
        </div>

        {saved.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[60px] p-24 text-center border border-brand-primary/5 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[#fcfbf7]/50 -z-10" />
             <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Icon icon="solar:heart-bold-duotone" className="w-12 h-12 text-brand-primary/20" />
             </div>
             <h2 className="text-4xl font-serif font-bold text-brand-primary mb-6">Your heart is seeking...</h2>
             <p className="text-lg text-brand-primary/40 mb-12 max-w-md mx-auto leading-relaxed italic font-serif">
                "Wait no longer to capture the essence of divinity. Explore our collections and find the soul of your next masterpiece."
             </p>
             <Link href="/" className="inline-flex items-center gap-4 bg-brand-primary text-white px-14 py-6 rounded-[24px] text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-brand-secondary transition-all shadow-2xl hover:translate-y-[-5px] group">
                <span>Discover Collections</span>
                <Icon icon="solar:round-alt-arrow-right-bold" className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12"
          >
            <AnimatePresence mode="popLayout">
               {saved.map((product) => (
                 <motion.div 
                   layout
                   variants={itemVariants}
                   exit={{ opacity: 0, scale: 0.8 }}
                   key={product.id} 
                   className="group relative h-full flex flex-col"
                 >
                    {/* Image Container */}
                    <div className="relative aspect-4/5 rounded-[48px] overflow-hidden bg-brand-accent shadow-sm hover:shadow-2xl transition-all duration-700">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        <img 
                          src={product.image || product.images?.[0]} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          alt={product.name}
                        />
                      </Link>
                      
                      {/* Glass remove button */}
                      <button 
                        onClick={() => toggleSave(product)}
                        className="absolute top-6 right-6 w-14 h-14 bg-white/40 backdrop-blur-xl border border-white/20 rounded-full z-20 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-90 transition-all shadow-xl"
                      >
                        <Icon icon="solar:heart-bold" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                      </button>

                      {/* Floating Info Overlay (Visible on Hover) */}
                      <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                         <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] border border-white/20 shadow-2xl">
                            <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em] mb-1">{product.category}</p>
                            <h3 className="text-base font-serif font-bold text-brand-primary truncate">{product.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                               <p className="text-lg font-serif font-bold text-brand-primary">₹{product.price?.toLocaleString()}</p>
                               {isAuthenticated && (
                                 <button 
                                  onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                  className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-all active:scale-90"
                                 >
                                    <Icon icon="solar:cart-plus-bold" className="w-5 h-5" />
                                 </button>
                               )}
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Simple Bottom Label (Always visible) */}
                    <div className="mt-6 px-4 group-hover:opacity-0 transition-opacity duration-300">
                       <p className="text-[9px] font-bold text-brand-secondary/60 uppercase tracking-[0.3em] mb-2">{product.category}</p>
                       <h3 className="text-xl font-serif font-bold text-brand-primary truncate">{product.name}</h3>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

       {/* Decorative Elements */}
       <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute top-[60%] -left-24 w-[30vw] aspect-square bg-brand-primary/5 rounded-full blur-[120px]" />
       </div>
    </div>
  );
}
