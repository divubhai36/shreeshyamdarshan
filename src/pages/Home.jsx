import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, LayoutGrid, Clock, ShieldCheck, Truck, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  const products = productData.products;
  const categories = productData.categories;
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen bg-brand-accent overflow-x-hidden">
      <Header />
      <Hero />

      {/* Categories Showcase (Best Collections) */}
      <section className="py-6 lg:py-10 container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-4 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 lg:gap-4 mb-2 lg:mb-3 text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] lg:tracking-[0.5em] uppercase"
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
            className="text-3xl lg:text-6xl font-serif font-bold text-brand-primary leading-tight uppercase"
          >
            Best <span className="italic font-normal">Collections</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {categories.map((cat, index) => (
            <Link key={cat.id} to={`/collections/${cat.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className="group relative overflow-hidden rounded-[24px] lg:rounded-[40px] aspect-[3/4] shadow-lg bg-white border border-brand-primary/5"
              >
                <img
                   src={cat.image}
                   alt={cat.label}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 bg-gradient-to-t from-brand-primary/95 via-brand-primary/40 to-transparent flex flex-col items-center justify-end text-center z-10">
                   <h3 className="text-lg lg:text-2xl font-serif font-bold text-white mb-2 lg:mb-3 transition-transform group-hover:-translate-y-1">{cat.label}</h3>
                   <p className="hidden lg:block text-[9px] text-brand-secondary font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 mb-4">
                      {cat.subCategories.length} Categories
                   </p>
                   <div className="px-4 py-2 lg:px-6 lg:py-2.5 bg-white text-brand-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-widest rounded-full group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300 shadow-md">
                      Shop
                   </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Seller Featured Section */}
      <section className="py-6 lg:py-10 bg-white/50 backdrop-blur-sm border-y border-brand-primary/5">
          <div className="container mx-auto px-4 max-w-7xl">
             <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-4 lg:mb-6 gap-4 text-center md:text-left">
                <div>
                   <p className="text-brand-secondary font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-2 lg:mb-3">Trending Now</p>
                   <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary leading-tight uppercase">Handpicked <br className="hidden md:block" /> <span className="italic font-normal">Best Sellers</span></h2>
                </div>
                <Link to="/collections/dresses" className="hidden md:flex btn-outline group text-xs py-2 px-5 rounded-full">
                   View All
                   <ArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" size={14} />
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
                    <Truck size={24} className="text-brand-secondary group-hover:scale-110 transition-transform lg:w-8 lg:h-8" />
                 </div>
                 <div>
                    <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase">Express Delivery</h3>
                    <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium">Fast and secure shipping across India for your divine orders.</p>
                 </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 lg:gap-6">
                 <div className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center bg-white/5 rounded-2xl lg:rounded-[30px] border border-white/10 backdrop-blur-xl shadow-xl group hover:border-brand-secondary/50 transition-all">
                    <ShieldCheck size={24} className="text-brand-secondary group-hover:scale-110 transition-transform lg:w-8 lg:h-8" />
                 </div>
                 <div>
                    <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase">Pure Handcraft</h3>
                    <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium">Each Poshak is manually stitched with premium traditional fabrics.</p>
                 </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-4 lg:gap-6">
                 <div className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center bg-white/5 rounded-2xl lg:rounded-[30px] border border-white/10 backdrop-blur-xl shadow-xl group hover:border-brand-secondary/50 transition-all">
                    <ShoppingBag size={24} className="text-brand-secondary group-hover:scale-110 transition-transform lg:w-8 lg:h-8" />
                 </div>
                 <div>
                    <h3 className="text-base lg:text-xl font-serif font-bold tracking-wide mb-1 lg:mb-2 uppercase">Custom Sizes</h3>
                    <p className="text-white/40 text-[9px] lg:text-xs leading-relaxed max-w-xs font-medium">Available from size 0 to 6 for all Laddu Gopal ji's needs.</p>
                 </div>
              </motion.div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 lg:py-20 bg-brand-accent overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center text-center max-w-7xl">
             <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                <span className="h-[1px] w-8 lg:w-12 bg-brand-secondary/30"></span>
                <h2 className="text-lg lg:text-2xl font-serif font-bold text-brand-primary tracking-widest uppercase">LADDU GOPAL</h2>
                <span className="h-[1px] w-8 lg:w-12 bg-brand-secondary/30"></span>
             </div>
             <p className="text-brand-primary/50 text-[10px] lg:text-sm italic mb-10 lg:mb-12 max-w-xl leading-relaxed px-4">
               "Adorning Divinity with Elegance and Love. Premium Handcrafted Poshaks for every special occasion."
             </p>

             <div className="flex justify-center gap-6 lg:gap-10 mb-10 lg:mb-12 text-brand-primary/40 uppercase text-[8px] lg:text-[10px] font-bold tracking-widest">
                <a href="#" className="hover:text-brand-secondary transition-all">Privacy</a>
                <a href="#" className="hover:text-brand-secondary transition-all">Shipping</a>
                <a href="#" className="hover:text-brand-secondary transition-all">Terms</a>
                <a href="#" className="hover:text-brand-secondary transition-all">Contact</a>
             </div>

             <div className="text-[8px] lg:text-[11px] text-brand-primary/20 font-bold border-t border-brand-primary/5 pt-8 w-full uppercase tracking-widest">
               © 2026 Laddu Gopal Poshak Outlet • Crafted for Devotion
             </div>
          </div>
      </footer>
    </div>
  );
}

export default Home;
