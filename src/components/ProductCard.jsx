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

        {/* Offer Badge - Boutique Aura Pill */}
        {product.isOfferProduct && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-2 bg-red-500/80 backdrop-blur-md px-2 py-1 lg:px-4 lg:py-2 rounded-full border border-white/10 shadow-2xl z-10"
          >
            <span className="text-white text-[7px] lg:text-[9px] md:font-bold uppercase tracking-[0.2em]">
              Offer
            </span>
          </motion.div>
        )}

        {/* Best Seller Badge - Boutique Aura Pill */}
        {product.isBestSeller && !product.isOfferProduct && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-2 bg-brand-primary/80 backdrop-blur-md px-2 py-1 lg:px-4 lg:py-2 rounded-full border border-white/10 shadow-2xl z-10"
          >
            <span className="text-white text-[7px] lg:text-[9px] md:font-bold uppercase tracking-[0.2em]">
              Best Seller
            </span>
          </motion.div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 lg:bottom-3 lg:left-3 px-2 py-1 lg:px-4 lg:py-2 bg-brand-primary/90 text-white font-bold rounded-full text-[10px] lg:text-sm backdrop-blur-sm shadow-xl z-10">
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
