import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ label, image, href, count, index }) => {
  return (
    <Link to={href} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.6 }}
        className="group relative overflow-hidden rounded-[24px] lg:rounded-[40px] aspect-[3/4] shadow-lg bg-white border border-brand-primary/5 h-full"
      >
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 bg-gradient-to-t from-brand-primary/95 via-brand-primary/40 to-transparent flex flex-col items-center justify-end text-center z-10 h-1/2">
          <h3 className="text-lg lg:text-2xl font-serif font-bold text-white mb-2 lg:mb-3 transition-transform group-hover:-translate-y-1 uppercase tracking-wider">{label}</h3>
          
          {count !== undefined && (
            <p className="hidden lg:block text-[9px] text-brand-secondary font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 mb-4">
              {count} {count === 1 ? 'Category' : 'Categories'}
            </p>
          )}
          
          <div className="px-4 py-2 lg:px-6 lg:py-2.5 bg-white text-brand-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-widest rounded-full group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300 shadow-md">
            Shop
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
