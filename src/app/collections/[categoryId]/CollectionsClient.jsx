"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import CategoryCard from "@/components/CategoryCard";
import SmartImage from "@/components/SmartImage";

export default function CollectionsClient({ category, categoryId, subCategories }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [randomVideos, setRandomVideos] = useState([]);

  useEffect(() => {
    if (category.videos && category.videos.length > 0) {
      const shuffled = [...category.videos]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setRandomVideos(shuffled);
    }
  }, [category.videos]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-brand-accent/30 overflow-x-hidden text-left">
      {/* Category Header Banner */}
      <div className="relative h-[250px] lg:h-[450px] overflow-hidden bg-brand-primary">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full relative"
        >
          <SmartImage
            id={category.image}
            alt={category.name || category.label}
            priority
            className="w-full h-full object-cover opacity-40 brightness-50"
          />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 lg:pt-20 gap-4 lg:gap-8 text-center text-white px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.5em] uppercase mb-[-10px] lg:mb-[-20px] text-center"
          >
            Masterpiece Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-7xl font-serif font-bold text-white tracking-widest uppercase text-center"
          >
            {category.name || category.label}
          </motion.h1>
          <div className="flex items-center gap-3 text-[7px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
            <Link href="/" className="hover:text-brand-secondary transition-colors">
              Home
            </Link>
            <Icon
              icon="lucide:chevron-right"
              className="w-3 h-3 text-white/20"
            />
            <span className="text-brand-secondary">
              {category.name || category.label}
            </span>
          </div>
        </div>
      </div>

      {randomVideos.length > 0 && (


        <section className="bg-white py-10 lg:py-24 border-b border-brand-primary/5">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center mb-2 lg:mb-16 text-center">
              <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">
                Brand Cinema
              </div>
              <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center">
                The Art of <span className="italic font-normal">Craftsmanship</span>
              </h2>
              <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-6 lg:mt-8"></div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:gap-10">
              {randomVideos.map((videoUrl, idx) => (


                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveVideo(videoUrl)}
                  className="group relative aspect-[9/16] overflow-hidden rounded-2xl lg:rounded-[40px] shadow-2xl cursor-pointer bg-brand-primary/5"
                >
                  <video
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Icon
                        icon="solar:play-bold"
                        className="w-4 h-4 lg:w-6 lg:h-6 ml-1"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      <main className="container mx-auto px-4 lg:px-8 py-10 lg:py-20 max-w-7xl">
        <div className="flex flex-col items-center mb-2 lg:mb-16 text-center">
          <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">
            Explore Categories
          </div>
          <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center">
            Handpicked <span className="italic font-normal">Collections</span>
          </h2>
          <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-6 lg:mt-8"></div>
        </div>

        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10 text-center">
            {subCategories.map((sub, index) => (
              <CategoryCard
                key={sub.id}
                index={index}
                label={sub.name}
                image={sub.image}
                href={`/category/${categoryId}/${sub.id}`}
                count={sub.productCount > 0 ? sub.productCount : undefined}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 lg:py-40 flex flex-col items-center justify-center text-center px-6"
          >
             <div className="relative mb-6">
                <div className="absolute inset-0 bg-brand-secondary/5 blur-3xl rounded-full scale-150" />
                <Icon icon="solar:folder-error-bold-duotone" className="h-16 w-16 lg:h-24 lg:w-24 text-brand-primary/10 relative z-10" />
             </div>
             <h3 className="text-lg lg:text-3xl font-serif font-bold text-brand-primary uppercase tracking-widest mb-4">Collection Under Update</h3>
             <p className="text-[9px] lg:text-xs font-bold text-brand-primary/30 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                We are currently handpicking new divine additions for this collection.
             </p>
             <Link href="/" className="mt-10 px-8 py-3.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-secondary transition-all active:scale-95">
                Explore Others
             </Link>
          </motion.div>
        )}
      </main>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideo(null);
              }}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-brand-secondary transition-colors flex items-center justify-center text-white z-20 border border-white/10 shadow-2xl"
            >
              <Icon icon="lucide:x" className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[450px] aspect-[9/16] max-h-[90vh] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
