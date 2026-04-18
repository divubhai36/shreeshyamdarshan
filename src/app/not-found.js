'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function NotFound() {
  return (
    <main className="flex-1 min-h-screen bg-brand-accent flex flex-col items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Background Watermark - Optimized for Mobile & Desktop */}
      <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none overflow-hidden">
        <h2 className="absolute top-[2%] left-[2%] md:top-[-5%] md:left-[-5%] text-[35vw] md:text-[25vw] font-serif font-black uppercase leading-none">
          SHREE
        </h2>
        <h2 className="absolute bottom-[5%] right-[2%] md:bottom-[-2%] md:right-[-5%] text-[35vw] md:text-[25vw] font-serif font-black uppercase leading-none">
          SHYAM
        </h2>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Big Text with Bottom Fade */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-[180px] lg:text-[100px] font-serif font-black leading-none uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-brand-primary via-brand-primary/80 to-transparent">
            Not <br className="md:hidden" /> Found
          </h1>
        </motion.div>

        {/* Small Description */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8, duration: 1 }}
           className="mb-12"
        >
          <p className="text-brand-primary/50 text-sm md:text-xl font-serif italic max-w-lg mx-auto leading-relaxed">
            "The divine path you seek is currently hidden from sight. Let us guide you back to the sanctuary of heritage."
          </p>
        </motion.div>

        {/* Return Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-4 bg-brand-primary text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-brand-secondary transition-all shadow-2xl group"
          >
            <Icon icon="solar:home-2-bold" className="text-lg" />
            Return Home
            <Icon icon="lucide:arrow-right" className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative Branding Line */}
      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4 opacity-10">
        <div className="h-px w-24 bg-brand-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary">SS Darshan</span>
      </div>
    </main>
  );
}
