"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-brand-accent/20">
      
      <main className="container mx-auto px-4 lg:px-8 pt-28 lg:pt-36 pb-20 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary">Shopping Registry</h1>
          <p className="text-[10px] font-bold text-brand-secondary tracking-[0.3em] uppercase mt-2">B2B Wholesale Fulfillment</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-brand-primary/5 shadow-xl">
             <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="solar:cart-large-2-linear" className="w-10 h-10 text-brand-primary/20" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Your registry is empty</h2>
             <p className="text-sm text-brand-primary/40 mb-8 max-w-sm mx-auto">Discover our latest divine collections and curate your wholesale order.</p>
             <Link href="/" className="inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-xl">
                Start Curating
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id + (item.variantName || '')} 
                    className="bg-white p-4 lg:p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-24 h-28 shrink-0 rounded-2xl overflow-hidden bg-brand-accent border border-brand-primary/5">
                       <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                       <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-widest mb-1">{item.category}</p>
                       <h3 className="text-lg lg:text-xl font-serif font-bold text-brand-primary leading-tight">{item.name}</h3>
                       {item.variantName && (
                         <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.variantName}</span>
                         </div>
                       )}
                       <p className="text-sm font-bold text-brand-primary/40 mt-1 uppercase tracking-widest">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-brand-accent/50 p-2 rounded-2xl border border-brand-primary/5">
                       <button 
                        onClick={() => updateQuantity(item.id, item.variantName, item.quantity - 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                       >
                          <Icon icon="lucide:minus" className="w-4 h-4" />
                       </button>
                       <span className="w-10 text-center font-bold font-serif text-brand-primary">{item.quantity}</span>
                       <button 
                        onClick={() => updateQuantity(item.id, item.variantName, item.quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                       >
                          <Icon icon="lucide:plus" className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                       <p className="text-[9px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1">Subtotal</p>
                       <p className="text-xl font-serif font-bold text-brand-primary tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.variantName)}
                      className="p-3 text-brand-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-36">
              <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-brand-primary/5 shadow-xl">
                 <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary mb-8 border-b border-brand-primary/5 pb-4">Order Summary</h2>
                 
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">
                       <span>Registry Units</span>
                       <span>{cartCount} Pcs</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">
                       <span>Partner Valuation</span>
                       <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="h-[1px] bg-brand-primary/5 my-4" />
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Grand Total</span>
                       <span className="text-3xl font-serif font-bold text-brand-primary tracking-tight">₹{cartTotal.toLocaleString()}</span>
                    </div>
                 </div>

                 <Link 
                  href="/checkout"
                  className="w-full bg-brand-primary text-white py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-secondary hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl"
                 >
                    <Icon icon="solar:shield-check-bold" className="w-5 h-5" />
                    Proceed to Checkout
                 </Link>
                 
                 <p className="text-[8px] text-brand-primary/30 font-bold uppercase tracking-[0.2em] text-center mt-6">
                    Partner fulfillment status: Active
                 </p>
              </div>
              
              <div className="mt-6 p-6 bg-brand-secondary/5 rounded-[32px] border border-brand-secondary/10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-secondary/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon icon="solar:history-bold-duotone" className="text-brand-secondary w-5 h-5" />
                 </div>
                 <p className="text-[9px] font-bold text-brand-primary/60 uppercase tracking-widest leading-relaxed">
                    View your <Link href="/my-account" className="text-brand-secondary underline decoration-2 underline-offset-4">Order History</Link> for past procurements.
                 </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
