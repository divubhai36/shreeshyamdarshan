import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import productData from '../data/products.json';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ArrowLeft, ChevronRight, Star, Clock, Eye } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const product = productData.products.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Product not found.</div>;

  const categoryContext = productData.categories.find(c => c.subCategories.includes(product.category));

  return (
    <div className="min-h-screen bg-brand-accent pb-12 lg:pb-20">
      <Header />

      <div className="container mx-auto px-4 pt-20 lg:pt-32 max-w-7xl">

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 mb-6 lg:mb-10">
           <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
           <ChevronRight size={12} className="shrink-0" />
           {categoryContext && (
             <>
               <Link to={`/collections/${categoryContext.id}`} className="hover:text-brand-secondary transition-colors uppercase truncate max-w-[100px] lg:max-w-none">
                 {categoryContext.label}
               </Link>
               <ChevronRight size={12} className="shrink-0" />
             </>
           )}
           <span className="text-brand-primary/60 truncate max-w-[150px] lg:max-w-none">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

           {/* Left: Product Images Area (5/12 cols) */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/5] overflow-hidden rounded-[30px] lg:rounded-[50px] bg-white shadow-2xl group border border-brand-primary/5 p-3 lg:p-4"
           >
              <img
                 src={product.image}
                 alt={product.name}
                 className="w-full h-full object-cover rounded-[20px] lg:rounded-[40px] group-hover:scale-105 transition-transform duration-[2000ms]"
              />
           </motion.div>

           {/* Right: Product Details Area (7/12 cols) */}
           <div className="lg:col-span-7 flex flex-col justify-center lg:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 lg:mb-10"
              >
                 <p className="text-brand-secondary font-bold text-[10px] lg:text-sm tracking-[0.3em] uppercase mb-3 lg:mb-4 border-l-2 border-brand-secondary pl-3 lg:pl-4">{product.category}</p>
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-primary leading-[1.1] mb-4 lg:mb-6">{product.name}</h1>

                 <div className="flex items-center gap-4 mb-4">
                    <div className="flex text-brand-secondary">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-brand-primary/40 font-bold tracking-widest uppercase italic">Divine Selection</span>
                 </div>

                 <p className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary">₹{product.price}</p>
                 <p className="text-[9px] text-brand-primary/40 font-medium uppercase tracking-widest mt-2 leading-relaxed">Available for display in our boutique showroom. Please visit our outlet for customized pricing and bulk orders.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8 lg:space-y-10"
              >
                 <p className="text-brand-primary/70 text-sm lg:text-base leading-relaxed lg:leading-[1.8] max-w-2xl">
                    {product.description}
                 </p>

                 {/* Size List (Showcase only) */}
                 {product.sizes && (
                   <div className="space-y-3 lg:space-y-4">
                      <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-brand-primary">Available Sizes</p>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                         {product.sizes.map((size) => (
                           <div
                               key={size}
                               className="min-w-[40px] lg:min-w-[50px] px-3 py-2 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl border border-brand-primary/10 font-bold text-xs lg:text-sm tracking-widest bg-white text-brand-primary/60 flex items-center justify-center transition-all"
                           >
                             {size}
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* Info Box */}
                 <div className="p-5 lg:p-7 bg-brand-primary/5 rounded-[20px] lg:rounded-[30px] border border-brand-primary/5">
                    <p className="text-[9px] lg:text-[11px] font-bold text-brand-primary uppercase tracking-widest leading-relaxed">
                      Craftsmanship: This item is a masterpiece of traditional Indian craftsmanship. Each set is manually handcrafted using premium fabrics and intricate detailing to adorn your divine deity with the utmost grace.
                    </p>
                 </div>

                 {/* Icon Grid */}
                 <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-4 lg:pt-6 border-t border-brand-primary/5">
                    <div className="flex flex-col items-center text-center gap-2 lg:gap-3">
                       <ShieldCheck size={20} className="text-brand-secondary lg:w-6 lg:h-6" />
                       <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">Premium Fabric</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 lg:gap-3">
                       <Clock size={20} className="text-brand-secondary lg:w-6 lg:h-6" />
                       <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">Hand Stitched</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 lg:gap-3">
                       <Star size={20} className="text-brand-secondary lg:w-6 lg:h-6" />
                       <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">Divine Quality</p>
                    </div>
                 </div>

                 {/* Back Button */}
                 <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-brand-secondary font-bold text-[9px] lg:text-[11px] uppercase tracking-widest hover:-translate-x-2 transition-transform duration-500"
                 >
                    <ArrowLeft size={16} />
                    Back to Collection
                 </Link>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}
