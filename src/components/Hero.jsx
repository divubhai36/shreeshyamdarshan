"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import productData from '../data/products.json';

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = productData.slider_images;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToCollections = () => {
    const element = document.getElementById('collections-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative pt-5 lg:pt-10 pb-8 lg:pb-12 overflow-hidden bg-brand-accent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Contained Box Style */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[550px] xl:h-[550px] 2xl:h-[650px] w-full mx-auto overflow-hidden shadow-2xl rounded-3xl lg:rounded-[60px] border border-brand-primary/5 bg-brand-primary/10">

          <AnimatePresence>
            <motion.div
              key={current}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/20 to-transparent z-10" />
              <Image
                src={slides[current].url}
                alt={slides[current].title}
                fill
                priority={current === 0}
                className="object-cover brightness-[0.85] contrast-[1.1]"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 lg:px-24 max-w-md lg:max-w-3xl text-white">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <p className="text-brand-secondary font-bold tracking-[0.3em] lg:tracking-[0.5em] uppercase mb-4 text-[10px] lg:text-base border-l-4 border-brand-secondary pl-4">
                    {slides[current].subtitle}
                  </p>
                </motion.div>

                <motion.h2
                  key={`title-${current}`}
                  initial={{ y: 80, opacity: 0, skewY: 5 }}
                  animate={{ y: 0, opacity: 1, skewY: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-6xl lg:text-9xl font-serif font-bold leading-[0.95] mb-8 lg:mb-12 drop-shadow-2xl"
                >
                   {slides[current].title.split(' ').map((word, i) => (
                      <span key={i} className="inline-block mr-4">
                         {word === "Collection" || word === "Excellence" ? (
                            <span className="italic font-normal text-brand-secondary/90 tracking-tight">{word}</span>
                         ) : word}
                      </span>
                   ))}
                </motion.h2>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <button 
                    onClick={scrollToCollections}
                    className="group relative px-8 py-4 lg:px-12 lg:py-5 bg-white text-brand-primary font-bold rounded-full text-[10px] lg:text-sm uppercase tracking-widest flex items-center gap-3 overflow-hidden transition-all hover:pr-14 hover:bg-brand-secondary hover:text-white shadow-2xl"
                  >
                    <span className="relative z-10">Explore Collection</span>
                    <Icon icon="lucide:arrow-right" className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Premium Floating Navigation Buttons */}
          <div className="absolute right-8 bottom-8 lg:right-12 lg:bottom-12 z-30 flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-2xl group"
            >
              <Icon icon="lucide:chevron-left" className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-2xl group"
            >
              <Icon icon="lucide:chevron-right" className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute left-8 bottom-8 lg:left-12 lg:bottom-12 z-30 flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`transition-all duration-700 rounded-full h-1.5 ${idx === current ? 'w-10 lg:w-16 bg-brand-secondary' : 'w-2 lg:w-3 bg-white/30 hover:bg-white/50'}`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
          
          {/* Silent background preload for instant slide transitions */}
          <div className="hidden">
            {slides.map((slide, idx) => (
              <Image key={`preload-${idx}`} src={slide.url} alt="preload" width={100} height={100} priority={idx === 0} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
