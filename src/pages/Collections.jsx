import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion, AnimatePresence } from 'framer-motion';
import navigationData from '../data/navigation.json';
import { Icon } from '@iconify/react';

import CategoryCard from '../components/CategoryCard';

export default function Collections() {
  const { categoryId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);

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
      {/* 3 column video section */}
      <section className="bg-white py-10 lg:py-24 border-b border-brand-primary/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center mb-2 lg:mb-16 text-center">
            <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">Brand Cinema</div>
            <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center text-left">The Art of <span className="italic font-normal">Craftsmanship</span></h2>
            <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-6 lg:mt-8"></div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:gap-10">
            {[
              { id: 1, url: "/videos/reel 3.mp4", title: "Royal Collection" },
              { id: 2, url: "/videos/reel4.mp4", title: "Artisan Work" },
              { id: 3, url: "/videos/reel 5.mp4", title: "Handwoven Silk" }
            ].map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveVideo(video.url)}
                className="group relative aspect-[9/16] overflow-hidden rounded-2xl lg:rounded-[40px] shadow-2xl cursor-pointer bg-brand-primary/5"
              >
                <video
                  src={video.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Icon icon="solar:play-bold" className="w-4 h-4 lg:w-6 lg:h-6 ml-1" />
                   </div>
                </div>
                <div className="absolute bottom-4 lg:bottom-10 left-0 right-0 text-center px-2 lg:px-4">
                   <p className="hidden md:block text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{video.title}</p>
                   <h3 className="text-[10px] md:text-xl font-serif text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 whitespace-nowrap overflow-hidden text-ellipsis">Watch Story</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Category section */}
      <main className="container mx-auto px-4 lg:px-8 py-10 lg:py-20 max-w-7xl">
        <div className="flex flex-col items-center mb-2 lg:mb-16 text-center">
          <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3 text-center">Explore Categories</div>
          <h2 className="text-2xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center text-left">Handpicked <span className="italic font-normal">Collections</span></h2>
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

      {/* Video Popup Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideo(null);
              }}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-brand-secondary transition-colors flex items-center justify-center text-white z-20 border border-white/10 shadow-2xl"
            >
              <Icon icon="lucide:x" className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[450px] aspect-[9/16] max-h-[90vh] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
               <video
                 src={activeVideo}
                 autoPlay
                 controls
                 playsInline
                 className="w-full h-full object-cover"
               />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
