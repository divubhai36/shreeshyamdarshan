"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function TermsClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Shree Shyam Darshan website, you agree to comply with and be bound by these Terms and Conditions. These terms apply to all visitors, users, and wholesalers who access our divine collections."
    },
    {
      title: "2. Handcrafted Product Disclaimer",
      content: "All our products are handcrafted by skilled artisans. Due to the artisanal nature of our craft, slight variations in color, embroidery patterns, and stone placement may occur compared to the images shown. These are not defects but markers of authentic craftsmanship."
    },
    {
      title: "3. Ordering & Confirmation",
      content: "Orders placed through our website or wholesaler portal are considered 'Inquiries' or 'Procurement Requests'. A contract is only formed once our concierge team confirms the availability and price via WhatsApp or email, and the agreed payment is received."
    },
    {
      title: "4. Pricing & Payments",
      content: "Prices listed on the website are subject to change without prior notice. As we do not have an integrated payment gateway, all payments must be settled through the manual methods (Bank Transfer, UPI, etc.) discussed during the WhatsApp confirmation process."
    },
    {
      title: "5. Shipping & Delivery",
      content: "We ship our masterpieces worldwide. Shipping costs are calculated based on weight, destination, and service type. While we strive for timely delivery, we are not responsible for delays caused by customs or carrier issues beyond our control."
    },
    {
      title: "6. Return & Exchange Policy",
      content: "Given the sacred and handcrafted nature of our deity attire, we generally do not accept returns or exchanges. In the rare case of receiving a damaged product, please notify us within 24 hours of delivery with unboxing videos/photos for a resolution."
    },
    {
      title: "7. Wholesaler Obligations",
      content: "Authorized wholesalers must maintain the premium branding of Shree Shyam Darshan. Access to the Wholesale Portal is a privilege and can be revoked if the B2B wholesaler agreements or Minimum Order Quantities (MOQ) are not met."
    },
    {
      title: "8. Intellectual Property",
      content: "All content, designs, images, and logos on this website are the property of Shree Shyam Darshan. Unauthorized use, reproduction, or distribution of our designs for commercial purposes is strictly prohibited."
    },
    {
      title: "9. Governing Law",
      content: "These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-accent pb-20">
      {/* Hero Section */}
      <section className="pt-32 lg:pt-48 pb-16 lg:pb-24 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('/images/hero_3.webp')] bg-cover bg-center mix-blend-overlay scale-110"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-brand-secondary font-bold tracking-[0.6em] uppercase mb-4 text-xs lg:text-sm">Service Agreement</p>
            <h1 className="text-4xl lg:text-7xl font-serif font-bold mb-6 leading-tight uppercase tracking-tight">Terms & <span className="text-brand-secondary italic">Conditions</span></h1>
            <div className="h-1 w-24 bg-brand-secondary mx-auto rounded-full mb-8" />
            <p className="text-white/60 text-sm lg:text-lg max-w-2xl mx-auto leading-relaxed italic">
              "Establishing a foundation of trust and clarity for every devotee and wholesaler we serve."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[40px] lg:rounded-[60px] p-8 lg:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-brand-primary/5"
          >
            <div className="space-y-12">
              {terms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative lg:pl-8 lg:border-l-2 border-brand-accent hover:border-brand-secondary transition-colors"
                >
                  <div className="hidden lg:block absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-accent border-2 border-white shadow-sm" />
                  <h2 className="text-lg lg:text-xl font-serif font-bold text-brand-primary uppercase tracking-wide mb-3">{term.title}</h2>
                  <p className="text-brand-primary/70 leading-relaxed text-sm lg:text-base">
                    {term.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 pt-12 border-t border-brand-primary/5 flex flex-col items-center gap-6">
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.4em]">Last Updated: April 2026</p>
              <div className="bg-brand-primary text-white px-8 py-4 rounded-2xl flex items-center gap-3">
                 <Icon icon="solar:shield-check-bold" className="text-brand-secondary w-6 h-6" />
                 <span className="text-xs font-bold uppercase tracking-widest">Verified B2B Standard</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
