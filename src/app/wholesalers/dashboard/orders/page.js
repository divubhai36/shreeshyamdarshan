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
      if(dt.success) setOrders(dt.orders);
    } catch(e) { console.error("Failed to load orders"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <main className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-36 pb-12 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/wholesalers/dashboard')} className="p-3 bg-white rounded-2xl border border-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center gap-2 group">
            <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Back</span>
          </button>
          <h2 className="text-2xl font-serif font-bold text-brand-primary font-serif">Order History</h2>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] text-center border border-brand-primary/5 shadow-xl">
            <Icon icon="solar:document-text-bold-duotone" className="w-16 h-16 text-brand-primary/10 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-brand-primary">No Logs Found</h3>
            <p className="text-xs text-brand-primary/40 mt-2">You haven't initiated any procurements yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 lg:p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <Icon icon="solar:bill-list-bold-duotone" className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-0.5">Ref #{order.orderNumber}</p>
                        <h4 className="text-lg font-serif font-bold text-brand-primary italic">₹{order.totalAmount.toLocaleString()}</h4>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-[8px] font-bold uppercase tracking-widest ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </div>
                </div>

                <AnimatePresence>
                  {activeOrder === order.id && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden mt-4 pt-4 border-t border-brand-primary/5">
                        <div className="space-y-2">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className="text-brand-primary font-bold line-clamp-1 flex-grow">{it.product?.name}</span>
                              <span className="text-brand-primary/40 text-[10px] whitespace-nowrap ml-4">{it.quantity} × ₹{it.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-[#fcfbf7] rounded-2xl text-[9px] font-bold text-brand-primary/40 text-center uppercase tracking-widest leading-relaxed">
                          Formal Log Initiated On {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
