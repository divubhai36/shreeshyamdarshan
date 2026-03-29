import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import CategoryCard from '../components/CategoryCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ReviewMarquee from '../components/ReviewMarquee';

function Home() {
   const products = productData.products;
   const categories = productData.categories;
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

   useEffect(() => {
      const timer = setInterval(() => {
         setTextIndex((prev) => (prev + 1) % signatures.length);
      }, 5000);
      return () => clearInterval(timer);
   }, []);

   return (
      <div className="min-h-screen bg-brand-accent overflow-x-hidden text-left">
         <Header />

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
                  <motion.h2
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
                  </motion.h2>
                  <motion.p
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
                        className="absolute -bottom-2 left-0 h-[1px] bg-brand-secondary/20"
                     />
                  </motion.p>
               </motion.div>
            </AnimatePresence>
         </div>
         <Hero />

         {/* Featured Cinematic Reel Section */}
         <section className="py-12 lg:py-10 container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col items-center mb-10 lg:mb-16 text-center">
               <div className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">Live From Surat</div>
               <h2 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-brand-primary uppercase text-center whitespace-nowrap">Experience <span className="italic font-normal">Our World</span></h2>
               <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-6 lg:mt-8"></div>
            </div>

            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               onClick={() => setActiveVideo("/videos/reel 6_1.mp4")}
               className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] cursor-pointer group border border-brand-primary/5 bg-white"
            >
               <video
                  src="/videos/reel 6_1.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-white">
                     <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-2xl border border-white/40 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Icon icon="solar:play-bold" className="w-8 h-8 lg:w-12 lg:h-12 ml-1" />
                     </div>
                     <span className="text-[10px] lg:text-xs uppercase font-bold tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">Watch Full Reel</span>
                  </div>
               </div>

               {/* Decorative Boutique Badge */}
               {/* <div className="absolute top-6 left-6 lg:top-10 lg:left-10 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-bold uppercase tracking-[0.3em] text-white shadow-sm z-10">
                  Direct From Surat
               </div> */}
            </motion.div>
         </section>
         {/* Categories Showcase (Best Collections) */}
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
                  />
               ))}
            </div>
         </section>


         {/* Best Seller Featured Section */}
         <section className="py-6 lg:py-10 bg-white/50 backdrop-blur-sm border-y border-brand-primary/5">
            <div className="container mx-auto px-4 max-w-7xl">
               <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-4 lg:mb-6 gap-4 text-center md:text-left text-left">
                  <div className="text-left">
                     <p className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-2 lg:mb-3 text-center md:text-left">Trending Now</p>
                     <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary leading-tight uppercase text-center md:text-left">Handpicked <br className="hidden md:block" /> <span className="italic font-normal">Best Sellers</span></h2>
                  </div>
                  <Link to="/collections/dresses" className="hidden md:flex btn-outline group text-xs py-2 px-5 rounded-full items-center gap-2">
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
                        <Link to={`/product/${product.id}`} className="h-full">
                           <ProductCard product={product} />
                        </Link>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* Premium Perks Section */}
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

         <ReviewMarquee />

         {/* Premium Boutique & Location Section */}
         <section className="py-0 lg:py-24 bg-white  relative overflow-hidden">
            {/* Subtle Brand Watermark */}
            <div className="absolute top-[-50px] lg:top-0 right-[-90px] lg:right-0 p-20 opacity-[0.03] select-none pointer-events-none">
               <h2 className="text-[100px] lg:text-[200px] font-serif font-black leading-none uppercase">Surat</h2>
            </div>

            <div className="container mx-auto px-4 mb-5 max-w-7xl relative z-10">
               {/* Editorial Header */}
               <div className="flex flex-col items-center mb-12 lg:mb-20 text-center">
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="flex items-center justify-center gap-4 mb-6"
                  >
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                     <span className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-[0.5em] uppercase">Showroom Experience</span>
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

               {/* Cinematic Experience Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                  {/* Left: Boutique Atmosphere (Video) */}
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="relative aspect-video lg:aspect-auto lg:h-[600px] rounded-[40px] overflow-hidden shadow-2xl group border border-brand-primary/5"
                  >
                     <video
                        src="/videos/reel 3.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 to-transparent" />
                  </motion.div>

                  {/* Right: Map Portal */}
                  <div className="flex flex-col gap-6 lg:gap-10">
                     {/* <motion.a
                        href="https://maps.app.goo.gl/4fevQAM117YF6mif6"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[250px] lg:h-[280px] rounded-[40px] overflow-hidden shadow-xl group cursor-pointer border border-brand-primary/5"
                     >
                        <img
                           src="/images/location/map.png"
                           alt="Showroom Map Location"
                           className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-[2px] transition-colors group-hover:bg-brand-primary/10" />

                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-2xl group-hover:bg-brand-secondary group-hover:text-white transition-all transform group-hover:scale-110">
                                 <Icon icon="solar:map-point-bold" className="w-8 h-8" />
                              </div>
                              <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em] bg-brand-primary/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">Navigate Live</span>
                           </div>
                        </div>
                     </motion.a> */}
                     {/* Showroom Concierge Card */}
                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex-grow flex flex-col justify-between p-8 lg:p-10 rounded-[40px] bg-brand-accent/20 border border-brand-primary/5 relative overflow-hidden group shadow-2xl"
                     >
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-8">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                              <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.4em] text-brand-secondary">Showroom Live • Open Now</span>
                           </div>

                           <h3 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary mb-6 leading-tight">
                              Visit Our <span className="italic font-normal text-brand-secondary">Surat</span>
                           </h3>

                           <p className="text-brand-primary/50 text-[10px] lg:text-xs tracking-[0.2em] uppercase mb-10 leading-relaxed max-w-sm">
                              Experience the art of divine craftsmanship in person at our flagship creative studio.
                           </p>

                           <div className="space-y-6 mb-10">
                              <div className="flex items-start gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-brand-primary/5 group-hover:bg-brand-secondary/20 group-hover:text-white transition-all duration-500">
                                    <Icon icon="solar:shop-2-bold" className="w-6 h-6 text-brand-primary" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 mb-1">Our Location</span>
                                    <span className="text-sm font-serif font-bold text-brand-primary leading-tight">69, Darshan Industries, <br />Laskana, Surat.</span>
                                 </div>
                              </div>

                              <div className="flex items-start gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-brand-primary/5 group-hover:bg-brand-secondary/20 group-hover:text-white transition-all duration-500">
                                    <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-brand-primary" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 mb-1">Experience Hours</span>
                                    <span className="text-sm font-serif font-bold text-brand-primary">Mon - Sat | 09:00 AM - 06:00 PM</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                           <a
                              href="https://maps.app.goo.gl/4fevQAM117YF6mif6"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow py-5 px-8 bg-brand-primary/90 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-brand-secondary hover:text-brand-primary transition-all flex items-center justify-center gap-3 active:scale-95"
                           >
                              <Icon icon="logos:google-maps" className="w-6 h-6 animate-bounce" />
                              Click here for Map
                           </a>
                           <a href="tel:+917383699199">
                              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-lg transition-transform duration-500">
                                 <Icon icon="solar:phone-calling-bold" className="w-8 h-8" />
                              </div>
                           </a>
                        </div>

                        {/* Abstract Texture Background */}
                        <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-brand-secondary/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-brand-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:translate-x-10 transition-transform duration-1000" />
                     </motion.div>
                  </div>
               </div>
            </div>
         </section>

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

         <Footer />
      </div>
   );
}

export default Home;
