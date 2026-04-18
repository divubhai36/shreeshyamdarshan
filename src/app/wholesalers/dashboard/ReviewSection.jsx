"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewSection() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);

  const { data: review, isLoading: loading } = useQuery({
    queryKey: ['user-review'],
    queryFn: async () => {
      const res = await fetch("/api/user/reviews");
      const data = await res.json();
      return data.success ? data.review : null;
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/user/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['user-review'] });
        setIsModalOpen(false);
        setComment("");
        setMessage({ type: "success", text: "Feedback submitted for moderation!" });
      } else {
        setMessage({ type: "error", text: data.error || "Submission failed" });
      }
    },
    onError: () => {
      setMessage({ type: "error", text: "Connection error" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({ rating, comment });
  };

  const submitting = submitMutation.isPending;

  if (loading) return null;

  return (
    <div className="mt-8">
      {message && (
        <div className={`mb-4 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {message.text}
        </div>
      )}

      {!review ? (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-5 p-6 bg-white rounded-[40px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 hover:bg-brand-primary/2 transition-all text-left outline-none"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-sm">
            <Icon icon="solar:star-bold-duotone" className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h4 className="text-lg font-serif font-bold text-brand-primary">Share Feedback</h4>
            <p className="text-[10px] text-brand-primary/30 font-bold uppercase tracking-widest mt-1">Review your experience with us</p>
          </div>
          <Icon icon="solar:add-circle-bold" className="w-6 h-6 text-brand-secondary" />
        </button>
      ) : (
        <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${review.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
               {review.status === 'APPROVED' ? 'Public' : 'Moderation Pending'}
             </span>
          </div>
          <h4 className="text-sm font-bold text-brand-primary tracking-widest uppercase mb-4 opacity-40">Your Review</h4>
          <div className="flex gap-1 mb-3">
             {[...Array(5)].map((_, i) => (
               <Icon key={i} icon="solar:star-bold" className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} />
             ))}
          </div>
          <p className="text-brand-primary font-serif italic text-lg leading-relaxed">"{review.comment}"</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-primary/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-md rounded-[40px] p-8 lg:p-10 shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-brand-primary/5 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>

              <h3 className="text-3xl font-serif font-bold text-brand-primary mb-2">Write Review</h3>
              <p className="text-xs text-brand-primary/40 uppercase tracking-widest font-bold mb-8">Your feedback matters to us</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/30 mb-3 block">Overall Rating</label>
                   <div className="flex gap-2">
                     {[1,2,3,4,5].map((s) => (
                       <button 
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${rating >= s ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-gray-50 text-gray-300'}`}
                       >
                         <Icon icon="solar:star-bold" className="w-6 h-6" />
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/30 mb-2 block ml-1">Your Detailed Feedback</label>
                   <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-brand-primary/2 border border-brand-primary/5 rounded-3xl p-5 text-brand-primary font-bold focus:bg-white focus:ring-8 focus:ring-brand-secondary/5 transition-all outline-none h-32 placeholder:text-brand-primary/10"
                    required
                   />
                </div>

                <div className="pt-4">
                   <button 
                    disabled={submitting}
                    className="w-full bg-brand-primary text-white py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Icon icon="line-md:loading-loop" className="w-5 h-5" />
                    ) : (
                      <>
                        <Icon icon="solar:cloud-upload-bold-duotone" className="w-5 h-5" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[8px] text-brand-primary/20 text-center font-bold uppercase tracking-widest">
                  Note: Reviews are moderated before showing on site
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
