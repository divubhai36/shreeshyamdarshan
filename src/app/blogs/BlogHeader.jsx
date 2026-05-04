"use client";
import { motion } from 'framer-motion';

export default function BlogHeader() {
    return (
        <div className="relative h-[300px] lg:h-[400px] flex items-center justify-center overflow-hidden bg-brand-primary">
            {/* Minimal Decorative Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
                />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                        <span className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.4em]">Official Blog</span>
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-serif font-black text-white leading-tight">
                        Divine <span className="text-brand-secondary italic font-normal">Insights</span>
                    </h1>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-12 bg-white/20" />
                        <p className="text-[10px] lg:text-xs font-medium text-white/50 uppercase tracking-[0.6em]">Chronicles of Shree Shyam Darshan</p>
                        <div className="h-px w-12 bg-white/20" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
