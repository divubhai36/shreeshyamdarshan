import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import productData from '../data/products.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import navigationData from '../data/navigation.json';

export default function ProductDetails() {
  const { id } = useParams();
  const product = productData.products.find(p => p.id === parseInt(id));

  // State Management
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState('size');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl bg-brand-accent text-brand-primary">
      Product not found.
    </div>
  );

  // Enhanced product images stack (Repeat main image + dummy for variety)
  const productImages = [
    product.image,
    product.image,
    "https://api.iconify.design/solar:chart-square-bold.svg?color=%238a6a4c" // Dummy size chart ref
  ];

  // Resolve Category and SubCategory from navigationData
  const navCategory = navigationData.find(c =>
    c.subCategories.some(sub =>
      sub.name.toLowerCase() === product.category.toLowerCase() ||
      sub.id.toLowerCase() === product.category.toLowerCase()
    )
  );

  const subCategory = navCategory?.subCategories.find(sub =>
    sub.name.toLowerCase() === product.category.toLowerCase() ||
    sub.id.toLowerCase() === product.category.toLowerCase()
  );

  const handleWhatsApp = () => {
    const phone = "917383699199";
    const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Inquiry from Website:\n------------------\n*Product:* ${product.name}\n*Quantity:* ${quantity} pcs\n------------------\nPlease help me with the details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Accordion Item Component
  const AccordionItem = ({ id, title, icon, children }) => {
    const isOpen = activeAccordion === id;
    return (
      <div className="border-b border-brand-primary/5">
        <button
          onClick={() => setActiveAccordion(isOpen ? null : id)}
          className="w-full py-6 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4">
             <Icon icon={icon} className={`w-5 h-5 transition-colors ${isOpen ? 'text-brand-secondary' : 'text-brand-primary/40 group-hover:text-brand-primary'}`} />
             <span className={`text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.2em] transition-colors ${isOpen ? 'text-brand-primary' : 'text-brand-primary/50 group-hover:text-brand-primary'}`}>
                {title}
             </span>
          </div>
          <Icon icon="lucide:chevron-down" className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-secondary' : 'text-brand-primary/20'}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-1 pb-10 overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-accent pb-20 lg:pb-32 text-left">
      <Header />

      <div className="container mx-auto px-4 pt-16 lg:pt-24 max-w-7xl">
        
        {/* Modern Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-[10px] items-start mb-8 lg:mb-12 text-brand-primary/20 font-bold uppercase tracking-[0.2em] w-full">
          <Link to="/" className="hover:text-brand-secondary transition-colors shrink-0">Home</Link>
          <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
          {navCategory && (
            <>
              <Link to={`/collections/${navCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                {navCategory.name}
              </Link>
              <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
            </>
          )}
          {subCategory && (
            <>
              <Link to={`/category/${navCategory.id}/${subCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                {subCategory.name}
              </Link>
              <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
            </>
          )}
          <span className="text-brand-primary/60 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* Left: Gallery (6/12 cols) */}
          <div className="space-y-6 lg:sticky lg:top-24">
             <motion.div
               key={activeImageIdx}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] bg-white border border-brand-primary/5"
             >
                <img 
                  src={productImages[activeImageIdx]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute top-5 left-5 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-bold uppercase tracking-[0.3em] text-brand-primary shadow-sm">
                   Boutique Choice
                </div>
             </motion.div>

             {/* Thumbnail Reel (Larger) */}
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`shrink-0 w-18 h-24 md:w-24 md:h-32 rounded-2xl overflow-hidden border-2 p-1 transition-all duration-500 ${
                      activeImageIdx === idx ? 'border-brand-secondary shadow-lg -translate-y-1' : 'border-transparent opacity-40 grayscale-[20%]'
                    }`}
                  >
                     <img src={img} className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
             </div>
          </div>

          {/* Right: Info (6/12 cols) */}
          <div className="flex flex-col pt-0 lg:pl-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-left w-full">
               
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-6 bg-brand-secondary"></div>
                  <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.3em]">{product.category}</span>
               </div>

               <h1 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-6 lg:mb-8 tracking-tight text-left">
                  {product.name}
               </h1>
               
               <div className="flex items-center gap-6 mb-8 lg:mb-12 text-left">
                  <span className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary">₹{product.price}</span>
                  <div className="h-8 w-px bg-brand-primary/10"></div>
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Direct Inquiry</span>
                     <span className="text-[8px] font-medium text-brand-primary/30 uppercase tracking-[0.2em]">Crafted to Order</span>
                  </div>
               </div>

               {/* Description */}
               <div className="mb-12 text-left">
                  <p className="text-brand-primary/60 text-[14px] lg:text-[16px] leading-relaxed font-serif italic mb-8">
                     "{product.description} This piece is a testimony to our generations of craftsmanship. Individually tailored with soul, using only the finest threads for true divinity."
                  </p>
                  
                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6 py-8 border-y border-brand-primary/5 text-left">
                     {[
                        { label: 'Fabric', value: product.material || 'Premium Art Silk' },
                        { label: 'Embroidery', value: 'Traditional Zardosi' },
                        { label: 'Colour', value: product.color || 'Vibrant Festive' },
                        { label: 'Included', value: 'Full Poshak Set' }
                     ].map((info, i) => (
                        <div key={i} className="space-y-1 text-left">
                           <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">{info.label}</p>
                           <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">{info.value}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Info Box - Old Version */}
               <div className="p-5 lg:p-7 bg-brand-primary/5 rounded-[20px] lg:rounded-[30px] border border-brand-primary/5 text-left inline-flex items-center justify-between gap-6 lg:gap-10 w-fit max-w-full cursor-pointer mb-10" onClick={handleWhatsApp}>
                 <p className="text-[9px] lg:text-[11px] font-bold text-brand-primary uppercase tracking-widest leading-relaxed text-left whitespace-nowrap">
                   For more inquiry Contact on Whatsapp
                 </p>
                 <button
                   onClick={handleWhatsApp}
                   className="bg-brand-primary text-white py-4 lg:py-5 px-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs lg:text-sm flex items-center justify-center gap-4 shadow-xl hover:bg-brand-secondary hover:translate-y-[-4px] transition-all active:scale-[0.98] group shrink-0"
                 >
                   <Icon icon="logos:whatsapp-icon" className="w-5 h-5 lg:w-6 lg:h-6" />
                 </button>
               </div>
               {/* Integrated Accordions (Tighter) */}
               <div className="space-y-0 text-left">
                  <AccordionItem id="size" title="Size Guide" icon="lucide:ruler">
                     <div className="bg-white/50 p-6 rounded-2xl border border-brand-primary/5 mt-0 overflow-x-auto">
                        <table className="w-full text-left text-[10px] lg:text-[12px]">
                           <thead>
                              <tr className="border-b border-brand-primary/10">
                                 <th className="py-3 pr-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">No.</th>
                                 <th className="py-3 px-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Height</th>
                                 <th className="py-3 pl-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Dress</th>
                              </tr>
                           </thead>
                           <tbody className="text-brand-primary/80">
                              {[
                                 { n: '0', h: '1.75"', d: '4"' },
                                 { n: '1', h: '2.20"', d: '6"' },
                                 { n: '2', h: '2.75"', d: '6"' },
                                 { n: '3', h: '3.15"', d: '8"' },
                                 { n: '4', h: '3.40"', d: '8"' },
                                 { n: '5', h: '3.80"', d: '10"' },
                                 { n: '6', h: '4.40"', d: '12"' }
                              ].map((row, i) => (
                                 <tr key={i} className="border-b border-brand-primary/5 last:border-0 hover:bg-brand-secondary/[0.01]">
                                    <td className="py-3 pr-4 font-bold text-brand-secondary">{row.n} No.</td>
                                    <td className="py-3 px-4">{row.h}</td>
                                    <td className="py-3 pl-4 font-medium">{row.d}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </AccordionItem>

                  <AccordionItem id="wash" title="Wash & Care" icon="lucide:droplets">
                     <div className="space-y-4 px-2 py-4 text-left">
                        {[
                           'Dry clean only recommended.',
                           'Store in a breathable cloth cover.',
                           'Dust off lightly with a soft brush.',
                           'Avoid direct spray of perfumes.',
                           'Air every 3-4 months.'
                        ].map((item, i) => (
                           <div key={i} className="flex gap-4 items-start text-left">
                              <span className="w-5 h-5 rounded-full bg-brand-secondary/5 flex items-center justify-center text-brand-secondary font-bold text-[9px] shrink-0">{i+1}</span>
                              <p className="text-[11px] lg:text-[12px] font-serif text-brand-primary/70 leading-relaxed text-left">{item}</p>
                           </div>
                        ))}
                     </div>
                  </AccordionItem>
               </div>

               {/* Back Buttons */}
               <div className="flex flex-wrap gap-x-4 gap-y-3 pt-10 mt-10 border-t border-brand-primary/5 text-left">
                  {subCategory && (
                    <Link
                      to={`/category/${navCategory.id}/${subCategory.id}`}
                      className="px-6 py-3 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-3 group"
                    >
                      <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                      Back to {subCategory.name}
                    </Link>
                  )}
                  {navCategory && (
                    <Link
                      to={`/collections/${navCategory.id}`}
                      className="px-6 py-3 border border-brand-primary/10 text-brand-primary/60 text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-primary/5 hover:text-brand-primary transition-all flex items-center gap-2"
                    >
                      <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
                      Back to {navCategory.name}
                    </Link>
                  )}
               </div>

            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}