import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion } from 'framer-motion';
import navigationData from '../data/navigation.json';
import { Icon } from '@iconify/react';

import CategoryCard from '../components/CategoryCard';

export default function Collections() {
  const { categoryId } = useParams();

  // Find current category from navigation.json for accurate subcategories
  const navCategory = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
  const productCategory = productData.categories.find(c => c.id === categoryId);
  const category = navCategory || productCategory;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category) return <div className="pt-32 text-center text-xs tracking-widest text-brand-primary/40 uppercase">Category not found.</div>;

  const subCategories = category.subCategories || [];

  return (
    <div className="min-h-screen bg-brand-accent/30 overflow-x-hidden text-left">
      <Header />

      {/* Category Header Banner */}
      <div className="relative h-[250px] lg:h-[450px] overflow-hidden bg-brand-primary">
        <motion.div
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1.5 }}
           className="w-full h-full"
        >
          <img
             src={category.image}
             alt={category.name || category.label}
             className="w-full h-full object-cover opacity-40 brightness-50"
          />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 lg:pt-20 gap-4 lg:gap-8 text-center text-white px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.5em] uppercase mb-[-10px] lg:mb-[-20px] text-center"
            >
              Masterpiece Collection
            </motion.div>
            <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-4xl lg:text-7xl font-serif font-bold text-white tracking-widest uppercase text-center"
            >
              {category.name || category.label}
            </motion.h1>
           <div className="flex items-center gap-3 text-[7px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
              <Icon icon="lucide:chevron-right" className="w-3 h-3 text-white/20" />
              <span className="text-brand-secondary">{category.name || category.label}</span>
           </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-10 lg:py-20 max-w-7xl">
        <div className="flex flex-col items-center mb-10 lg:mb-16 text-center">
           <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">Explore Categories</div>
           <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center">Handpicked <span className="italic font-normal">Sub-Collections</span></h2>
           <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-6 lg:mt-8"></div>
        </div>

        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
            {subCategories.map((sub, index) => {
              const subName = typeof sub === 'string' ? sub : sub.name;
              const subId = typeof sub === 'string' ? sub : sub.id;
              const subImage = typeof sub === 'string' ? category.image : (sub.image || category.image);
              
              // Count products in this subcategory
              const productCount = productData.products.filter(p => {
                const productCat = p.category.toLowerCase();
                return productCat.includes(subName.toLowerCase()) || 
                       productCat.includes(subId.toLowerCase().replace(/-/g, ' '));
              }).length;

              return (
                <CategoryCard
                  key={subId}
                  index={index}
                  label={subName}
                  image={subImage}
                  href={`/category/${categoryId}/${subId}`}
                  count={productCount > 0 ? productCount : undefined}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-brand-primary/30 font-serif italic uppercase tracking-widest text-center">No sub-collections available.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
