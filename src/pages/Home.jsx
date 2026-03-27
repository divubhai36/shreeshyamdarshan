import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import CategoryCard from '../components/CategoryCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ReviewMarquee from '../components/ReviewMarquee';

function Home() {
   const products = productData.products;
   const categories = productData.categories;
   const bestSellers = products.filter(p => p.isBestSeller);

   return (
      <div className="min-h-screen bg-brand-accent overflow-x-hidden text-left">
         <Header />
         <Hero />

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
                  className="text-3xl lg:text-6xl font-serif font-bold text-brand-primary leading-tight uppercase text-center"
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

         {/* Location Map Section */}
         <section className="py-12 lg:py-20 bg-white border-t border-brand-primary/5">
            <div className="container mx-auto px-4 max-w-7xl mb-10 lg:mb-16">
               <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-4 mb-4"
                  >
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                     <span className="text-brand-secondary font-bold text-[10px] tracking-[0.5em] uppercase">Visit Our Boutique</span>
                     <div className="h-[1px] w-12 bg-brand-secondary/30"></div>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl lg:text-6xl font-serif font-bold text-brand-primary"
                  >
                    Locate <span className="italic text-brand-secondary font-normal uppercase">Us</span>
                  </motion.h2>
               </div>
            </div>

            <div className="container mx-auto max-w-7xl lg:px-4">
               <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="w-full h-[300px] lg:h-[500px] lg:rounded-[48px] overflow-hidden border-y lg:border border-brand-primary/5 relative z-10"
               >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.264449783075!2d72.9413192!3d21.2609972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0476bce35e253%3A0x32a44a274a6c13a8!2sNew%20Darshan%20Lace%20Laddu%20Gopal%20Poshak!5e0!3m2!1sen!2sin!4v1774638658474!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shree Shyam Darshan Boutique Location"
                  ></iframe>
               </motion.div>
            </div>
         </section>

         <Footer />
      </div>
   );
}

export default Home;
