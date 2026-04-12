"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
   PENDING: "bg-amber-50 text-amber-600 border-amber-200",
   APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
   DISPATCHED: "bg-indigo-50 text-indigo-600 border-indigo-200",
   COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
   CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function OrdersPage() {
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [activeOrder, setActiveOrder] = useState(null);
   const router = useRouter();

   useEffect(() => {
      const isLogged = document.cookie.split(';').some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
      if (!isLogged && !localStorage.getItem('ssd_user')) {
         router.push('/login?callbackUrl=/wholesalers/dashboard/orders');
         return;
      }
      loadOrders();
   }, []);

   const loadOrders = async () => {
      try {
         const res = await fetch("/api/user/orders");
         const dt = await res.json();
         if (dt.success) setOrders(dt.orders);
      } catch (e) { console.error("Failed to load orders"); }
      setLoading(false);
   };

   return (
      <div className="min-h-screen bg-[#fcfbf7]">
         <main className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-36 pb-12 max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => router.push('/wholesalers/dashboard')} className="p-3 bg-white rounded-2xl border border-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center gap-2 group">
                     <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                     <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Back</span>
                  </button>
                  <h2 className="text-3xl font-serif font-bold text-brand-primary">Order History</h2>
               </div>
            </div>

            {loading ? (
               <div className="py-24 text-center">
                  <div className="relative inline-block">
                     <Icon icon="solar:globus-outline" className="w-16 h-16 text-brand-primary/5 animate-spin-slow" />
                     <Icon icon="solar:bill-list-bold-duotone" className="w-8 h-8 text-brand-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 mt-6 animate-pulse">Syncing Records...</p>
               </div>
            ) : orders.length === 0 ? (
               <div className="bg-white p-12 sm:p-20 rounded-[48px] text-center border border-brand-primary/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Icon icon="solar:document-text-bold-duotone" className="w-40 h-40" />
                  </div>
                  <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                     <Icon icon="solar:clipboard-check-bold-duotone" className="w-12 h-12 text-brand-primary/20" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">No Logs Found</h3>
                  <p className="text-sm text-brand-primary/40 mt-4 leading-relaxed max-w-xs mx-auto">You haven't initiated any procurements yet. Explore our vault to begin your registry.</p>
                  <button
                     onClick={() => router.push('/wholesalers/dashboard')}
                     className="mt-10 bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-secondary transition-all"
                  >
                     Explore Vault
                  </button>
               </div>
            ) : (
               <div className="space-y-6">
                  {orders.map((order) => {
                     const originalTotal = order.items.reduce((acc, it) => acc + (it.originalPrice || it.price) * it.quantity, 0);
                     const savings = originalTotal - order.totalAmount;

                     return (
                        <div key={order.id} className="bg-white rounded-[40px] border border-brand-primary/5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
                           <div
                              className="p-6 sm:p-8 cursor-pointer group"
                              onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
                           >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                                       <Icon icon="solar:bag-heart-bold-duotone" className="w-8 h-8 sm:w-10 sm:h-10" />
                                    </div>
                                    <div className="min-w-0">
                                       <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                          <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[order.status]}`}>
                                             {order.status}
                                          </span>
                                          <span className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">#{order.orderNumber}</span>
                                       </div>

                                       <div className="flex flex-row items-start gap-2">
                                          <p className="text-xl sm:text-2xl font-black text-brand-primary leading-none">₹{(order.totalAmount || 0).toLocaleString()}</p>
                                          {savings > 0 && (
                                             <p className="text-base sm:text-lg font-bold text-brand-primary/20 line-through mb-0.5 tracking-tight">₹{originalTotal.toLocaleString()}</p>
                                          )}
                                       </div>
                                       <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mt-3">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-6 sm:pt-0 border-t sm:border-t-0 border-brand-primary/5">
                                    <div className="text-right flex flex-col items-end">
                                       <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-widest mb-1">Total Units</p>
                                       <p className="text-xl sm:text-2xl font-bold text-brand-primary leading-none">{order.items.reduce((acc, it) => acc + it.quantity, 0)} <span className="text-xs sm:text-sm not-italic opacity-40 lowercase">units</span></p>
                                    </div>
                                    <div className={`p-4 rounded-2xl bg-brand-primary/5 text-brand-primary transition-all ${activeOrder === order.id ? 'rotate-180 bg-brand-secondary text-white' : ''}`}>
                                       <Icon icon="solar:alt-arrow-down-bold" className="w-5 h-5" />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <AnimatePresence>
                              {activeOrder === order.id && (
                                 <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-[#fcfbf7]/50"
                                 >
                                    <div className="px-6 sm:px-10 py-10 space-y-4 border-t border-brand-primary/5">
                                       <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.3em] mb-6">Products List</p>
                                       {order.items.map((it, i) => (
                                          <div key={i} className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-brand-primary/5 shadow-sm group/item">
                                             <div className="w-16 h-20 bg-brand-accent/30 rounded-2xl overflow-hidden shrink-0">
                                                {it.product?.images?.[0] ? (
                                                   <img src={it.product.images[0]} alt={it.product.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                                                ) : (
                                                   <div className="w-full h-full flex items-center justify-center">
                                                      <Icon icon="solar:box-minimalistic-bold-duotone" className="w-8 h-8 text-brand-primary/20" />
                                                   </div>
                                                )}
                                             </div>
                                             <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                   <h5 className="font-bold text-brand-primary text-sm sm:text-base line-clamp-1">{it.product?.name}</h5>
                                                   <span className="text-[10px] font-black text-brand-primary/40 uppercase ml-4">× {it.quantity}</span>
                                                </div>
                                                {it.variantName && (
                                                   <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{it.variantName}</p>
                                                )}
                                                <div className="flex items-baseline gap-2">
                                                   <span className="text-lg font-black text-brand-primary tracking-tight">₹{it.price.toLocaleString()}</span>
                                                   {it.originalPrice && it.originalPrice > it.price && (
                                                      <span className="text-sm font-bold text-brand-primary/20 line-through tracking-wider">₹{it.originalPrice.toLocaleString()}</span>
                                                   )}
                                                </div>
                                             </div>
                                          </div>
                                       ))}

                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     );
                  })}
               </div>
            )}
         </main>

      </div>
   );
}
