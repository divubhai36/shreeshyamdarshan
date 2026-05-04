"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function PrivacyPolicyClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Introduction",
      icon: "solar:info-circle-bold-duotone",
      content: "Welcome to Shree Shyam Darshan. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services for deity attire and shringar products."
    },
    {
      title: "2. Information We Collect",
      icon: "solar:user-id-bold-duotone",
      content: "We collect information that you provide directly to us when you inquire about products or register as a wholesaler. This includes:",
      list: [
        "Personal Details: Name, WhatsApp number, and contact information.",
        "Location Details: City and State for shipping and inquiry purposes.",
        "Order Information: Products of interest, quantities, and purchase history.",
        "Wholesaler Data: WhatsApp ID and private access codes for authorized portal access."
      ]
    },
    {
      title: "3. How We Use Your Information",
      icon: "solar:settings-bold-duotone",
      content: "Your information is used to provide a seamless divine experience:",
      list: [
        "To process and respond to your product inquiries via WhatsApp.",
        "To manage wholesaler accounts and provide access to the B2B portal.",
        "To improve our handcrafted collections and website functionality.",
        "To communicate order updates and spiritual masterpiece launches."
      ]
    },
    {
      title: "4. WhatsApp Integration & Payments",
      icon: "solar:chat-round-dots-bold-duotone",
      content: "Currently, we utilize WhatsApp as our primary communication and ordering channel. We do not integrate third-party payment gateways on this website. Payments are handled manually through discussed secure methods during our WhatsApp interaction. We never store your credit/debit card information on our servers."
    },
    {
      title: "5. Third-Party Analytics",
      icon: "solar:graph-bold-duotone",
      content: "We use (or plan to use) Google Analytics to understand how visitors interact with our website. These tools may collect data such as your IP address, browser type, and pages visited to help us optimize your browsing experience. No personally identifiable information is shared with these platforms without your consent."
    },
    {
      title: "6. Data Security",
      icon: "solar:shield-check-bold-duotone",
      content: "We implement robust security measures to protect your data. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet is 100% secure. We ensure that wholesaler access is restricted through private authentication codes."
    },
    {
      title: "7. International Users",
      icon: "solar:globus-bold-duotone",
      content: "As we serve devotees across the world, we strive to adhere to global privacy standards. If you are accessing our site from outside India, please be aware that your information may be transferred to and maintained on servers located in India, where privacy laws may differ from your jurisdiction."
    },
    {
      title: "8. Contact Us",
      icon: "solar:phone-bold-duotone",
      content: "For any questions regarding this Privacy Policy or your personal data, please contact our Concierge Desk:",
      contact: {
        phone: "+91 73836 99199",
        address: "69, Shree, Darshan Industries, Kamrej Rd, Laskana, Kamrej, Gujarat 394185, India."
      }
    }
  ];

  return (
    <div className="min-h-screen bg-brand-accent pb-20">
      {/* Hero Section */}
      <section className="pt-32 lg:pt-48 pb-16 lg:pb-24 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('/images/hero_2.webp')] bg-cover bg-center mix-blend-overlay scale-110"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-brand-secondary font-bold tracking-[0.6em] uppercase mb-4 text-xs lg:text-sm">Legal & Transparency</p>
            <h1 className="text-4xl lg:text-7xl font-serif font-bold mb-6 leading-tight uppercase tracking-tight">Privacy <span className="text-brand-secondary italic">Policy</span></h1>
            <div className="h-1 w-24 bg-brand-secondary mx-auto rounded-full mb-8" />
            <p className="text-white/60 text-sm lg:text-lg max-w-2xl mx-auto leading-relaxed italic">
              "At Shree Shyam Darshan, your trust is as sacred as our craft. We are dedicated to protecting your privacy with the same devotion we bring to our divine masterpieces."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[40px] lg:rounded-[60px] p-8 lg:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-brand-primary/5"
          >
            <div className="space-y-12 lg:space-y-16">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all duration-500">
                      <Icon icon={section.icon} className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary uppercase tracking-wide">{section.title}</h2>
                  </div>
                  
                  <div className="pl-1 lg:pl-16 space-y-4">
                    <p className="text-brand-primary/70 leading-relaxed text-sm lg:text-base">
                      {section.content}
                    </p>
                    
                    {section.list && (
                      <ul className="space-y-3 mt-6">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex gap-3 text-sm lg:text-base text-brand-primary/60">
                            <Icon icon="lucide:check" className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-8 p-6 lg:p-10 bg-brand-accent/50 rounded-[32px] border border-brand-primary/5 space-y-4">
                        <div className="flex items-center gap-4">
                          <Icon icon="solar:phone-bold" className="text-brand-secondary w-5 h-5" />
                          <a href={`tel:${section.contact.phone}`} className="font-bold text-brand-primary hover:text-brand-secondary transition-colors underline decoration-brand-secondary/30 underline-offset-4">{section.contact.phone}</a>
                        </div>
                        <div className="flex items-start gap-4">
                          <Icon icon="solar:map-point-bold" className="text-brand-secondary w-5 h-5 shrink-0 mt-1" />
                          <p className="text-sm text-brand-primary/60 leading-relaxed italic">{section.contact.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 pt-12 border-t border-brand-primary/5 text-center">
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.4em] mb-4">Last Updated: April 2026</p>
              <div className="inline-flex items-center gap-2 text-brand-secondary font-serif italic text-sm">
                <Icon icon="solar:shield-star-bold" className="w-5 h-5" />
                <span>Crafted for Devotion, Secured for Peace.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
