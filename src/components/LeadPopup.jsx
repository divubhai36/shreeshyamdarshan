import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function LeadPopup() {
   const [show, setShow] = useState(false);
   const [formData, setFormData] = useState({ name: '', mobile: '', product: '', pieces: '1' });

   useEffect(() => {
      const isDismissed = sessionStorage.getItem('lead_popup_dismissed');
      if (isDismissed) return;

      const timer = setTimeout(() => {
         setShow(true);
      }, 30 * 1000);

      return () => clearTimeout(timer);
   }, []);

   const handleClose = () => {
      setShow(false);
      sessionStorage.setItem('lead_popup_dismissed', 'true');
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const phone = "917383699199";
      const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Inquiry from Website:\n------------------\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*Interested In:* ${formData.product}\n*Quantity:* ${formData.pieces} pcs\n------------------\nPlease help me with the details.`;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      handleClose();
   };

   return (
      <AnimatePresence>
         {show && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-brand-primary/80 backdrop-blur-md"
               />

               <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative bg-white w-full max-w-[420px] rounded-[28px] md:rounded-[40px] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-brand-primary/10 flex flex-col text-left"
               >
                  {/* Slim Header - No Scroll Layout */}
                  <div className="shrink-0 bg-brand-primary p-4 md:p-8 relative overflow-hidden flex items-center justify-between border-b border-brand-secondary/20">
                     <div className="absolute inset-0 bg-[url('/images/hero_2.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent"></div>

                     <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 border border-brand-secondary/30 flex items-center justify-center">
                           <Icon icon="solar:magic-stick-bold" className="text-brand-secondary w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-lg md:text-2xl font-serif font-bold text-white italic leading-none">Divine Assistance</h3>
                           <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">Shree Shyam Darshan</p>
                        </div>
                     </div>

                     <button
                        onClick={handleClose}
                        className="relative z-50 w-9 h-9 rounded-full bg-white/5 hover:bg-brand-secondary hover:text-white flex items-center justify-center text-white/40 transition-all active:scale-95"
                     >
                        <Icon icon="lucide:x" className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Compact Form - No Scroll Layout */}
                  <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-3.5 md:space-y-6 bg-brand-accent/20 text-left">
                     <div className="text-left group">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                           <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Devotee Name</label>
                        </div>
                        <div className="relative text-left">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary">
                              <Icon icon="solar:user-bold" className="w-4 h-4" />
                           </span>
                           <input
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-white border border-brand-primary/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-brand-primary placeholder:text-brand-primary/20 shadow-sm focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all text-left"
                              placeholder="Enter Your Name"
                           />
                        </div>
                     </div>

                     <div className="text-left group">
                        <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 block ml-1 text-left">Inquiry for Product</label>
                        <div className="relative text-left">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary text-left">
                              <Icon icon="solar:cart-large-bold" className="w-4 h-4 text-left" />
                           </span>
                           <input
                              required
                              type="text"
                              value={formData.product}
                              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                              className="w-full bg-white border border-brand-primary/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-brand-primary placeholder:text-brand-primary/20 shadow-sm focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all text-left"
                              placeholder="what you want to buy?"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3.5 text-left">
                        <div className="text-left group/child">
                           <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 block ml-1 text-left">Mobile</label>
                           <div className="relative text-left">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary">
                                 <Icon icon="solar:phone-bold" className="w-4 h-4" />
                              </span>
                              <input
                                 required
                                 type="tel"
                                 minLength="10"
                                 maxLength="10"
                                 pattern="[0-9]{10}"
                                 value={formData.mobile}
                                 onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                                 className="w-full bg-white border border-brand-primary/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-brand-primary placeholder:text-brand-primary/20 shadow-sm focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all text-left"
                                 placeholder="Your Mobile Number"
                              />
                           </div>
                        </div>
                        <div className="text-left group/child text-left">
                           <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 block ml-1 text-left">Pcs</label>
                           <div className="relative text-left text-left">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary">
                                 <Icon icon="solar:box-bold" className="w-4 h-4" />
                              </span>
                              <input
                                 required
                                 type="number"
                                 min="1"
                                 value={formData.pieces}
                                 onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                                 className="w-full bg-white border border-brand-primary/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-brand-primary placeholder:text-brand-primary/20 shadow-sm focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all text-left"
                              />
                           </div>
                        </div>
                     </div>


                     <div className="pt-2">
                        <button
                           type="submit"
                           className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl text-sm uppercase tracking-[0.2em] shadow-lg hover:bg-brand-secondary hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-center"
                        >
                           <Icon icon="logos:whatsapp-icon" className="w-5 h-5 text-left" />
                           Inquire on WhatsApp
                        </button>
                        <p className="text-[8px] text-brand-primary/30 font-bold uppercase tracking-[0.2em] text-center mt-3">Privacy is our priority</p>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
}
