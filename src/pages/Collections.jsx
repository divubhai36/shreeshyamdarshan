import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import { motion } from 'framer-motion';
import { Filter, ChevronRight, LayoutGrid, List } from 'lucide-react';

export default function Collections() {
  const { categoryId } = useParams();
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  
  const category = productData.categories.find(c => c.id === categoryId);
  const products = productData.products.filter(p => category?.subCategories.includes(p.category));
  
  const filteredProducts = activeSubCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeSubCategory);

  useEffect(() => {
    setActiveSubCategory('all');
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category) return <div>Category not found.</div>;

  return (
    <div className="min-h-screen bg-white lg:bg-brand-accent/30">
      <Header />
      
      {/* Category Banner */}
      <div className="relative h-[250px] lg:h-[500px] overflow-hidden bg-brand-primary">
        <motion.div
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5 }}
           className="w-full h-full"
        >
          <img 
             src={category.image} 
             alt={category.label} 
             className="w-full h-full object-cover opacity-60 brightness-75 scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-3 mb-4 lg:mb-8"
           >
              <div className="h-[1px] w-8 lg:w-12 bg-brand-secondary/40"></div>
              <p className="text-[9px] lg:text-sm tracking-[0.4em] lg:tracking-[0.6em] font-bold uppercase text-brand-secondary drop-shadow-lg">
                Premium Selection
              </p>
              <div className="h-[1px] w-8 lg:w-12 bg-brand-secondary/40"></div>
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-4xl lg:text-9xl font-serif font-bold text-white mb-6 lg:mb-10 drop-shadow-2xl"
           >
             {category.label}
           </motion.h1>
           <div className="flex items-center gap-2 text-[8px] lg:text-xs font-bold uppercase tracking-[0.2em] lg:tracking-widest text-white/50 backdrop-blur-sm bg-black/10 px-4 py-2 lg:px-6 lg:py-3 rounded-full">
             <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
             <ChevronRight size={12} className="lg:w-[14px]" />
             <span>Collections</span>
             <ChevronRight size={12} className="lg:w-[14px]" />
             <span className="text-brand-secondary">{category.label}</span>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-24 flex flex-col lg:row gap-8 lg:gap-20">
        
        {/* Horizontal Filters for Mobile, Sidebar for Desktop */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-32">
            <h3 className="hidden lg:flex text-2xl font-serif font-bold text-brand-primary mb-10 pb-4 border-b border-brand-primary/5 uppercase tracking-widest items-center gap-3">
              <Filter size={20} className="text-brand-secondary" /> Navigation
            </h3>
            
            <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto pb-4 lg:pb-0 px-2 lg:px-0 no-scrollbar snap-x">
               <button 
                  onClick={() => setActiveSubCategory('all')}
                  className={`flex-shrink-0 lg:w-full text-center lg:text-left py-2 px-6 lg:px-6 lg:py-4 rounded-full lg:rounded-2xl transition-all duration-300 text-[9px] lg:text-sm font-bold uppercase tracking-widest snap-start ${activeSubCategory === 'all' ? 'bg-brand-primary text-white shadow-xl scale-105 lg:scale-100' : 'bg-brand-accent/50 lg:bg-transparent text-brand-primary/40 hover:text-brand-secondary border border-transparent lg:border-brand-primary/5'}`}
               >
                 All Designs
               </button>
               {category.subCategories.slice(0, 10).map((sub, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`flex-shrink-0 lg:w-full text-center lg:text-left py-2 px-6 lg:px-6 lg:py-4 rounded-full lg:rounded-2xl transition-all duration-300 text-[9px] lg:text-sm font-bold uppercase tracking-widest capitalize snap-start ${activeSubCategory === sub ? 'bg-brand-primary text-white shadow-xl scale-105 lg:scale-100' : 'bg-brand-accent/50 lg:bg-transparent text-brand-primary/40 hover:text-brand-secondary border border-transparent lg:border-brand-primary/5'}`}
                 >
                    {sub.replace('LADDU GOPAL ', '').toLowerCase()}
                 </button>
               ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-grow">
          <div className="flex items-center justify-between mb-8 lg:mb-16 pb-4 lg:pb-8 border-b border-brand-primary/5">
             <div className="flex flex-col gap-1 lg:gap-2">
                <p className="text-[9px] lg:text-xs text-brand-primary/40 font-bold uppercase tracking-[0.2em]">Curated divinity</p>
                <p className="text-xl lg:text-3xl font-serif font-bold text-brand-primary leading-tight">Showing <span className="text-brand-secondary">{filteredProducts.length}</span> Masterpieces</p>
             </div>
             
             <div className="hidden lg:flex items-center gap-6 text-brand-primary/20 bg-brand-accent/50 p-2 rounded-2xl border border-brand-primary/5">
                <div className="w-12 h-12 flex items-center justify-center bg-white text-brand-primary rounded-xl shadow-lg cursor-pointer">
                   <LayoutGrid size={22} />
                </div>
                <div className="w-12 h-12 flex items-center justify-center hover:bg-white hover:text-brand-primary rounded-xl transition-all cursor-pointer">
                   <List size={24} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="h-full"
              >
                <Link to={`/product/${p.id}`} className="h-full block">
                  <ProductCard product={p} />
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-32 lg:py-60 text-center flex flex-col items-center gap-8"
            >
               <div className="w-24 h-24 lg:w-32 lg:h-32 bg-brand-accent rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={48} className="text-brand-primary/10 lg:w-[64px] lg:h-[64px]" />
               </div>
               <div>
                  <p className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary/30 italic mb-4">No collections found here yet.</p>
                  <p className="text-[10px] lg:text-xs text-brand-primary/20 font-bold uppercase tracking-[0.3em] mb-12">New styles arriving in the next muhurta</p>
                  <button onClick={() => setActiveSubCategory('all')} className="px-10 py-4 bg-brand-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-secondary transition-all shadow-xl">
                    View All Items
                  </button>
               </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
