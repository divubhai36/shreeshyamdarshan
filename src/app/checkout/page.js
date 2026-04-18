"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';


export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [cart, orderSuccess, router]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/user/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cart.map(item => ({ 
            id: item.id, 
            quantity: item.quantity, 
            price: item.price,
            variantName: item.variantName
          })),
          totalAmount: cartTotal
        })
      });
      const res = await resp.json();

      if (resp.ok) {
        setOrderInfo(res.order);
        setOrderSuccess(true);
        
        // TRIGGER WHATSAPP MESSAGE
        const phone = "917383699199";
        const itemsList = cart.map(item => {
          const unitLabel = item.unit?.toUpperCase() === "DOZEN" ? "Doz" : "Pcs";
          return `- *[${item.productId || 'N/A'}]* ${item.name}${item.variantName ? ' (' + item.variantName + ')' : ''}: ${item.quantity} ${unitLabel} x ₹${item.price.toLocaleString()}`;
        }).join('\n');
        const text = `Hi, *Shree Shyam Darshan Team*\n\nNew SSD Order Registered!\n*Order ID:* #${res.order.orderNumber}\n*Total Valuation:* ₹${cartTotal.toLocaleString()}\n\n*Product List:*\n${itemsList}\n\n*Wholesaler:* ${res.order.wholesaler.name}\n------------------\nPlease authorize this registry for dispatch.`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
        
        clearCart();
        toast.success("Order Registered Successfully!");
      } else {
        toast.error(`Registry failed: ${res.error}`);
      }
    } catch (e) {
      toast.error("Network Error");
    }

    setLoading(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white max-w-lg w-full rounded-[48px] p-10 lg:p-14 text-center shadow-2xl border border-white/20"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_15px_35px_rgba(34,197,94,0.3)]">
             <Icon icon="solar:check-circle-bold" className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-primary mb-2">Order Registered</h2>
          <p className="text-sm text-brand-primary/40 mb-10 font-bold uppercase tracking-[0.2em]">SSD Partner Registry ID: #{orderInfo?.orderNumber}</p>
          
          <div className="bg-brand-accent/30 p-6 rounded-[32px] mb-10 text-left border border-brand-primary/5">
             <p className="text-xs text-brand-primary/60 italic leading-relaxed text-center">Your fulfillment request has been securely logged. Our concierge team will authorize this procurement shortly.</p>
          </div>

          <div className="flex flex-col gap-4">
             <button onClick={() => router.push('/my-account')} className="w-full bg-brand-primary text-white py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">My Account Dashboard</button>
             <button onClick={() => router.push('/')} className="text-sm font-serif italic text-brand-primary/40 hover:text-brand-secondary transition-colors underline decoration-2 underline-offset-8">Continue Curating</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-accent/20">
      
      <main className="container mx-auto px-4 lg:px-8 pt-28 lg:pt-36 pb-20 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary uppercase tracking-tight">Checkout Authorization</h1>
            <p className="text-[10px] font-bold text-brand-secondary tracking-[0.5em] uppercase mt-4">SSD B2B Partner Portal</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Review */}
            <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-xl border border-brand-primary/5">
               <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-8 ml-1">Registry Review</h3>
               <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-brand-primary/5 pb-6 last:border-0 last:pb-0">
                      <div className="w-16 h-20 bg-brand-accent rounded-xl overflow-hidden border border-brand-primary/10">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-brand-primary text-sm line-clamp-1">{item.name}</p>
                        {item.variantName && <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-widest">{item.variantName}</p>}
                        <p className="text-[10px] text-brand-primary/40 uppercase font-bold tracking-widest mt-1">{item.quantity} units</p>
                        <p className="text-xs font-serif font-bold text-brand-secondary mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right: Payment/Confirmation */}
            <div className="flex flex-col justify-between">
               <div className="bg-brand-primary p-10 lg:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-[#0f2a20] to-brand-primary opacity-50" />
                  <div className="relative z-10">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-6">Partner Valuation</h3>
                    <div className="flex justify-between items-end mb-8">
                       <span className="text-sm font-serif italic text-white/60">Total Procurements:</span>
                       <span className="text-4xl font-serif font-bold">{cartTotal.toLocaleString()} INR</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
                       <div className="flex items-start gap-4">
                          <Icon icon="solar:shield-check-bold" className="text-brand-secondary w-5 h-5 shrink-0" />
                          <p className="text-[11px] leading-relaxed font-medium text-white/70 italic">Payment will be settled post-authorization according to your B2B partnership agreement.</p>
                       </div>
                    </div>

                    <button 
                      disabled={loading}
                      onClick={handlePlaceOrder}
                      className="w-full bg-brand-secondary text-white py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-brand-primary transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Icon icon="line-md:loading-loop" className="w-5 h-5" /> : "Authorize Order"}
                    </button>
                    
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.2em] text-center mt-6">Secure Partner Transaction</p>
                  </div>
               </div>

               <Link href="/cart" className="flex items-center justify-center gap-2 mt-8 text-brand-primary/40 hover:text-brand-secondary transition-colors text-[10px] font-bold uppercase tracking-widest group">
                  <Icon icon="lucide:arrow-left" className="group-hover:-translate-x-1 transition-transform" /> Back to Registry
               </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
