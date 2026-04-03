"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutUsClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-accent pb-12 lg:pb-20 text-left">
      <Header />

      <section className="pt-24 lg:pt-32 pb-12 lg:pb-20 bg-brand-primary text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15 bg-[url('/images/hero_2.jpg')] bg-cover bg-center mix-blend-overlay scale-110"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-7xl">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <p className="text-brand-secondary font-bold tracking-[0.4em] lg:tracking-[0.6em] uppercase mb-4 text-[10px] lg:text-sm text-center">Who We Are</p>
             <h1 className="text-4xl lg:text-7xl font-serif font-bold mb-6 lg:mb-8 leading-tight text-center">ABOUT <span className="text-brand-secondary italic">US</span></h1>
             <p className="text-white/60 text-xs lg:text-lg max-w-3xl mx-auto leading-relaxed italic text-center">
               At Shree Shyam Darshan, we believe that adoration of the divine is an art. We craft every piece with deep devotion, ensuring your deity is adorned with unparalleled elegance and grace.
             </p>
           </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                 <div className="aspect-[4/5] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border-2 border-white relative">
                    <Image src="/images/poshak-1.jpg" alt="Devotion" fill className="object-cover" />
                 </div>
                 <div className="absolute -bottom-8 -right-8 w-40 h-40 lg:w-64 lg:h-64 bg-brand-secondary/90 rounded-[30px] lg:rounded-[50px] p-6 lg:p-10 flex flex-col justify-center text-white shadow-2xl backdrop-blur-md">
                    <h4 className="text-3xl lg:text-5xl font-serif font-bold mb-2">1000+</h4>
                    <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white/70">Masterpiece Collections</p>
                 </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8 lg:space-y-12 text-left">
                 <div className="space-y-4 lg:space-y-6 text-left">
                    <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight text-left">Founded on A <span className="text-brand-secondary">Sacred Vision</span></h2>
                    <p className="text-brand-primary/70 text-sm lg:text-base leading-relaxed lg:leading-[1.8] italic text-left">
                       What started as a small artisan's passion for divine garment making has grown into Shree Shyam Darshan—a trusted name for Laddu Gopal Poshak and Shringar across the world.
                    </p>
                    <p className="text-brand-primary/50 text-xs lg:text-sm leading-relaxed lg:leading-[1.6] text-left">
                       Based in India, we specialize in handcrafted attire for deity idols, particularly Shri Laddu Gopal Ji, Radha Krishna, and Maa Durga. Our team of skilled artisans uses techniques passed down through generations to create intricate designs featuring Zardosi, hand-beading, and premium embroidery on pure silk and velvet.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-3 text-left">
                       <Icon icon="lucide:award" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-secondary" />
                       <h5 className="font-serif font-bold text-brand-primary text-base lg:text-xl text-left">Heritage Quality</h5>
                       <p className="text-[10px] lg:text-xs text-brand-primary/40 font-medium uppercase tracking-widest leading-relaxed text-left">Authentic artisans with traditional expertise.</p>
                    </div>
                    <div className="space-y-3 text-left">
                       <Icon icon="lucide:heart" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-secondary" />
                       <h5 className="font-serif font-bold text-brand-primary text-base lg:text-xl text-left">Deep Devotion</h5>
                       <p className="text-[10px] lg:text-xs text-brand-primary/40 font-medium uppercase tracking-widest leading-relaxed text-left">Every stitch is made with love and sacred intent.</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-brand-primary text-white text-center overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <p className="text-brand-secondary font-bold tracking-[0.4em] uppercase mb-4 text-[10px] text-center">What Matters Most</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-bold mb-12 lg:mb-20 text-center">OUR CORE <span className="text-brand-secondary italic text-center">VALUES</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
               <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-10 lg:p-14 rounded-[30px] lg:rounded-[50px] border border-white/5 backdrop-blur-xl group hover:border-brand-secondary/50 transition-all text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-brand-secondary mx-auto mb-10 group-hover:scale-110 transition-transform">
                    <Icon icon="lucide:sparkles" className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold mb-4 uppercase tracking-wider text-center">Masterpiece Quality</h3>
                  <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-widest leading-relaxed text-center">We never compromise on materials or finishes.</p>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-10 lg:p-14 rounded-[30px] lg:rounded-[50px] border border-white/5 backdrop-blur-xl group hover:border-brand-secondary/50 transition-all text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-brand-secondary mx-auto mb-10 group-hover:scale-110 transition-transform">
                    <Icon icon="lucide:gem" className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold mb-4 uppercase tracking-wider text-center">Authentic Designs</h3>
                  <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-widest leading-relaxed text-center">Original creations that blend tradition with grandeur.</p>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-10 lg:p-14 rounded-[30px] lg:rounded-[50px] border border-white/5 backdrop-blur-xl group hover:border-brand-secondary/50 transition-all text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-brand-secondary mx-auto mb-10 group-hover:scale-110 transition-transform">
                    <Icon icon="lucide:shield-check" className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold mb-4 uppercase tracking-wider text-center">Customer Care</h3>
                  <p className="text-white/40 text-[10px] lg:text-xs font-medium uppercase tracking-widest leading-relaxed text-center">Serving the divine through dedicated customer support.</p>
               </motion.div>
            </div>
         </div>
      </section>

      <section className="py-20 lg:py-32 container mx-auto px-4 text-center max-w-7xl">
         <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-brand-secondary p-10 lg:p-20 rounded-[40px] lg:rounded-[60px] text-white shadow-2xl relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_3.jpg')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8 lg:space-y-12 text-center">
               <h2 className="text-3xl lg:text-6xl font-serif font-bold italic leading-tight max-w-4xl mx-auto text-center">"Adorn Your Divine Masterpiece Today"</h2>
               <div className="text-center">
                  <Link href="/" className="inline-flex items-center gap-3 px-6 py-3 lg:px-14 lg:py-6 bg-white text-brand-secondary font-bold text-xs lg:text-base uppercase tracking-widest rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-500 shadow-xl">
                     Explore Collection <Icon icon="lucide:arrow-right" className="w-5 h-5 lg:w-6 lg:h-6 text-brand-secondary" />
                  </Link>
               </div>
            </div>
         </motion.div>
      </section>

      <Footer />
    </div>
  );
}
