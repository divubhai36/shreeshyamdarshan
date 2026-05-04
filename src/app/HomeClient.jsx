"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Link from 'next/link';
import ReviewMarquee from '../components/ReviewMarquee';

export default function HomeClient({ products, categories, reviews, reviewVideos = [] }) {
   const bestSellers = products.filter(p => p.isBestSeller);
   const [activeVideo, setActiveVideo] = useState(null);
   const signatures = [
      {
         segments: [
            { text: "India's ", className: "text-brand-primary" },
            { text: "Biggest", className: "text-brand-secondary italic font-normal" },
            { text: "Manufacturer", className: "text-brand-primary", newLine: true }
         ],
         sub: "Shree Shyam Darshan"
      },
      {
         segments: [
            { text: "World Wide", className: "text-brand-secondary" },
            { text: "Delivery", className: "text-brand-primary italic font-normal", newLine: true }
         ],
         sub: "India's Finest Heritage"
      }
   ];
   const [textIndex, setTextIndex] = useState(0);
   const [isLogged, setIsLogged] = useState(false);

   useEffect(() => {
      const cookies = document.cookie.split(';');
      const hasUserSession = cookies.some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
      const storedUser = localStorage.getItem('ssd_user');
      setIsLogged(hasUserSession || !!storedUser);

      const timer = setInterval(() => {
         setTextIndex((prev) => (prev + 1) % signatures.length);
      }, 5000);
      return () => clearInterval(timer);
   }, []);

   return (
      <div className="min-h-screen bg-brand-accent overflow-x-hidden text-left">

         {/* Rich & Premium Signature Text Slider */}
         <div className="text-center mt-20 lg:mt-24 mb-0 h-[130px] lg:h-[140px] relative overflow-hidden px-4">
            <AnimatePresence mode="wait">
               <motion.div
                  key={textIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full"
               >
                  <motion.h1
                     className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold text-brand-primary leading-tight uppercase text-center mb-4 overflow-hidden flex flex-wrap justify-center items-center"
                  >
                     {(() => {
                        let charIndex = 0;
                        return signatures[textIndex].segments.map((segment, segIdx) => (
                           <React.Fragment key={segIdx}>
                              {segment.newLine && <div className="basis-full h-0 sm:hidden"></div>}
                              {segment.newLine && <span className="hidden sm:inline">&nbsp;</span>}
                              <span className={`inline-flex ${segment.className}`}>
                                 {segment.text.split("").map((char, i) => {
                                    const delayIndex = charIndex++;
                                    return (
                                       <motion.span
                                          key={i}
                                          initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                          transition={{
                                             duration: 1,
                                             delay: delayIndex * 0.03,
                                             ease: [0.19, 1, 0.22, 1]
                                          }}
                                          className="inline-block whitespace-pre"
                                       >
                                          {char}
                                       </motion.span>
                                    );
                                 })}
                              </span>
                           </React.Fragment>
                        ));
                     })()}
                  </motion.h1>
                  <motion.div
                     initial={{ opacity: 0, letterSpacing: "1em", y: 10 }}
                     animate={{ opacity: 1, letterSpacing: "0.4em", y: 0 }}
                     transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                     className="text-[12px] lg:text-[18px] font-medium text-brand-primary/40 uppercase tracking-[0.4em] inline-block relative"
                  >
                     <span className="relative z-10">{signatures[textIndex].sub}</span>
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute -bottom-2 left-0 h-px bg-brand-secondary/20"
                     />
                  </motion.div>
               </motion.div>
            </AnimatePresence>
         </div>
         <Hero />

         {/* Gated Wholesaler Sections */}
         {isLogged && (
            <>
               {/* 1. Discount Offer Section */}
               <section className="py-12 lg:py-20 bg-brand-primary relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
                     <Icon icon="solar:tag-bold-duotone" className="w-[800px] h-[800px] -translate-y-1/4 translate-x-1/4" />
                  </div>

                  <div className="container mx-auto px-4 max-w-7xl relative z-10">
                     <Icon icon="material-symbols-light:percent-discount-outline-rounded" className="w-[850px] h-[850px] text-white absolute bottom-[-350px] left-[-350px] hidden lg:block opacity-20" />
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 relative hidden lg:block">
                           {/* <Icon icon="material-symbols-light:percent-discount-outline-rounded" className="w-[500px] h-[500px] text-white" /> */}
                        </div>
                        <div className="lg:col-span-7 space-y-8">
                           <motion.div
                              initial={{ opacity: 0, x: -30 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              className="flex items-center gap-4"
                           >
                              <div className="w-12 h-[1px] bg-brand-secondary"></div>
                              <span className="text-brand-secondary text-[10px] lg:text-xs font-bold uppercase tracking-[0.4em]">Exclusive Privileges</span>
                           </motion.div>

                           <motion.h2
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 }}
                              className="text-4xl lg:text-7xl font-serif font-black text-white leading-tight"
                           >
                              The Discount <br />
                              <span className="italic font-normal text-brand-secondary underline decoration-brand-secondary/30 decoration-offset-8">Treasury</span>
                           </motion.h2>

                           <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4 }}
                              className="text-white/60 text-base lg:text-lg font-serif italic max-w-xl leading-relaxed"
                           >
                              Access curated inventories marked with our signature Wholesaler margins. These limited-edition masterpieces are currently available at competitive prices specifically for our authorized wholesalers.
                           </motion.p>

                           <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6 }}
                           >
                              <Link
                                 href="/wholesalers/dashboard/collection/offers"
                                 className="inline-flex items-center gap-4 bg-white text-brand-primary px-6 py-3 md:px-10 md:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-secondary hover:text-white transition-all shadow-2xl group"
                              >
                                 Explore Offers
                                 <Icon icon="lucide:arrow-up-right" className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                              </Link>
                           </motion.div>
                        </div>

                        {/* <div className="lg:col-span-5 relative hidden lg:block">
                           <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[60px] border border-white/10 shadow-2xl">
                              <div className="flex flex-col items-center text-center space-y-4">
                                 <div className="w-24 h-24 rounded-full bg-brand-secondary flex items-center justify-center shadow-2xl">
                                    <Icon icon="solar:ticket-sale-bold-duotone" className="w-12 h-12 text-white" />
                                 </div>
                                 <h4 className="text-white text-xl font-serif">Bulk Margins</h4>
                                 <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Live Inventory Refined For Wholesalers</p>
                              </div>
                           </div>
                        </div> */}
                     </div>
                  </div>
               </section>

               {/* 2. Ready Stock Section */}
               <section className="py-12 lg:py-24 bg-white border-b border-brand-primary/5 relative">
                  <div className="container mx-auto px-4 max-w-7xl">
                     <div className="flex flex-col items-center text-center space-y-10 pb-12 sm:pb-16">
                        <motion.div
                           initial={{ opacity: 0, scale: 0.9 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="inline-flex items-center gap-3 bg-brand-secondary/10 px-6 py-2 rounded-full border border-brand-secondary/20"
                        >
                           <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                           <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-widest">Real-Time Inventory</span>
                        </motion.div>

                        <div className="space-y-4">
                           <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="text-4xl lg:text-8xl font-serif font-black text-brand-primary tracking-tighter"
                           >
                              Ready-Stock <span className="italic font-normal text-brand-secondary">Registry</span>
                           </motion.h2>
                           <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 }}
                              className="text-brand-primary/40 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] max-w-2xl mx-auto px-4"
                           >
                              Skip the weaving timeline. Access the immediate dispatch vault featuring our most revered designs ready to ship within 24 hours of confirmation.
                           </motion.p>
                        </div>
                     </div>
                  </div>

                  {/* Full Width Strip */}
                  <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     viewport={{ once: true }}
                     className="w-full relative group"
                  >
                     <Link
                        href="/wholesalers/dashboard/collection/ready-stock"
                        className="flex items-center justify-center gap-6 sm:gap-12 py-10 sm:py-16 bg-brand-primary text-white hover:bg-brand-primary transition-all duration-700 relative overflow-hidden"
                     >
                        {/* Animated Patterns */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
                        </div>

                        <div className="hidden sm:block shrink-0 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-20 transition-all duration-700">
                           <Icon icon="solar:box-minimalistic-bold-duotone" className="w-16 h-16 sm:w-24 sm:h-24" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-4 px-4">
                           <span className="text-xs sm:text-xl font-bold uppercase tracking-[0.4em] text-white/50 ">Premium Customer Collection</span>
                           <span className="text-lg sm:text-3xl lg:text-4xl font-serif font-bold uppercase tracking-[0.2em] sm:tracking-[0.2em] flex items-center gap-4 sm:gap-10">
                              <Icon icon="lucide:minus" className="w-10 h-1 hidden sm:block opacity-20" />
                              Check Out Our Ready Stock
                              <Icon icon="lucide:minus" className="w-10 h-1 hidden sm:block opacity-20" />
                           </span>
                           <motion.div
                              animate={{ x: [0, 10, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="flex items-center gap-3 text-brand-secondary font-bold text-xs sm:text-lg tracking-[0.14em] mt-2"
                           >
                              Click Here to Check it out
                              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                           </motion.div>
                        </div>

                        <div className="hidden sm:block shrink-0 -translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-20 transition-all duration-700">
                           <Icon icon="solar:cart-3-bold-duotone" className="w-16 h-16 sm:w-24 sm:h-24 rotate-12" />
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-2xl" />
                     </Link>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-brand-secondary/20 to-transparent" />
               </section>
            </>
         )}

         {/* Featured Cinematic Reel Section */}
         <section className="py-12 lg:py-10 container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col items-center mb-4 lg:mb-16 text-center">
               <div className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">Live From Surat</div>
               <h2 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-brand-primary uppercase text-center whitespace-nowrap">See <span className="italic font-normal">Who We Are</span></h2>

               <div className="w-full overflow-hidden py-4 mt-4 border-y border-brand-primary/5 bg-brand-primary/[0.01]">
                  <motion.div
                     animate={{ x: [0, -1030] }}
                     transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                     className="flex whitespace-nowrap gap-12 sm:gap-20 items-center"
                  >
                     {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 sm:gap-20">
                           <span className="text-sm sm:text-lg font-serif font-bold text-brand-primary uppercase tracking-[0.3em]">Watch Our Exclusive Video</span>
                           <Icon icon="solar:star-ring-bold-duotone" className="w-4 h-4 text-brand-secondary" />
                        </div>
                     ))}
                  </motion.div>
               </div>
            </div>

            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               // onClick={() => setActiveVideo("https://videourl.mp4")}
               className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] cursor-pointer group border border-brand-primary/5 bg-white"
            >
               {/* Featured Video or Brand Fallback */}
               <div className="absolute inset-0 bg-linear-to-br from-brand-primary via-brand-primary/90 to-brand-primary/80 flex items-center justify-center overflow-hidden">
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <Icon icon="solar:star-ring-bold-duotone" className="w-[800px] h-[800px] absolute -top-1/4 -right-1/4 animate-spin-slow" />
                  </div>

                  {/* SSD Branding Fallback */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     className="relative z-10 flex flex-col items-center"
                  >
                     <span className="font-serif italic text-[120px] md:text-[250px] font-black text-white/3 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                        SSD
                     </span>
                     <div className="flex flex-col items-center">
                        <h3 className="text-6xl md:text-9xl font-serif font-black text-brand-secondary drop-shadow-2xl italic leading-none">SSD</h3>
                        <p className="text-lg md:text-2xl font-bold text-brand-secondary/60 tracking-[0.5em] uppercase mt-0">Tour</p>
                     </div>
                     <div className="h-0.5 w-12 bg-brand-secondary/20 mt-6 rounded-full" />
                  </motion.div>

                  {/* Optional Video - Uncomment to use */}
                  {/* <video
                     src="https://videourl.mp4"
                     autoPlay
                     muted
                     loop
                     playsInline
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 z-20"
                  /> */}
               </div>
               <div className="z-20 absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-white">
                     <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-2xl border border-white/40 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Icon icon="solar:play-bold" className="w-8 h-8 lg:w-12 lg:h-12 ml-1" />
                     </div>
                     <span className="text-[10px] lg:text-xs uppercase font-bold tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">Watch Full Reel</span>
                  </div>
               </div>
            </motion.div>
         </section>

         <section className="py-6 lg:py-10 container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-4 lg:mb-6">
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-2 lg:gap-4 mb-2 lg:mb-3 text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] lg:tracking-[0.5em] uppercase text-center"
               >
                  <div className="h-[1px] w-8 lg:w-12 bg-brand-secondary/40"></div>
                  Explore Divinity
                  <div className="h-[1px] w-8 lg:w-12 bg-brand-secondary/40"></div>
               </motion.div>
               <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-brand-primary leading-tight uppercase text-center"
               >
                  Best <span className="italic font-normal">Collections</span>
               </motion.h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
               {categories.map((cat, index) => (
                  <CategoryCard
                     key={cat.id}
                     index={index}
                     label={cat.label}
                     image={cat.image}
                     href={`/collections/${cat.id}`}
                     count={cat.subCategories.length}
                     priority={index < 4}
                  />
               ))}
            </div>
         </section>

         <section className="py-6 lg:py-10 bg-white/50 backdrop-blur-sm border-y border-brand-primary/5">
            <div className="container mx-auto px-4 max-w-7xl">
               <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-4 lg:mb-6 gap-4 text-center md:text-left text-left">
                  <div className="text-left">
                     <p className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-2 lg:mb-3 text-center md:text-left">Trending Now</p>
                     <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary leading-tight uppercase text-center md:text-left">Handpicked <br className="hidden md:block" /> <span className="italic font-normal">Best Sellers</span></h2>
                  </div>
                  <Link href="/collections/dresses" className="hidden md:flex btn-outline group text-xs py-2 px-5 rounded-full items-center gap-2">
                     View All
                     <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1.5 transition-transform duration-300 w-4 h-4" />
                  </Link>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                  {bestSellers.map((product, idx) => (
                     <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05, duration: 0.6 }}
                     >
                        <ProductCard product={product} />
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         <section className="py-8 lg:py-12 bg-brand-primary text-white overflow-hidden relative">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center relative z-10 max-w-7xl">
               <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center bg-white/5 rounded-2xl lg:rounded-[30px] border border-white/10 backdrop-blur-xl shadow-xl group hover:border-brand-secondary/50 transition-all">
                     <Icon icon="solar:star-bold" className="text-brand-secondary group-hover:scale-110 transition-transform w-6 h-6 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                     <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase text-center">Premium Collection</h3>
                     <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium px-4 text-center">Each masterpiece is meticulously crafted to perfection by expert artisans.</p>
                  </div>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center bg-white/5 rounded-2xl lg:rounded-[30px] border border-white/10 backdrop-blur-xl shadow-xl group hover:border-brand-secondary/50 transition-all">
                     <Icon icon="lucide:shield-check" className="text-brand-secondary group-hover:scale-110 transition-transform w-6 h-6 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                     <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase text-center">Heritage Handwork</h3>
                     <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium px-4 text-center">Authentic designs featuring premium Zardosi, pearls, and traditional fabrics.</p>
                  </div>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center bg-white/5 rounded-2xl lg:rounded-[30px] border border-white/10 backdrop-blur-xl shadow-xl group hover:border-brand-secondary/50 transition-all">
                     <Icon icon="lucide:layout-grid" className="text-brand-secondary group-hover:scale-110 transition-transform w-6 h-6 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                     <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase text-center">Divine Curation</h3>
                     <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium px-4 text-center">A complete range of exclusive Poshaks, Shringar, and Furniture for your deity.</p>
                  </div>
               </motion.div>
            </div>
         </section>

         <ReviewMarquee reviews={reviews} reviewVideos={reviewVideos} />

         <section className="py-0 lg:py-12 bg-white  relative overflow-hidden">
            <div className="absolute top-[-50px] lg:top-[-80px] right-[-90px] lg:right-[150px] p-20 opacity-[0.03] select-none pointer-events-none">
               <h2 className="text-[100px] lg:text-[200px] font-serif font-black leading-none uppercase">Surat</h2>
            </div>

            <div className="container mx-auto px-4 mb-5 max-w-7xl relative z-10">
               <div className="flex flex-col items-center mb-12 lg:mb-20 text-center">
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="flex items-center justify-center gap-4 mb-6"
                  >
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                     <span className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-[0.1em] md:tracking-[0.5em] uppercase">Showroom Experience</span>
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                  </motion.div>

                  <motion.h2
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="text-4xl lg:text-7xl font-serif font-bold text-brand-primary leading-tight"
                  >
                     Locate <span className="italic font-normal text-brand-secondary">Us</span>
                  </motion.h2>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="relative aspect-video lg:aspect-auto lg:h-[650px] rounded-[40px] overflow-hidden shadow-2xl group border border-brand-primary/5 flex items-center justify-center bg-linear-to-br from-brand-primary via-brand-primary/95 to-brand-primary/90"
                  >
                     {/* Subtle Background Pattern */}
                     <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <Icon icon="solar:star-ring-bold-duotone" className="w-[600px] h-[600px] absolute -top-1/4 -right-1/4 animate-spin-slow" />
                     </div>

                     {/* SSD Branding Fallback */}
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center"
                     >
                        <span className="font-serif italic text-[100px] md:text-[200px] font-black text-white/3 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                           SSD
                        </span>
                        <div className="flex flex-col items-center">
                           <h3 className="text-5xl md:text-8xl font-serif font-black text-brand-secondary drop-shadow-2xl italic leading-none">SSD</h3>
                           <p className="text-base md:text-xl font-bold text-brand-secondary/60 tracking-[0.5em] uppercase mt-0">Location</p>
                        </div>
                        <div className="h-0.5 w-10 bg-brand-secondary/20 mt-6 rounded-full" />
                     </motion.div>

                     {/* Optional Video - Uncomment to use */}
                     {/* <video
                        src=""
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 z-20"
                     /> */}
                  </motion.div>

                  <div className="flex flex-col gap-6 lg:gap-10">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-grow flex flex-col justify-between p-7 sm:p-10 rounded-[40px] lg:rounded-[40px] bg-gradient-to-br from-white via-brand-accent/20 to-white border border-brand-secondary/20 relative overflow-hidden group shadow-[0_60px_120px_-30px_rgba(26,67,50,0.12)] selection:bg-brand-secondary/30"
                     >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
                           <Icon icon="solar:crown-minimalistic-bold" className="w-40 h-40 text-brand-secondary rotate-12" />
                        </div>

                        <div className="relative z-10">
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-10"
                           >
                              <div className="relative flex items-center justify-center">
                                 <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-brand-secondary rounded-full shadow-[0_0_20px_rgba(197,160,89,0.8)]" />
                                 <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-brand-secondary rounded-full animate-ping opacity-30" />
                              </div>
                              <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.3em] lg:tracking-[0.5em] text-brand-primary">SSD • SURAT STUDIO</span>
                           </motion.div>

                           <h3 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black text-brand-primary mb-6 lg:mb-8 leading-[1.1] tracking-tighter">
                              Visit Our <span className="relative inline-block">
                                 <span className="bg-gradient-to-r from-brand-secondary via-[#d4af37] to-brand-secondary bg-clip-text text-transparent italic font-normal">Surat</span>
                                 <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-1 bg-brand-secondary/30 origin-left"
                                 />
                              </span>
                           </h3>

                           <p className="text-brand-primary/60 text-[11px] lg:text-xs font-serif italic mb-12 leading-relaxed max-w-sm">
                              "Step into a sanctuary of devotion where every thread is woven with soul and generations of heritage."
                           </p>

                           <div className="grid grid-cols-1 gap-5 lg:gap-6 mb-10 lg:mb-20">
                              <a
                                 href="https://maps.app.goo.gl/JApzZ9c7UvcsunWB7"
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 group/item">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 border border-brand-secondary/10 group-hover/item:border-brand-secondary transition-all duration-700">
                                       <Icon icon="solar:map-point-wave-bold" className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-secondary mb-1 opacity-60">The Creative Studio</span>
                                       <span className="text-[13px] sm:text-lg font-serif font-bold text-brand-primary leading-tight">69, Darshan Ind., Laskana, Surat.</span>
                                    </div>
                                 </div>
                              </a>

                              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 group/item">
                                 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 border border-brand-secondary/10 group-hover/item:border-brand-secondary transition-all duration-700">
                                    <Icon icon="solar:history-bold" className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-secondary mb-1 opacity-60">Boutique Timings</span>
                                    <span className="text-[13px] sm:text-lg font-serif font-bold text-brand-primary">Mon - Sat | 09:00 AM - 06:00 PM</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5 relative z-10 w-full">
                           <a
                              href="https://maps.app.goo.gl/JApzZ9c7UvcsunWB7"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow relative overflow-hidden group/btn rounded-[20px] lg:rounded-full h-14 sm:h-16"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-[#2d4f41] to-brand-primary opacity-100 group-hover/btn:opacity-90 transition-opacity" />
                              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1.5s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                              <div className="relative h-full px-4 sm:px-10 lg:px-12 flex items-center justify-center gap-2 sm:gap-4 text-white text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.3em]">
                                 <Icon icon="logos:google-maps" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 grayscale brightness-[5] group-hover/btn:grayscale-0 group-hover/btn:brightness-100 transition-all duration-500" />
                                 <span className="whitespace-nowrap">Click Here For Map</span>
                              </div>
                           </a>

                           <a href="tel:+917383699199" className="shrink-0">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[20px] bg-brand-secondary/10 flex items-center justify-center text-brand-secondary border border-brand-secondary/20 shadow-xl hover:bg-brand-secondary hover:text-white transition-all duration-300 transform hover:-rotate-6 active:scale-95 group/call">
                                 <Icon icon="solar:phone-calling-bold" className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-500" />
                              </div>
                           </a>
                        </div>
                        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
                     </motion.div>
                  </div>
               </div>
            </div>
         </section>

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
                        src={activeVideo.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${activeVideo}` : activeVideo}
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
