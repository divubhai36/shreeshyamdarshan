"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { toggleSave, isProductSaved, isAuthenticated } = useCart();
  const saved = isProductSaved(product.id);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="premium-card group relative flex flex-col h-full bg-white rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(26,67,50,0.2)] transition-all duration-500 overflow-hidden border border-brand-primary/5"
    >
      {/* Classic Diagonal Best Seller Sash - Now Card Relative for Premium Look */}
      {product.isBestSeller && (
        <div className="absolute top-[-8px] right-[-12px] sm:top-0 sm:right-0 w-24 h-20 sm:w-24 sm:h-24 overflow-hidden z-30 pointer-events-none rounded-tr-2xl lg:rounded-tr-3xl">
          <div className="bg-red-600 text-white text-[6px] sm:text-[7px] font-black uppercase tracking-[0.2em] py-[2px] sm:py-1 w-[140%] text-center absolute top-6 -right-8 rotate-45 shadow-[0_5px_15px_rgba(220,38,38,0.4)] border-y border-white/10">
            Best Seller
          </div>
        </div>
      )}

      <Link href={`/product/${product.id}`} className="relative aspect-square lg:aspect-square overflow-hidden bg-brand-accent block m-2 lg:m-3 rounded-xl lg:rounded-2xl shadow-inner group/image border border-black/[0.03]">
        {/* Boutique Cinematic Reflective Shine Effect - TL to BR */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.02)_60%,transparent_100%)] -translate-x-[150%] -translate-y-[150%] group-hover:translate-x-[150%] group-hover:translate-y-[150%] transition-transform duration-3000 ease-in-out backdrop-blur-[1px]" />
        </div>

        <div className="relative w-full h-full">
          <Image
            src={product.images?.[0] || product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${product.images?.length > 1 ? 'group-hover:opacity-0' : ''}`}
          />

          {product.images?.length > 1 && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="absolute inset-0 object-cover scale-125 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out"
            />
          )}
        </div>

        {/* Price Tag - Added rounded-bl to fix sharp corners on desktop */}
        <div className="absolute bottom-0 left-0 px-2 py-1 lg:px-4 lg:py-2 bg-brand-primary/90 text-white font-bold rounded-tr-2xl rounded-bl-xl lg:rounded-bl-2xl text-[10px] lg:text-sm backdrop-blur-sm shadow-xl z-20 transition-all">
          {product.isOfferProduct && product.offerPrice ? `₹${product.offerPrice}` : `₹${product.price}`}
        </div>
      </Link>

      <div className="p-3 lg:p-4 flex-grow flex flex-col">
        <div className="text-center transition-all duration-500">
          <Link href={`/product/${product.id}`}>
            <p className="text-[7px] lg:text-[10px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-brand-secondary/80 mb-1 lg:mb-2 line-clamp-1">
              {product.category}
            </p>
          </Link>

          <div className="flex justify-between items-start gap-2 mb-2 lg:mb-6">
            <Link href={`/product/${product.id}`} className="grow">
              <h3 className="text-xs lg:text-xl font-serif text-brand-primary font-bold group-hover:text-brand-secondary transition-colors line-clamp-2 leading-tight text-left">
                {product.name}
              </h3>
            </Link>

            {isAuthenticated && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSave(product);
                }}
                className={`transition-all duration-300 shrink-0 ${
                  saved ? "text-rose-500" : "text-brand-primary/10 hover:text-brand-primary"
                }`}
              >
                <Icon
                  icon={saved ? "solar:heart-bold" : "solar:heart-linear"}
                  className={`w-5 h-5 lg:w-6 lg:h-6 ${saved ? "drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
