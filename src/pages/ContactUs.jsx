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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 overflow-y-auto bg-brand-accent/30">
               <div className="max-w-xl w-full space-y-12 lg:space-y-20">

                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 }}
                  >
                     <p className="text-brand-secondary font-bold tracking-[0.5em] uppercase mb-4 text-[10px]">Reach Out</p>
                     <h1 className="text-4xl lg:text-7xl font-serif font-bold text-brand-primary leading-tight mb-8">Let's <span className="italic text-brand-secondary">Connect</span></h1>
                  </motion.div>

                  <div className="space-y-10 lg:space-y-16">

                     {/* Item: Phone */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group cursor-pointer"
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
                              <a href="mailto:shreeshyamdarshan155@gmail.com" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic lowercase tracking-tight">shreeshyamdarshan155@gmail.com</a>
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
                              <a href="https://www.instagram.com/shree.shyam.darshan_?igsh=MWx6dWVqcWZmbWkzcw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                <Icon icon="mdi:instagram" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                @shree.shyam.darshan_
                              </a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: Facebook */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.68 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Facebook Presence</p>
                              <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                 <Icon icon="mdi:facebook" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                 Shree Shyam Darshan
                              </a>
                           </div>
                        </div>
                     </motion.div>

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
                               <a href="https://share.google/JnMykrFgSHuIxMfmU" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                                  <Icon icon="mdi:google-my-business" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" />
                                  Visit Store on Maps
                               </a>
                           </div>
                        </div>
                     </motion.div>

                     {/* Item: Google Reviews */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="group cursor-pointer"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                           <div>
                              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors">Our Reputation</p>
                               <a href="https://www.google.com/maps/place/New+Darshan+Lace+Laddu+Gopal+Poshak/@21.2609972,72.9387443,17z/data=!3m1!4b1!4m6!3m5!1s0x3be0476bce35e253:0x32a44a274a6c13a8!8m2!3d21.2609972!4d72.9413192!16s%2Fg%2F11sztzxtk7?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic tracking-tight">
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
                     </motion.div>

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
                              <address className="text-sm lg:text-lg font-medium text-brand-primary/60 not-italic leading-relaxed max-w-sm group-hover:text-brand-primary transition-colors">
                                 69, Shree, Darshan Industries, Kamrej Rd, near Amrut Udhyog Nagar, Laskana, Kamrej,  <br />
                                 Gujarat 394185, India.
                              </address>
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
            
            <div className="w-full lg:container lg:mx-auto lg:px-4 lg:max-w-7xl">
               <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="w-full h-[300px] lg:h-[550px] lg:rounded-[60px] overflow-hidden shadow-2xl border-y lg:border border-brand-primary/5 relative z-10"
               >
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.264449783075!2d72.9413192!3d21.2609972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0476bce35e253%3A0x32a44a274a6c13a8!2sNew%20Darshan%20Lace%20Laddu%20Gopal%20Poshak!5e0!3m2!1sen!2sin!4v1774638658474!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8) invert(0.05)' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shree Shyam Darshan Boutique Location"
                    className="hover:grayscale-0 transition-all duration-1000"
                  ></iframe>
               </motion.div>
            </div>
         </section>

         <Footer />
      </div>
   );
}
