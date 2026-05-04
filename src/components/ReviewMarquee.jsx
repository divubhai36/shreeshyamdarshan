"use client";
import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SmartVideo from './SmartVideo';

const reviews = [
  {
    id: 1,
    name: "Priyanka Sharma",
    location: "Jaipur",
    text: "The peacock design Poshak I ordered is simply stunning. The colors are so vibrant and the fabric is pure luxury. It arrived in just 3 days!",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 2,
    name: "Rahul Mehra",
    location: "New Delhi",
    text: "Best quality Ladoo Gopal dresses in India. The zardosi work is very clean and professional. Direct from Surat quality is clearly visible.",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 3,
    name: "Sneha Kapur",
    location: "Mumbai",
    text: "I was worried about the fitting, but it fits my Ladoo Gopal perfectly. The packaging was very safe and the service is excellent.",
    rating: 5,
    avatar: "solar:user-circle-bold"
  },
  {
    id: 4,
    name: "Amit Patel",
    location: "Ahmedabad",
    text: "Truly authentic designs. Pricing is very reasonable compared to retail shops. I will definitely buy again for the upcoming festival.",
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
  </div>
);

const ReviewMarquee = memo(({ reviews: dbReviews = [], reviewVideos = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '', text: '', rating: 5 });
  const [editingId, setEditingId] = useState(null);
  const [popupVideo, setPopupVideo] = useState(null);

  const displayReviews = useMemo(() => {
    return dbReviews.length > 0 ? dbReviews.map(r => ({
      id: r.id,
      name: r.name,
      location: r.company || "Verified Wholesaler",
      text: r.comment,
      rating: r.rating,
      avatar: "solar:user-circle-bold",
      status: 'verified'
    })) : reviews;
  }, [dbReviews]);

  const videoSliderSettings = {
    dots: false,
    infinite: reviewVideos.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: reviewVideos.length > 3,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 3000, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3.5 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } }
    ]
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('customer_feedbacks') || '[]');
      setLocalReviews(saved);
    }
  }, []);

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
      playTone(523.25, 0, 0.1);
      playTone(1046.50, 0.15, 0.3);
    } catch (e) { }
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
    if (typeof window !== 'undefined') localStorage.setItem('customer_feedbacks', JSON.stringify(updated));
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

  const ReviewCard = ({ review, idx }) => (
    <div
      key={`${review.id}-${idx}`}
      className={`w-[230px] md:w-[260px] p-4 lg:p-5 rounded-[20px] lg:rounded-[24px] border border-brand-primary/5 shadow-sm flex flex-col gap-2.5 group/card transition-all duration-500 text-left bg-white`}
    >
      <div className="flex items-center gap-2.5 text-left">
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
        <div className="ml-auto opacity-10">
          <Icon icon="lucide:quote" className="w-3.5 h-3.5" />
        </div>
      </div>
      <p className="text-brand-primary/70 text-[10px] lg:text-[11px] font-serif leading-relaxed line-clamp-2 text-left">
        "{review.text}"
      </p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-primary/5">
        <div className="flex items-center gap-1 text-[7px] font-bold text-brand-secondary/60 uppercase tracking-widest text-left">
          <Icon icon="solar:verified-check-bold" className="w-2.5 h-2.5 text-left" />
          {review.status === 'pending' ? 'Verification Pending' : 'Verified'}
        </div>
        <span className="text-[7px] text-brand-primary/20 font-bold uppercase tracking-widest">{review.location}</span>
      </div>
    </div>
  );

  const [hasMounted, setHasMounted] = useState(false);
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);

  useEffect(() => {
    if (displayReviews.length > 0) {
      setHasMounted(true);
      const shuffled = [...displayReviews].sort(() => 0.5 - Math.random());
      const half = Math.ceil(shuffled.length / 2);
      setRow1(shuffled.slice(0, half));
      setRow2(shuffled.slice(half));
    }
  }, [dbReviews]);

  if (!hasMounted) return <div className="py-10 bg-white" />;
  const speed = 70 + (localReviews.length * 2);

  return (
    <section className="pt-8 lg:pt-12 pb-4 lg:pb-12 bg-white overflow-hidden relative border-t border-brand-primary/5 text-center select-none">
      <div className="container mx-auto px-4 mb-4 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-1 text-center">
          <div className="inline-flex items-center shrink-0 gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-center">
            <Icon icon="solar:star-bold" className="text-brand-secondary w-3 h-3 lg:w-4 lg:h-4 text-center" />
            <span className="text-brand-secondary font-bold text-[8px] lg:text-[10px] tracking-[0.2em] uppercase whitespace-nowrap text-center">Trusted by 5000+ Devotees</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6 relative group py-4 text-left">
        <div className="absolute inset-y-0 left-0 w-12 lg:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-12 lg:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex overflow-hidden relative text-left pb-1">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: speed, ease: "linear", repeat: Infinity }}
            className="flex gap-4 shrink-0 px-2 text-left"
          >
            {[...row1, ...row1, ...row1].map((review, idx) => (
              <ReviewCard key={`r1-${review.id}-${idx}`} review={review} idx={idx} />
            ))}
          </motion.div>
        </div>

        <div className="flex overflow-hidden relative text-left pb-1">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: speed, ease: "linear", repeat: Infinity }}
            className="flex gap-4 shrink-0 px-2 text-left"
          >
            {[...row2, ...row2, ...row2].map((review, idx) => (
              <ReviewCard key={`r2-${review.id}-${idx}`} review={review} idx={idx} />
            ))}
          </motion.div>
        </div>

        {reviewVideos && reviewVideos.length > 0 && (
          <div className="mt-6 px-4 md:px-8 max-w-7xl mx-auto w-full text-center">
            <div className="flex flex-col items-center mb-4 lg:mb-10 text-center">
              <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3">Community Love</div>
              <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary uppercase">Happy <span className="italic font-normal">Customers</span></h2>
              <div className="w-16 h-[1px] bg-brand-primary/10 mt-4"></div>
            </div>

            <div className="happy-customer-video-slider">
              <Slider {...videoSliderSettings}>
                {reviewVideos.map((video, idx) => (
                  <div key={video.id || idx} className="px-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 0.98 }}
                      className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border border-brand-primary/5 cursor-pointer group bg-brand-accent/30"
                      onClick={() => setPopupVideo(video.url)}
                    >
                      <SmartVideo
                        id={video.id}
                        url={video.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mx-auto">
                          <Icon icon="solar:play-bold" className="w-5 h-5 ml-0.5" />
                        </div>
                        {video.title && <p className="text-white text-[10px] font-bold mt-2 truncate uppercase tracking-widest">{video.title}</p>}
                      </div>
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-[8px] font-bold text-white uppercase tracking-widest bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">Feedback</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {popupVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl"
            onClick={() => setPopupVideo(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopupVideo(null);
              }}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/40 hover:text-white transition-colors p-2"
            >
              <Icon icon="lucide:x" className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[450px] aspect-[9/16] max-h-[90vh] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={popupVideo.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${popupVideo}` : popupVideo} autoPlay controls playsInline className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default ReviewMarquee;
