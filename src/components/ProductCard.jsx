"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className="premium-card group relative flex flex-col h-full bg-white rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-brand-primary/5"
    >
      <Link href={`/product/${product.id}`} className="relative aspect-square lg:aspect-square overflow-hidden bg-brand-accent block m-2 lg:m-3 rounded-xl lg:rounded-2xl shadow-inner">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />

        {/* Classic Diagonal Best Seller Sash - High-Impact Red */}
        {product.isBestSeller && (
          <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-20 pointer-events-none">
            <div className="bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] py-1.5 w-[140%] text-center absolute top-4 -left-10 -rotate-45 shadow-[0_5px_15px_rgba(220,38,38,0.4)] border-y border-white/10">
              Best Seller
            </div>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 lg:bottom-0 lg:left-0 px-2 py-1 lg:px-4 lg:py-2 bg-brand-primary/90 text-white font-bold rounded-tr-2xl text-[10px] lg:text-sm backdrop-blur-sm shadow-xl z-10">
          {product.isOfferProduct && product.offerPrice ? `₹${product.offerPrice}` : `₹${product.price}`}
        </div>
      </Link>

      <div className="p-3 lg:p-4 flex-grow flex flex-col text-center">
        <Link href={`/product/${product.id}`}>
          <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-brand-secondary/80 mb-1 lg:mb-2 line-clamp-1">
            {product.category}
          </p>

          <h3 className="text-xs lg:text-xl font-serif text-brand-primary font-bold mb-2 lg:mb-6 group-hover:text-brand-secondary transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
      </div>
    </motion.div>
  );
}
