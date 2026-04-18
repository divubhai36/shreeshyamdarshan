"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function ContactUsClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-accent text-left">

      {/* Modern Split Hero */}
      <section className="pt-20 lg:pt-0 min-h-[60vh] lg:h-screen flex flex-col lg:flex-row bg-white">
        {/* Left: Atmospheric Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 h-64 lg:h-full relative overflow-hidden"
        >
          <Image
            src="/images/hero_3.jpg"
            alt="Divine Sanctuary"
            fill
            priority
            className="object-cover scale-105 hover:scale-100 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-x-0 bottom-0 p-8 lg:p-20 bg-gradient-to-t from-brand-primary/80 to-transparent text-white">
            <p className="text-[10px] lg:text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-70">Our Headquarters</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-bold italic">Visit our Divine Sanctuary</h2>
          </div>
        </motion.div>

        {/* Right: Elegant Info */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 lg:pt-36 lg:pb-20 lg:px-20 overflow-y-auto bg-brand-accent/30 text-left">
          <div className="max-w-xl w-full space-y-12 lg:space-y-6 text-left">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-left">
              <p className="text-brand-secondary font-bold tracking-[0.5em] uppercase mb-4 text-[10px] text-left">Reach Out</p>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-4 text-left">
                Let's <span className="italic font-normal text-brand-secondary text-left">Connect</span>
              </h1>
            </motion.div>

            <div className="space-y-10 lg:space-y-10 text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="group cursor-pointer lg:pt-10 text-left">
                <div className="flex items-start gap-8 text-left">
                  <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors text-left">Contact Number</p>
                    <a href="tel:+917383699199" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic text-left">+91 73836 99199</a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="group cursor-pointer">
                <div className="flex items-start gap-8">
                  <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors text-left">Email Us</p>
                    <a href="mailto:shreeshyamdarshan155@gmail.com" className="text-lg lg:text-2xl font-serif font-bold text-brand-primary block hover:translate-x-2 transition-transform duration-500 italic lowercase tracking-tight text-left">shreeshyamdarshan155@gmail.com</a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="group cursor-pointer">
                <div className="flex items-start gap-8">
                  <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors text-left">Digital Gallery</p>
                    <a href="https://www.instagram.com/shree.shyam.darshan_?igsh=MWx6dWVqcWZmbWkzcw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-xl lg:text-3xl font-serif font-bold text-brand-primary hover:translate-x-2 transition-transform duration-500 italic tracking-tight flex items-center gap-3">
                      <Icon icon="mdi:instagram" className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary" /> @shree.shyam.darshan_
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="group cursor-pointer">
                <div className="flex items-start gap-8">
                  <div className="w-px h-16 bg-brand-secondary/30 group-hover:h-20 transition-all duration-500 text-brand-secondary"></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.3em] mb-3 group-hover:text-brand-secondary transition-colors text-left">Locate Us</p>
                    <a href="https://maps.app.goo.gl/JApzZ9c7UvcsunWB7" target="_blank" rel="noopener noreferrer" className="block hover:translate-x-2 transition-transform duration-500 text-left">
                      <address className="text-sm lg:text-lg font-medium text-brand-primary not-italic leading-relaxed max-w-sm text-left">
                        69, Shree, Darshan Industries, Kamrej Rd, near Amrut Udhyog Nagar, Laskana, Kamrej, <br /> Gujarat 394185, India.
                      </address>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="p-8 bg-brand-primary rounded-[30px] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10 text-left">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-secondary mb-1">Standard Hours</p>
                  <h4 className="text-lg font-serif italic mb-1">Mon - Sat: 9AM - 6PM</h4>
                  <p className="text-[10px] text-white/40">Sunday by Appointment only</p>
                </div>
                <Link href="/" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-primary transition-all">
                  <Icon icon="lucide:arrow-right" className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl mb-12 lg:mb-16">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
              <span className="text-brand-secondary font-bold text-[10px] tracking-[0.5em] uppercase">Locate Our Boutique</span>
              <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl lg:text-6xl font-serif font-bold text-brand-primary">Visit Our <span className="italic text-brand-secondary font-normal">Sanctuary</span></motion.h2>
          </div>
        </div>

        <div className="w-full lg:container lg:mx-auto lg:px-4 lg:max-w-7xl relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d94449.18127376684!2d72.81936390819972!3d21.243605459284446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be047eba400dc89%3A0xbe2a740041ca3b4d!2sSHREE%20SHYAM%20DARSHAN!5e0!3m2!1sen!2sin!4v1774776973865!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="lg:rounded-[40px] shadow-2xl"
          ></iframe>
        </div>
      </section>

    </div>
  );
}
