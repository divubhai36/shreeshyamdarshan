"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import productData from '../data/products.json';
import navigationData from '../data/navigation.json';

import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, saved = [] } = useCart();

  // Hide on Admin, Login and Dashboard pages to prevent layout conflicts
  const isExcluded = pathname.startsWith('/admin') || pathname === '/login'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // Close account menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    setActiveCategory(null);

    const cookies = document.cookie.split(';');
    // Check for the UI visibility cookie (since user_session is httpOnly)
    const hasUserSession = cookies.some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
    const hasAdminSession = cookies.some((item) => item.trim().startsWith('admin_session='));

    // Check localStorage fallback for users
    const storedUser = localStorage.getItem('ssd_user');

    setIsLogged(hasUserSession || hasAdminSession || !!storedUser);
    setIsAdmin(hasAdminSession);
  }, [pathname]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Handle debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = { products: [], collections: [] }, isFetching: isSearching } = useQuery({
    queryKey: ['products-search', debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.length < 2) return { products: [], collections: [] };
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedSearchQuery.length >= 2,
    placeholderData: (prev) => prev || { products: [], collections: [] },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });


  if (isExcluded) return null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-brand-primary/5">
        <div className="w-full px-2 lg:px-8 h-16 lg:h-20 flex items-center justify-between mx-auto">

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-primary">
            <Icon icon="lucide:menu" className="w-6 h-6" />
          </button>

          {/* Logo (Centered on mobile) */}
          <Link href="/" className="flex flex-col items-center group scale-[0.85] lg:scale-100 mx-auto lg:mx-0 lg:order-first min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-xl font-serif font-bold text-brand-primary tracking-[0.02em] sm:tracking-[0.05em] lg:tracking-[0.1em] uppercase group-hover:text-brand-secondary transition-colors whitespace-nowrap">
              SHREE SHYAM <span className="text-brand-secondary">DARSHAN</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] font-medium text-brand-primary/40 uppercase whitespace-nowrap">
              laddu gopal poshak and shringar
            </p>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-0 text-[9px] uppercase tracking-widest font-bold text-brand-primary/70 scale-95 origin-center">
            {isLogged && (
              <div className="flex items-center gap-2">
                <Link href="/wholesalers/dashboard/collection/offers" className="px-3 py-2 text-white bg-brand-primary rounded-full flex items-center gap-2 group relative">
                  Discount Offers
                  <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-secondary  scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 rounded-full"></span>
                </Link>
                <Link href="/wholesalers/dashboard/collection/ready-stock" className="px-3 py-2 text-white bg-brand-primary rounded-full flex items-center gap-2 group relative">
                  Ready Stock
                  <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 rounded-full"></span>
                </Link>
              </div>
            )}
            {navigationData.map((cat) => (
              <div
                key={cat.id}
                className="relative h-20 flex items-center px-3"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className={`relative flex items-center gap-1.5 py-2 transition-all duration-300 group ${activeCategory === cat.id ? 'text-brand-secondary' : 'hover:text-brand-secondary'}`}>
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {cat.name}
                  </span>
                  <Icon icon="lucide:chevron-down" className={`w-3 h-3 transition-all duration-500 ${activeCategory === cat.id ? 'rotate-180 text-brand-secondary scale-125' : 'group-hover:translate-y-0.5'}`} />

                  {/* Modern Floating Underline */}
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-secondary rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                {/* Integrated Mega Menu Integration */}
                <AnimatePresence>
                  {activeCategory === cat.id && (
                    <>
                      {/* Background Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 top-20 bg-brand-primary/5 backdrop-blur-[2px] z-40"
                      />

                      {/* Mega Menu Panel */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-20 left-0 w-full bg-white border-b border-brand-primary/10 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="container mx-auto px-10 py-12 max-w-7xl">
                          <div className="grid grid-cols-12 gap-10">

                            {/* Left: Category Info */}
                            <div className="col-span-3 border-r border-brand-primary/5 pr-10">
                              <h3 className="text-2xl font-serif font-bold text-brand-primary mb-3 uppercase tracking-tight">
                                {cat.name}
                              </h3>
                              <p className="text-[10px] font-medium text-brand-primary/40 uppercase tracking-[0.2em] leading-relaxed mb-6">
                                Discover our exclusive collection of {cat.name.toLowerCase()} handcrafted for divinity.
                              </p>
                              <Link
                                href={`/collections/${cat.id}`}
                                className="group/btn inline-flex items-center gap-3 bg-brand-primary text-white px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand-secondary transition-all"
                              >
                                View All
                                <Icon icon="lucide:arrow-right" className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </div>

                            {/* Right: Subcategories Grid */}
                            <div className="col-span-9">
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  visible: { transition: { staggerChildren: 0.03 } }
                                }}
                                className={`grid gap-x-8 gap-y-1 ${cat.subCategories.length > 20 ? 'grid-cols-4' :
                                  cat.subCategories.length > 10 ? 'grid-cols-3' :
                                    'grid-cols-2'
                                  }`}
                              >
                                {cat.subCategories.map((sub, sIdx) => (
                                  <motion.div
                                    key={sub.name}
                                    variants={{
                                      hidden: { opacity: 0, y: 5 },
                                      visible: { opacity: 1, y: 0 }
                                    }}
                                  >
                                    <Link
                                      href={`/category/${cat.id}/${sub.id}`}
                                      className="group/item flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-brand-accent transition-all duration-300"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/20 group-hover/item:bg-brand-secondary group-hover/item:scale-125 transition-all duration-300"></div>
                                      <span className="text-[11px] font-bold tracking-[0.1em] text-brand-primary/70 group-hover/item:text-brand-primary transition-colors uppercase">
                                        {sub.name}
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link href="/contact-us" className="px-1.5 py-2 hover:text-brand-secondary transition-colors relative group whitespace-nowrap">
              Contact us
              <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 lg:space-x-3 text-brand-primary lg:order-last">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-brand-secondary transition-colors">
              <Icon icon="solar:magnifer-linear" className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            <div className="relative group/acc" ref={accountRef}>
              {isLogged ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className={`p-2 transition-all duration-300 rounded-full hover:text-brand-secondary hover:bg-brand-primary/5 ${isAccountMenuOpen ? 'text-brand-secondary bg-brand-primary/5' : 'text-brand-primary'}`}
                  >
                    <Icon icon="solar:user-circle-linear" className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="p-2 hover:text-brand-secondary transition-colors">
                  <Icon icon="solar:user-circle-linear" className="w-5 h-5 lg:w-6 lg:h-6" />
                </Link>
              )}
              <AnimatePresence>
                {isAccountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white border border-brand-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl z-50 overflow-hidden text-left"
                  >
                    <div className="p-6 border-b border-brand-primary/5 bg-brand-primary/2">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary mb-1">Account Control</p>
                      <h4 className="text-sm font-serif font-bold text-brand-primary uppercase leading-1.5 tracking-wider">Wholseler Dashboard</h4>
                    </div>

                    <div className="p-2">
                      <Link href="/wholesalers/dashboard" className="flex items-center gap-4 p-4 hover:bg-brand-accent rounded-2xl transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Icon icon="solar:widget-bold-duotone" className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-serif">Dashboard</p>
                          <p className="text-[8px] text-brand-primary/40 font-medium"> Management</p>
                        </div>
                      </Link>

                      <Link href="/wholesalers/dashboard/cart" className="flex items-center gap-4 p-4 hover:bg-brand-accent rounded-2xl transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Icon icon="solar:cart-3-bold-duotone" className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-serif">Cart</p>
                          <p className="text-[8px] text-brand-primary/40 font-medium"> Wish List</p>
                        </div>
                      </Link>

                      <Link href="/wholesalers/dashboard/saved" className="flex items-center justify-between p-4 hover:bg-brand-accent rounded-2xl transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <Icon icon="solar:heart-bold-duotone" className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-serif">Favourites</p>
                            <p className="text-[8px] text-brand-primary/40 font-medium">Saved Products</p>
                          </div>
                        </div>
                        {saved.length > 0 && (
                          <span className="w-6 h-6 bg-brand-accent text-brand-secondary text-[10px] font-bold rounded-full flex items-center justify-center border border-brand-secondary/20 font-serif">
                            {saved.length}
                          </span>
                        )}
                      </Link>
                    </div>

                    <div className="p-2 bg-brand-primary/2">
                      <button
                        onClick={async () => {
                          await fetch(isAdmin ? '/api/admin/logout' : '/api/user/logout', { method: 'POST' });
                          document.cookie = "ssd_wholesale_logged=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                          localStorage.removeItem('ssd_user');
                          window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl transition-all group text-red-500/60 hover:text-red-600"
                      >
                        <Icon icon="solar:logout-3-linear" className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Glassmorphic Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-primary/40 backdrop-blur-md z-[100]"
            />

            {/* Minimalist Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[110] shadow-2xl flex flex-col"
            >
              {/* Unified Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold tracking-[0.2em] text-brand-primary uppercase">
                  SHREE SHYAM
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-primary/40 hover:text-brand-primary">
                  <Icon icon="lucide:x" className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto no-scrollbar py-4">
                {/* 1. Integrated Wholesaler Links (Small & Clean) */}
                {isLogged && (
                  <div className="px-6 py-4 mb-4 bg-brand-accent/30 border-y border-brand-primary/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary mb-3">Partner Desk</p>
                    <div className="space-y-3">
                      {[
                        { href: "/wholesalers/dashboard/collection/offers", label: "Discount Offers", icon: "solar:ticket-sale-linear" },
                        { href: "/wholesalers/dashboard/collection/ready-stock", label: "Ready Stock", icon: "solar:box-minimalistic-linear" },
                        { href: "/wholesalers/dashboard/cart", label: "My Cart", icon: "solar:cart-large-2-linear", badge: cartCount }
                      ].map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <Icon icon={item.icon} className="w-4 h-4 text-brand-primary/60 group-active:text-brand-secondary" />
                            <span className="text-[10px] font-medium tracking-widest text-brand-primary/80 uppercase">{item.label}</span>
                          </div>
                          {item.badge > 0 && (
                            <span className="px-1.5 py-0.5 bg-brand-secondary text-white text-[8px] font-bold rounded-full">{item.badge}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Main Navigation List */}
                <div className="px-2">
                  {navigationData.map((cat) => (
                    <div key={cat.id} className="mb-1">
                      <button
                        onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span className={`text-[11px] font-bold tracking-[0.1em] uppercase ${expandedMobileCat === cat.id ? 'text-brand-secondary' : 'text-brand-primary/70'}`}>{cat.name}</span>
                        <Icon icon="lucide:chevron-down" className={`w-3 h-3 transition-transform ${expandedMobileCat === cat.id ? 'rotate-180 text-brand-secondary' : 'text-brand-primary/20'}`} />
                      </button>

                      <AnimatePresence>
                        {expandedMobileCat === cat.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="py-2 pl-4 space-y-1">
                              {cat.subCategories.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={`/category/${cat.id}/${sub.id}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-4 py-2 text-[10px] font-medium text-brand-primary/50 uppercase tracking-widest hover:text-brand-secondary"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* 3. Footer Links */}
                <div className="mt-6 px-6 pt-6 border-t border-gray-50 space-y-4">
                  <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="block text-[10px] font-bold tracking-[0.2em] text-brand-primary/40 uppercase">
                    Contact Us
                  </Link>

                  <button
                    onClick={async () => {
                      const res = await fetch(isAdmin ? '/api/admin/logout' : '/api/user/logout', { method: 'POST' });
                      document.cookie = "ssd_wholesale_logged=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                      localStorage.removeItem('ssd_user');
                      if (res.ok) window.location.href = '/';
                    }}
                    className="block text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="p-6 bg-brand-accent/20 border-t border-brand-primary/5">
                <p className="text-[10px] font-serif italic text-brand-primary/40">"Divine Elegance for Every Occasion"</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Refined Minimalist Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col items-center overflow-y-auto no-scrollbar selection:bg-brand-secondary/20"
          >
            {/* Top Bar Navigation */}
            <div className="w-full flex justify-end md:justify-between items-center p-6 lg:p-12 fixed top-0 left-0 z-10 bg-white/80 backdrop-blur-md">
              <div className="text-[16px] font-bold text-brand-primary/20 uppercase tracking-[0.4em] hidden md:block italic font-serif">
                Shree Shyam Darshan
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-3 group"
              >
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em]">Close Archive</span>
                <div className="w-6 h-6 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary transition-all duration-500">
                  <Icon icon="lucide:x" className="w-3.5 h-3.5 text-brand-primary group-hover:text-white transition-colors" />
                </div>
              </button>
            </div>

            <div className="w-full max-w-5xl px-4 lg:px-6 pt-20 lg:pt-32 pb-20">
              {/* Elegant Search Input */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative mb-8 lg:mb-16 text-center group"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search Masterpiece..."
                  className="w-full bg-transparent text-brand-primary text-3xl sm:text-4xl lg:text-7xl font-serif text-center focus:outline-none focus:ring-0 placeholder:text-brand-primary/30 lowercase transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:text-brand-secondary transition-colors"
                  >
                    <Icon icon="lucide:x" className="w-6 h-6 lg:w-10 lg:h-10 opacity-30 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
                <div className="w-28 h-[1px] bg-brand-secondary mx-auto mt-8 lg:mt-12"></div>
              </motion.div>

              <AnimatePresence mode="wait">
                {searchQuery.length === 0 ? (
                  <motion.div
                    key="trending"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-20 lg:space-y-32"
                  >
                    {/* Core Collections - Simplified */}
                    <div className="pt-0">
                      <div className="flex flex-col items-center gap-4 mb-6">
                        <span className="text-[9px] font-black text-brand-secondary/40 uppercase tracking-[0.5em]">Collections</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {navigationData.slice(0, 4).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/collections/${cat.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="group flex flex-col items-center justify-center p-8 rounded-2xl border border-brand-primary/5 hover:border-brand-secondary/30 transition-all duration-500"
                          >
                            <span className="text-[10px] font-serif italic text-brand-primary/30 mb-2 group-hover:text-brand-secondary transition-colors uppercase tracking-[0.1em]">Divine</span>
                            <span className="text-lg lg:text-lg font-serif italic font-bold text-brand-primary uppercase tracking-[0.2em]">{cat.name}</span>
                            <div className="w-0 group-hover:w-6 h-[1px] bg-brand-secondary mt-3 transition-all duration-500"></div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-12"
                  >
                    {isSearching ? (
                      <div className="space-y-16 animate-pulse">
                        {/* Skeleton for Collections */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-3 w-24 bg-brand-primary/5 rounded-full"></div>
                            <div className="h-px w-full bg-brand-primary/5"></div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="h-32 bg-brand-primary/5 rounded-2xl"></div>
                            ))}
                          </div>
                        </div>

                        {/* Skeleton for Products */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-3 w-32 bg-brand-primary/5 rounded-full"></div>
                            <div className="h-px w-full bg-brand-primary/5"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                            {[1, 2].map((i) => (
                              <div key={i} className="h-28 bg-brand-primary/5 rounded-2xl"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (searchResults.collections.length > 0 || searchResults.products.length > 0) ? (
                      <div className="space-y-16">
                        {/* Suggested Collections Section */}
                        {searchResults.collections.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-brand-secondary/40 uppercase tracking-[0.5em] shrink-0">Collections</span>
                              <div className="h-px w-full bg-brand-primary/5"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {searchResults.collections.map((coll) => (
                                <Link
                                  key={coll.id}
                                  href={coll.path}
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-brand-primary/5 hover:border-brand-secondary/30 transition-all duration-500 bg-brand-accent/5"
                                >
                                  <span className="text-[10px] font-serif italic text-brand-primary/30 mb-2 group-hover:text-brand-secondary transition-colors uppercase tracking-[0.1em]">{coll.type}</span>
                                  <span className="text-sm lg:text-base font-serif italic font-bold text-brand-primary uppercase tracking-[0.1em] text-center">{coll.name}</span>
                                  <div className="w-0 group-hover:w-6 h-[1px] bg-brand-secondary mt-3 transition-all duration-500"></div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Product Results Section */}
                        {searchResults.products.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-brand-secondary/40 uppercase tracking-[0.5em] shrink-0">Masterpieces</span>
                              <div className="h-px w-full bg-brand-primary/5"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                              {searchResults.products.map((p, idx) => (
                                <motion.div
                                  key={p.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                >
                                  <Link
                                    href={`/product/${p.id}`}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-brand-accent/30 transition-all duration-500"
                                  >
                                    <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden shrink-0 bg-brand-accent/50 p-2">
                                      <Image
                                        src={p.image}
                                        alt={p.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover rounded-lg group-hover:scale-110 transition-transform duration-1000"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-center flex-grow">
                                      <div className="text-brand-secondary text-[8px] font-black uppercase tracking-[0.3em] mb-1">{p.category} {p.section ? `• ${p.section}` : ''}</div>
                                      <h4 className="text-brand-primary text-sm lg:text-base font-bold group-hover:text-brand-secondary transition-colors line-clamp-1">{p.name}</h4>
                                      <p className="text-brand-primary/40 text-[10px] font-bold mt-1 tracking-widest uppercase">₹{p.price}</p>
                                    </div>
                                    <Icon icon="lucide:arrow-right" className="w-4 h-4 text-brand-primary/10 group-hover:text-brand-secondary group-hover:translate-x-1 transition-all" />
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center text-center"
                      >
                        <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center mb-6 text-brand-primary/20">
                          <Icon icon="solar:magnifer-zoom-out-broken" className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-serif italic text-brand-primary mb-3">No Masterpieces Found</h3>
                        <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">Try alternative terms or browse our core essence</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
