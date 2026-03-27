import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const reviews = [
  {
    id: 1,
    name: "Priyanka Sharma",
    location: "Jaipur",
    text: "The Laddu Gopal Poshak is absolutely divine. Intricate embroidery and premium velvet. Highly recommended!",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 2,
    name: "Rahul Mehra",
    location: "New Delhi",
    text: "Handwork is even better than photos. Zardosi work is unmatched. Proud customer!",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 3,
    name: "Sneha Kapur",
    location: "Mumbai",
    text: "Excellent collection and great service. Secure packaging and fast delivery.",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 4,
    name: "Amit Patel",
    location: "Ahmedabad",
    text: "Authenticity of designs is unmatched. Truly satisfied with the Shringar items.",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 5,
    name: "Deepa Nair",
    location: "Bangalore",
    text: "Most elegant collection. I've bought multiple poshaks, each a masterpiece.",
    rating: 5,
    avatar: "solar:user-circle-bold"
  }
];

const Celebration = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
     {[...Array(20)].map((_, i) => (
        <motion.div
           key={i}
           initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
           animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: (Math.random() - 0.5) * 600,
              y: (Math.random() - 0.5) * 600,
              rotate: Math.random() * 360
           }}
           transition={{ duration: 2.5, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
           className="absolute left-1/2 top-11/12 text-brand-secondary z-50"
        >
           <Icon icon="solar:star-bold" className="w-4 h-4 md:w-6 md:h-6" />
        </motion.div>
     ))}
     {[...Array(15)].map((_, i) => (
        <motion.div
           key={`petal-${i}`}
           initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
           animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 500,
              y: (Math.random() - 0.5) * 500,
              rotate: Math.random() * 360
           }}
           transition={{ duration: 3, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
           className="absolute left-1/2 top-1/2 text-brand-secondary/40 z-50"
        >
           <Icon icon="solar:heart-bold" className="w-3 h-3 md:w-5 md:h-5" />
        </motion.div>
     ))}
  </div>
);

export default function ReviewMarquee() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '', text: '', rating: 5 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customer_feedbacks') || '[]');
    setLocalReviews(saved);
  }, []);

  // For this demo, we assume the first local review belongs to the current user
  const userReview = localReviews.find(r => r.isUser !== false); // Simple flag check

  const openForWrite = () => {
    setEditingId(null);
    setFormData({ name: '', location: '', text: '', rating: 5 });
    setIsOpen(true);
  };

  const openForEdit = () => {
    if (userReview) {
      setFormData({
        name: userReview.name,
        location: userReview.location,
        text: userReview.text,
        rating: userReview.rating
      });
      setEditingId(userReview.id);
      setIsOpen(true);
    }
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + start + duration);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + duration);
      };
      // Play a little sparkly flourish
      playTone(523.25, 0, 0.1); // C5
      playTone(659.25, 0.05, 0.1); // E5
      playTone(783.99, 0.1, 0.1); // G5
      playTone(1046.50, 0.15, 0.3); // C6
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingId) {
      updated = localReviews.map(r => r.id === editingId ? { ...r, ...formData, status: 'pending', date: new Date().toISOString() } : r);
    } else {
      const newReview = { ...formData, id: Date.now(), status: 'pending', date: new Date().toISOString(), avatar: "solar:user-circle-bold", isUser: true };
      updated = [...localReviews, newReview];
    }

    localStorage.setItem('customer_feedbacks', JSON.stringify(updated));
    setLocalReviews(updated);
    playSuccessSound();
    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setFormData({ name: '', location: '', text: '', rating: 5 });
    setEditingId(null);
  };

  const allVisibleReviews = [...reviews, ...localReviews];

  {/* Review Card Component for Reusability */}
  const ReviewCard = ({ review, idx }) => (
    <div
      key={`${review.id}-${idx}`}
      className={`w-[230px] md:w-[260px] p-4 lg:p-5 rounded-[20px] lg:rounded-[24px] border border-brand-primary/5 shadow-sm flex flex-col gap-2.5 group/card transition-all duration-500 text-left ${review.isUser ? 'bg-brand-secondary/10 border-brand-secondary/20 ring-2 ring-brand-secondary/5' : 'hover:bg-brand-secondary/10 border-brand-secondary/20 ring-2 ring-brand-secondary/5'}`}
    >
      <div className="flex items-center gap-2.5 text-left text-left">
         <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-500 text-left ${review.isUser ? 'bg-brand-secondary text-white' : 'bg-white text-brand-secondary group-hover/card:bg-brand-secondary group-hover/card:text-white'}`}>
            <Icon icon={review.avatar || "solar:user-circle-bold"} className="w-6 h-6 text-left" />
         </div>
         <div className="text-left">
            <h4 className="font-serif font-bold text-brand-primary text-[11px] lg:text-xs leading-none mb-1 text-left flex items-center gap-1">
              {review.name}
              {review.isUser && <span className="text-[6px] bg-brand-secondary/20 text-brand-secondary px-1 rounded uppercase tracking-tighter">You</span>}
            </h4>
            <div className="flex gap-0.5 text-left">
               {[...Array(review.rating)].map((_, i) => (
                 <Icon key={i} icon="solar:star-bold" className="text-brand-secondary w-2.5 h-2.5 text-left" />
               ))}
            </div>
         </div>
         <div className="ml-auto opacity-10 flex flex-col items-center">
            <Icon icon="lucide:quote" className="w-3.5 h-3.5 text-left" />
         </div>
      </div>

      <p className="text-brand-primary/70 text-[10px] lg:text-[11px] font-serif leading-relaxed line-clamp-2 text-left">
        "{review.text}"
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-primary/5 text-left">
         <div className="flex items-center gap-1 text-[7px] font-bold text-brand-secondary/60 uppercase tracking-widest text-left">
            <Icon icon="solar:verified-check-bold" className="w-2.5 h-2.5 text-left" />
            {review.status === 'pending' ? 'Verification Pending' : 'Verified'}
         </div>
         <span className="text-[7px] text-brand-primary/20 font-bold uppercase tracking-widest text-left">{review.location}</span>
      </div>
    </div>
  );

  const row1 = [...allVisibleReviews].sort(() => 0.5 - Math.random());
  const row2 = [...allVisibleReviews].sort(() => 0.2 - Math.random());
  const speed = 80 + (localReviews.length * 2);

  return (
    <section className="py-8 lg:py-12 bg-white overflow-hidden relative border-t border-brand-primary/5 text-center">
      <div className="container mx-auto px-4 mb-4 flex flex-col items-center gap-4 text-center">
         <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-1 text-center">
            <div className="inline-flex items-center shrink-0 gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 shadow-sm text-center">
               <Icon icon="solar:star-bold" className="text-brand-secondary w-3 h-3 lg:w-4 lg:h-4 text-center" />
               <span className="text-brand-secondary font-bold text-[8px] lg:text-[10px] tracking-[0.2em] uppercase whitespace-nowrap text-center">Trusted by 5000+ Devotees</span>
            </div>

            {userReview ? (
               <button
                 onClick={openForEdit}
                 className="inline-flex items-center shrink-0 gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-brand-secondary text-white border border-brand-secondary shadow-lg hover:bg-brand-primary transition-all group scale-95 md:scale-100 text-center"
               >
                  <Icon icon="solar:pen-bold" className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-12 transition-transform text-center" />
                  <span className="font-bold text-[8px] lg:text-[10px] tracking-[0.2em] uppercase whitespace-nowrap text-center">Edit My Review</span>
               </button>
            ) : (
               <button
                 onClick={openForWrite}
                 className="inline-flex items-center shrink-0 gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-brand-primary text-white border border-brand-primary shadow-lg hover:bg-brand-secondary hover:border-brand-secondary transition-all group scale-95 md:scale-100 text-center"
               >
                  <Icon icon="solar:pen-new-square-bold" className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-12 transition-transform text-center" />
                  <span className="font-bold text-[8px] lg:text-[10px] tracking-[0.2em] uppercase whitespace-nowrap text-center">Write a Review</span>
               </button>
            )}
         </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6 relative group py-4 text-left">
           {/* Global Overlays */}
           <div className="absolute inset-y-0 left-0 w-12 lg:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-12 lg:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

           {/* Row 1: Left to Right */}
           <div className="flex overflow-hidden relative text-left pb-1">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: speed,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="flex gap-4 shrink-0 px-2 text-left"
              >
                {[...row1, ...row1, ...row1].map((review, idx) => (
                  <ReviewCard key={`r1-${review.id}-${idx}`} review={review} idx={idx} />
                ))}
              </motion.div>
           </div>

           {/* Row 2: Right to Left */}
           <div className="flex overflow-hidden relative text-left pb-1">
              <motion.div
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  duration: speed,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="flex gap-4 shrink-0 px-2 text-left"
              >
                {[...row2, ...row2, ...row2].map((review, idx) => (
                  <ReviewCard key={`r2-${review.id}-${idx}`} review={review} idx={idx} />
                ))}
              </motion.div>
           </div>
      </div>

      <AnimatePresence>
         {isOpen && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isSuccess && setIsOpen(false)}
                className="absolute inset-0 bg-brand-primary/40 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-sm rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden border border-brand-primary/5 text-left"
              >
                 {!isSuccess ? (
                   <form onSubmit={handleSubmit} className="p-6 lg:p-8 text-left">
                      <div className="flex items-center justify-between mb-6 text-left">
                         <h3 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary text-left">
                           {editingId ? 'Refine Experience' : 'Share Experience'}
                         </h3>
                         <button type="button" onClick={() => setIsOpen(false)} className="text-brand-primary/20 hover:text-brand-primary transition-colors">
                            <Icon icon="lucide:x" className="w-6 h-6" />
                         </button>
                      </div>

                      <div className="space-y-4 text-left">
                         <div className="text-left">
                            <label className="block text-[8px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 text-left">Your Name</label>
                            <input
                              required
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-brand-accent/30 border-none rounded-2xl px-4 py-3 text-xs font-bold text-brand-primary focus:ring-2 focus:ring-brand-secondary/50 transition-all placeholder:text-brand-primary/20 text-left"
                              placeholder="Your Name"
                            />
                         </div>
                         <div className="text-left">
                            <label className="block text-[8px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 text-left">Location</label>
                            <input
                              required
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full bg-brand-accent/30 border-none rounded-2xl px-4 py-3 text-xs font-bold text-brand-primary focus:ring-2 focus:ring-brand-secondary/50 transition-all placeholder:text-brand-primary/20 text-left"
                              placeholder="Your Location"
                            />
                         </div>
                         <div className="text-left">
                            <label className="block text-[8px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 text-left">Ratings</label>
                            <div className="flex gap-2 text-left">
                               {[1,2,3,4,5].map((star) => (
                                 <button
                                   key={star}
                                   type="button"
                                   onClick={() => setFormData({...formData, rating: star})}
                                   className={`transition-transform active:scale-95 text-left ${formData.rating >= star ? 'text-brand-secondary' : 'text-brand-primary/10'}`}
                                 >
                                    <Icon icon="solar:star-bold" className="w-6 h-6 text-left" />
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="text-left">
                            <label className="block text-[8px] font-bold text-brand-primary/40 uppercase tracking-widest mb-1.5 text-left">Your Experience</label>
                            <textarea
                              required
                              rows="3"
                              value={formData.text}
                              onChange={(e) => setFormData({...formData, text: e.target.value})}
                              className="w-full bg-brand-accent/30 border-none rounded-2xl px-4 py-3 text-xs font-bold text-brand-primary focus:ring-2 focus:ring-brand-secondary/50 transition-all placeholder:text-brand-primary/20 resize-none text-left"
                              placeholder="Describe your experience..."
                            />
                         </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-8 bg-brand-primary text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-secondary transition-all active:scale-[0.98] text-center"
                      >
                         {editingId ? 'Update Review' : 'Submit Review'}
                      </button>
                   </form>
                 ) : (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="p-10 text-center flex flex-col items-center gap-6 relative"
                   >
                      <Celebration />

                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary shadow-inner relative z-10">
                         <Icon icon="solar:verified-check-bold" className="w-10 h-10 lg:w-12 lg:h-12" />
                      </div>
                      <div className="text-center relative z-10">
                         <h3 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary mb-2 text-center">Review {editingId ? 'Updated' : 'Submitted'}!</h3>
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 border border-orange-200 shadow-sm animate-pulse mb-4">
                            <Icon icon="lucide:clock" className="w-3 h-3" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Status: Pending Verification</span>
                         </div>
                         <p className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed mb-6">Thank you for your devotion.<br />Our team will verify it shortly.</p>

                         <button
                           onClick={handleCloseSuccess}
                           className="px-8 py-3 bg-brand-primary text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg active:scale-95"
                         >
                            Close
                         </button>
                      </div>
                   </motion.div>
                 )}
              </motion.div>
           </div>
         )}
      </AnimatePresence>

    </section>
  );
}
