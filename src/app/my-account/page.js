"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
  DISPATCHED: "bg-indigo-50 text-indigo-600 border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function MyAccount() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [view, setView] = useState("orders"); // orders | settings
  const [user, setUser] = useState(null);
  const [settingsForm, setSettingsForm] = useState({ name: "", companyName: "", address: "", password: "", confirmPassword: "" });
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      const dt = await res.json();
      if(dt.success) {
          setOrders(dt.orders);
          setUser(dt.user);
          setSettingsForm({
              name: dt.user.name || "",
              companyName: dt.user.companyName || "",
              address: dt.user.address || "",
              password: "",
              confirmPassword: ""
          });
      }
    } catch(e) { console.error("Failed to load orders"); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile Authenticated & Updated");
        loadOrders();
      } else {
        toast.error(data.error || "Update Failed");
      }
    } catch (e) { toast.error("Network Error"); }
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-brand-accent/20">
      
      <main className="container mx-auto px-4 lg:px-8 pt-28 lg:pt-36 pb-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Dashboard Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-brand-primary/5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-bl-[100px]" />
               <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-3xl font-serif font-bold mb-6">
                     P
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-brand-primary">Partner Portal</h2>
                  <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-[0.2em] mt-1">Exclusive B2B Access</p>
               </div>

               <div className="mt-12 space-y-2">
                  <LinkTab icon="solar:history-bold" label="Order History" active={view === 'orders'} onClick={() => setView('orders')} />
                  <LinkTab icon="solar:settings-bold" label="Profile Settings" active={view === 'settings'} onClick={() => setView('settings')} />
                  <LinkTab icon="solar:heart-bold" label="Saved Pieces" path="/saved-products" />
                  <LinkTab icon="solar:cart-large-bold" label="View Registry" path="/cart" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-[10px] uppercase tracking-widest mt-12">
                     <Icon icon="solar:logout-bold-duotone" className="w-5 h-5" /> Sign Out
                  </button>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
             <div className="mb-10">
               <h1 className="text-3xl font-serif font-bold text-brand-primary">Order Registry</h1>
               <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.3em] mt-2">Manage Procurement Logs</p>
             </div>

              {loading ? (
                 <div className="bg-white p-32 rounded-[40px] text-center border border-brand-primary/5">
                    <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" />
                 </div>
              ) : view === 'settings' ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                   <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-primary/5 shadow-sm">
                      <h2 className="text-2xl font-serif font-bold text-brand-primary mb-8">Profile Authentication</h2>
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest ml-1">Full Name</label>
                               <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full p-4 border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-secondary/5 outline-none transition-all" required />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest ml-1">Company / Firm Name</label>
                               <input type="text" value={settingsForm.companyName} onChange={e => setSettingsForm({...settingsForm, companyName: e.target.value})} className="w-full p-4 border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-secondary/5 outline-none transition-all" />
                            </div>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest ml-1">Business Address</label>
                            <textarea value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full p-4 border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-secondary/5 outline-none transition-all h-24 resize-none" />
                         </div>
                         <div className="p-6 bg-brand-primary/[0.02] border border-brand-primary/5 rounded-3xl space-y-6">
                            <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-[0.3em]">Security Update</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest ml-1">New Password (Optional)</label>
                                  <input type="password" value={settingsForm.password} onChange={e => setSettingsForm({...settingsForm, password: e.target.value})} className="w-full p-4 border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-secondary/5 outline-none transition-all" placeholder="••••••••" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest ml-1">Confirm Password</label>
                                  <input type="password" value={settingsForm.confirmPassword} onChange={e => setSettingsForm({...settingsForm, confirmPassword: e.target.value})} className="w-full p-4 border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-secondary/5 outline-none transition-all" placeholder="••••••••" />
                               </div>
                            </div>
                         </div>
                         <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-brand-primary/5">
                            <div className="flex items-center gap-3 text-brand-primary/30">
                               <Icon icon="solar:phone-bold" className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Contact: {user?.phone} (Locked)</span>
                            </div>
                            <button type="submit" disabled={updating} className="px-12 py-4 bg-brand-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary shadow-xl transition-all disabled:opacity-50 flex items-center gap-2">
                               {updating ? <Icon icon="line-md:loading-loop" /> : 'Update Dossier'}
                            </button>
                         </div>
                      </form>
                   </div>
                </motion.div>
              ) : orders.length === 0 ? (
                <div className="bg-white p-20 lg:p-32 rounded-[40px] text-center border border-brand-primary/5 shadow-sm">
                   <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                     <Icon icon="solar:bill-list-linear" className="w-8 h-8 text-brand-primary/20" />
                   </div>
                   <h3 className="text-xl font-serif font-bold text-brand-primary">No Logs Found</h3>
                   <p className="text-sm text-brand-primary/40 mt-2 italic">You haven't initiated any procurements yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {orders.map((order) => (
                     <motion.div 
                       layout
                       key={order.id} 
                       className="bg-white p-6 lg:p-8 rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                       onClick={() => setActiveOrder(activeOrder?.id === order.id ? null : order)}
                     >
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                               <Icon icon="solar:bill-list-bold-duotone" className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                               <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1">Log Reference</p>
                               <h4 className="text-xl font-serif font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">#{order.orderNumber}</h4>
                            </div>
                         </div>

                         <div className="text-left sm:text-right">
                            <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1">Valuation</p>
                            <p className="text-lg font-serif font-bold text-brand-primary">₹{order.totalAmount.toLocaleString()}</p>
                         </div>

                         <div className={`px-5 py-2 rounded-full border text-[9px] font-bold uppercase tracking-[0.2em] ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                         </div>

                         <div className="text-brand-primary/20 group-hover:text-brand-secondary transition-all">
                            <Icon icon={activeOrder?.id === order.id ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="w-6 h-6" />
                         </div>
                       </div>

                       {/* Expandable Order Details */}
                       <AnimatePresence>
                         {activeOrder?.id === order.id && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden mt-8 pt-8 border-t border-brand-primary/5"
                           >
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-center bg-brand-accent/30 p-4 rounded-2xl border border-brand-primary/5">
                                     <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-brand-primary/10">
                                        <img src={item.product?.images?.[0] || '/hero.png'} className="w-full h-full object-cover" />
                                     </div>
                                     <div className="text-left">
                                        <p className="text-[10px] font-bold text-brand-primary leading-tight line-clamp-1">{item.product?.name}</p>
                                        <p className="text-[9px] font-bold text-brand-primary/40 mt-1 uppercase tracking-widest">
                                            {item.quantity} units @ ₹{item.price.toLocaleString()}
                                            {item.variantName && <span className="ml-1 text-brand-secondary">({item.variantName})</span>}
                                        </p>
                                     </div>
                                  </div>
                                ))}
                             </div>
                             <div className="mt-8 p-4 bg-brand-primary rounded-[24px] text-center">
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Formal Log Initiated On: {new Date(order.createdAt).toLocaleString()}</p>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </motion.div>
                   ))}
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

function LinkTab({ icon, label, active = false, path = "#", onClick }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => onClick ? onClick() : (path !== "#" && router.push(path))}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-[10px] uppercase tracking-widest ${active ? 'bg-brand-primary text-white shadow-xl px-6' : 'text-brand-primary/40 hover:bg-brand-primary/5 hover:text-brand-primary px-4'}`}
    >
      <Icon icon={icon + "-bold-duotone"} className="w-5 h-5" />
      {label}
    </button>
  );
}
