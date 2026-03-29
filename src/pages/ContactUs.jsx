import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Icon } from '@iconify/react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function ContactUs() {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="min-h-screen bg-brand-accent">
         <Header />

         {/* Modern Split Hero */}
         <section className="pt-20 lg:pt-0 min-h-[60vh] lg:h-screen flex flex-col lg:flex-row bg-white">

            {/* Left: Atmospheric Visual */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1 }}
               className="w-full lg:w-1/2 h-64 lg:h-full relative overflow-hidden"
            >
               <img
                  src="/images/hero_3.jpg"
                  alt="Divine Sanctuary"
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s]"
               />
               <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply"></div>
               <div className="absolute inset-x-0 bottom-0 p-8 lg:p-20 bg-gradient-to-t from-brand-primary/80 to-transparent text-white">
                  <p className="text-[10px] lg:text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-70">Our Headquarters</p>
                  <h2 className="text-3xl lg:text-5xl font-serif font-bold italic">Visit our Divine Sanctuary</h2>
               </div>
            </motion.div>

            {/* Right: Elegant Info */}
            <div className="w-full lg:w-1/2 flex items-start justify-center p-8 lg:pt-36 lg:pb-20 lg:px-20 overflow-y-auto bg-brand-accent/30">
               <div className="max-w-xl w-full space-y-12 lg:space-y-6">

                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 }}
                     className=''
                  >
                     <p className="text-brand-secondary font-bold tracking-[0.5em] uppercase mb-4 text-[10px]">Reach Out</p>
                     <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-4">Let's <span className="italic font-normal text-brand-secondary">Connect</span></h1>
                  </motion.div>

                  <div className="space-y-10 lg:space-y-10">

                     {/* Item: Phone */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group cursor-pointer lg:pt-10"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Contact Number</p>
                              <a href="tel:+917383699199" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic">+91 73836 99199</a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: Email */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Email Us</p>
                              <a href="mailto:shreeshyamdarshan155@gmail.com" className="text-lg lg:text-2xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic lowercase tracking-tight">shreeshyamdarshan155@gmail.com</a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: Instagram */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Digital Gallery</p>
                              <a href="https://www.instagram.com/shree.shyam.darshan_?igsh=MWx6dWVqcWZmbWkzcw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                 <Icon icon="mdi:instagram" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                 @shree.shyam.darshan_
                              </a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: WhatsApp */}
                     {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.68 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Chat on WhatsApp</p>
                              <a href="https://wa.me/917383699199" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                 <Icon icon="mdi:whatsapp" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                 +91 73836 99199
                              </a>
                           </div>
                        </div>
                     </motion.div> */}

                     {/* Item: Google Business */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.69 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Google Business</p>
                              <a href="https://share.google/NnpT8DIwtX0QG6SdU" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                 <Icon icon="mdi:google-my-business" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                 Visit Store on Google
                              </a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: Google Reviews */}
                     {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Our Reputation</p>
                               <a href="https://share.google/NnpT8DIwtX0QG6SdU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight">
                                  Read Google Reviews
                                  <div className="flex items-center">
                                     <Icon icon="solar:star-bold" className="w-5 h-5 text-brand-secondary" />
                                     <Icon icon="solar:star-bold" className="w-5 h-5 text-brand-secondary" />
                                     <Icon icon="solar:star-bold" className="w-5 h-5 text-brand-secondary" />
                                     <Icon icon="solar:star-bold" className="w-5 h-5 text-brand-secondary" />
                                     <Icon icon="solar:star-bold" className="w-5 h-5 text-brand-secondary" />
                                  </div>
                               </a>
                           </div>
                        </div>
                     </motion.div> */}

                     {/* Item: Address */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Locate Us</p>
                              <a
                                 href="https://maps.app.goo.gl/JApzZ9c7UvcsunWB7"
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block hover:translate-x-2 transition-transform duration-500"
                              >
                                 <address className="text-sm lg:text-lg font-medium text-brand-primary not-italic leading-relaxed max-w-sm group-hover:text-brand-primary transition-colors">
                                    69, Shree, Darshan Industries, Kamrej Rd, near Amrut Udhyog Nagar, Laskana, Kamrej,  <br />
                                    Gujarat 394185, India.
                                 </address>
                              </a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Hours Tile */}
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="p-8 bg-brand-primary rounded-[30px] text-white flex justify-between items-center shadow-2xl relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <Icon icon="lucide:clock" className="w-20 h-20" />
                        </div>
                        <div className="relative z-10 text-left">
                           <p className="text-[9px] uppercase tracking-widest font-bold text-brand-secondary mb-1 text-left">Standard Hours</p>
                           <h4 className="text-lg font-serif italic mb-1 text-left">Mon - Sat: 9AM - 6PM</h4>
                           <p className="text-[10px] text-white/40 text-left">Sunday by Appointment only</p>
                        </div>
                        <Link to="/" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-primary transition-all">
                           <Icon icon="lucide:arrow-right" className="w-5 h-5" />
                        </Link>
                     </motion.div>

                  </div>
               </div>
            </div>
         </section>

         {/* Divine Map Section */}
         <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl mb-12 lg:mb-16">
               <div className="text-center">
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="flex items-center justify-center gap-4 mb-4"
                  >
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                     <span className="text-brand-secondary font-bold text-[10px] tracking-[0.5em] uppercase">Locate Our Boutique</span>
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                  </motion.div>
                  <motion.h2
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="text-4xl lg:text-6xl font-serif font-bold text-brand-primary"
                  >
                     Visit Our <span className="italic text-brand-secondary font-normal">Sanctuary</span>
                  </motion.h2>
                  <p className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-widest mt-4">Laskana, Surat, Gujarat</p>
               </div>
            </div>

            <div className="w-full lg:container lg:mx-auto lg:px-4 lg:max-w-7xl relative">
               <a
                  href="https://maps.app.goo.gl/JApzZ9c7UvcsunWB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer group/map relative"
               >
                  <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1.2 }}
                     className="w-full h-[350px] lg:h-[600px] overflow-hidden relative lg:rounded-[100px]"
                  >
                     {/* 4-Way Gradient Fade to blend with white background */}
                     <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-40 pointer-events-none"></div>
                     <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-40 pointer-events-none"></div>
                     <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-40 pointer-events-none hidden lg:block"></div>
                     <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-40 pointer-events-none hidden lg:block"></div>

                     {/* Content Overlay */}
                     <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">

                        {/* Refined Branded Pin with Location-Matched Animation */}
                        <div className="relative -translate-y-8 flex flex-col items-center">

                           {/* The Animation Layer - Positioned at the TIP of the pin */}
                           <div className="absolute top-[85%] lg:top-[88%] left-1/2 -translate-x-1/2 w-0 h-0 flex items-center justify-center">
                              {/* Staggered Soft Ripples */}
                              {[1, 2, 3].map((i) => (
                                 <motion.div
                                    key={i}
                                    initial={{ scale: 0.2, opacity: 0 }}
                                    animate={{
                                       scale: [0.5, 3],
                                       opacity: [0, 0.2, 0]
                                    }}
                                    transition={{
                                       duration: 4,
                                       repeat: Infinity,
                                       delay: i * 1.3,
                                       ease: "easeOut"
                                    }}
                                    className="absolute w-12 h-12 rounded-full bg-brand-primary"
                                    style={{
                                       boxShadow: '0 0 40px rgba(26,67,50,0.15)'
                                    }}
                                 />
                              ))}

                              {/* Gold Pulse Sparkle */}
                              <motion.div
                                 animate={{
                                    scale: [0.5, 2],
                                    opacity: [0, 0.1, 0]
                                 }}
                                 transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                 }}
                                 className="absolute w-10 h-10 rounded-full bg-brand-secondary"
                              />
                           </div>

                           {/* Static Branded Pin Body */}
                           <div className="relative z-50 flex flex-col items-center">
                              <svg className="w-12 h-16 lg:w-16 lg:h-20 drop-shadow-[0_20px_20px_rgba(26,67,50,0.3)]" viewBox="0 0 384 512">
                                 <path
                                    fill="#1a4332"
                                    d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"
                                 />
                                 <circle cx="192" cy="192" r="80" fill="#c5a059" />
                              </svg>

                              {/* Elegant Shadow base at the tip */}
                              <div className="w-6 h-1 bg-brand-primary/20 blur-[2px] rounded-full mt-[-2px] relative z-10" />
                           </div>
                        </div>

                        <div className="absolute bottom-16 lg:bottom-20 bg-white/90 backdrop-blur-md px-3 lg:px-6 py-2 lg:py-3 rounded-full shadow-2xl border border-brand-primary/10 opacity-0 group-hover/map:opacity-100 -translate-y-4 group-hover/map:translate-y-0 transition-all duration-500 flex items-center gap-3">
                           <Icon icon="mdi:google-maps" className="w-5 h-5 text-brand-primary" />
                           <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">Click to Navigate</span>
                        </div>
                     </div>

                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d94449.18127376684!2d72.81936390819972!3d21.243605459284446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be047eba400dc89%3A0xbe2a740041ca3b4d!2sSHREE%20SHYAM%20DARSHAN!5e0!3m2!1sen!2sin!4v1774776973865!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(1) sepia(0.05) contrast(1.1) brightness(1.02) saturate(0.5)' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Shree Shyam Darshan"
                        className="pointer-events-none group-hover/map:scale-105 group-hover/map:filter-none transition-all duration-[3s]"
                     ></iframe>
                  </motion.div>
               </a>
            </div>
         </section>

         <Footer />
      </div>
   );
}
