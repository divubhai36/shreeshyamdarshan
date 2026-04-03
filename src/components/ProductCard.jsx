"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function ProductCard({ product }) {

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className="premium-card group relative flex flex-col h-full bg-white rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-brand-primary/5"
    >
      <div className="relative aspect-square lg:aspect-square overflow-hidden bg-brand-accent">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />

        {/* Badges */}
        {product.isBestSeller && (
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 h-6 px-2 lg:h-8 lg:px-4 flex items-center justify-center bg-brand-secondary text-white text-[7px] lg:text-[10px] uppercase font-bold tracking-widest rounded-full shadow-lg z-10">
                Best Seller
            </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 px-2 py-1 lg:px-4 lg:py-2 bg-brand-primary/90 text-white font-bold rounded-full text-[10px] lg:text-sm backdrop-blur-sm shadow-xl z-10">
           ₹{product.price}
        </div>
      </div>

      <div className="p-3 lg:p-4 flex-grow flex flex-col text-center">
        <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-brand-secondary/80 mb-1 lg:mb-2 line-clamp-1">
          {product.category}
        </p>

        <h3 className="text-xs lg:text-xl font-serif text-brand-primary font-bold mb-2 lg:mb-6 group-hover:text-brand-secondary transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* View Details Button (Replaces WhatsApp for showcase) */}
        {/* <Link
          href={`/product/${product.id}`}
          className="w-full mt-auto py-2 lg:py-3 bg-brand-accent text-brand-primary font-bold rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all text-[8px] lg:text-xs uppercase tracking-widest shadow-sm"
        >
          <Icon icon="lucide:eye" className="w-4 h-4" />
          View Details
        </Link> */}
      </div>
    </motion.div>
  );
}
