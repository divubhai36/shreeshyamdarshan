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
               <div className="space-y-4">
                  {orders.map((order) => {
                     const originalTotal = order.items.reduce((acc, it) => acc + (it.originalPrice || it.price) * it.quantity, 0);
                     const savings = originalTotal - order.totalAmount;
                     const totalUnits = order.items.reduce((acc, it) => acc + it.quantity, 0);

                     const STATUS_DOTS = {
                        PENDING: "bg-amber-500",
                        APPROVED: "bg-blue-500",
                        DISPATCHED: "bg-indigo-500",
                        COMPLETED: "bg-emerald-500",
                        CANCELLED: "bg-rose-500",
                     };

                     return (
                        <div key={order.id} className="bg-white rounded-[32px] border border-brand-primary/5 shadow-sm active:scale-[0.98] transition-all duration-300 mb-4">
                           <div
                              className="p-5 sm:p-6 cursor-pointer"
                              onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
                           >
                              <div className="flex flex-col gap-5">
                                 {/* Top Row: Meta Info */}
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${STATUS_DOTS[order.status]}`} />
                                       <span className="text-[11px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">#{order.orderNumber}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${STATUS_COLORS[order.status]}`}>
                                       {order.status}
                                    </span>
                                 </div>

                                 {/* Middle Area: Valuation */}
                                 <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                       <p className="text-2xl font-black text-brand-primary tracking-tighter leading-none">
                                          ₹{(order.totalAmount || 0).toLocaleString()}
                                       </p>
                                       {savings > 0 ? (
                                          <div className="flex items-center gap-2">
                                             <span className="text-xs lg:text-lg font-bold text-brand-secondary/70 line-through">₹{originalTotal.toLocaleString()}</span>
                                             <span className="text-[10px] font-bold text-emerald-600 italic">Saved ₹{savings.toLocaleString()}</span>
                                          </div>
                                       ) : (
                                          <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest italic font-serif">Procurement Value</p>
                                       )}
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest leading-none mb-1">{totalUnits} Units</p>
                                          <p className="text-[8px] font-bold text-brand-primary/20 uppercase tracking-widest leading-none">{order.items.length} Products</p>
                                       </div>
                                       <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${activeOrder === order.id ? 'bg-brand-secondary text-white rotate-180 shadow-lg shadow-brand-secondary/20' : 'bg-brand-primary/5 text-brand-primary'}`}>
                                          <Icon icon="solar:alt-arrow-down-outline" className="w-4 h-4" />
                                       </div>
                                    </div>
                                 </div>

                                 {/* Footer: Date Stamp */}
                                 <div className="pt-4 border-t border-brand-primary/[0.03] flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.25em]">
                                       {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                    <Icon icon="solar:calendar-minimalistic-bold-duotone" className="w-3.5 h-3.5 text-brand-primary/10" />
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
                                    <div className="px-6 sm:px-10 py-8 space-y-2 border-t border-brand-primary/5">
                                       <p className="text-[9px] font-black text-brand-primary/40 uppercase tracking-[0.3em] mb-4">Order Items</p>
                                       {order.items.map((it, i) => (
                                          <div key={i} className="flex items-center gap-3 py-3 border-b border-brand-primary/[0.03] last:border-0 group/item">
                                             <div className="w-10 h-10 bg-brand-primary/5 rounded-lg overflow-hidden shrink-0 border border-brand-primary/5">
                                                {it.product?.images?.[0] ? (
                                                   <img src={it.product.images[0]} alt={it.product.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                                                ) : (
                                                   <div className="w-full h-full flex items-center justify-center grayscale opacity-10">
                                                      <Icon icon="solar:box-minimalistic-bold-duotone" className="w-5 h-5 text-brand-primary" />
                                                   </div>
                                                )}
                                             </div>

                                             <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                   <h5 className="font-bold text-brand-primary text-[12px] line-clamp-1 leading-tight">{it.product?.name}</h5>
                                                   <span className="text-[10px] font-black text-brand-secondary whitespace-nowrap ml-2">₹{(it.quantity * it.price).toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                   <div className="flex items-center gap-1.5 overflow-hidden">
                                                      <span className="text-[8px] font-bold text-brand-primary/40 leading-none">ID: {it.product?.productId || 'N/A'}</span>
                                                      {it.variantName && (
                                                         <>
                                                            <span className="w-0.5 h-0.5 rounded-full bg-brand-primary/10" />
                                                            <span className="text-[8px] font-bold text-brand-secondary/60 leading-none truncate">{it.variantName}</span>
                                                         </>
                                                      )}
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                      <p className="text-[9px] font-bold text-brand-primary/30 uppercase tracking-tighter">
                                                         {it.quantity} <span className="lowercase">pcs</span>
                                                      </p>
                                                      <p className="text-[9px] font-black text-brand-primary/60">
                                                         @ ₹{it.price.toLocaleString()}
                                                      </p>
                                                   </div>
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

