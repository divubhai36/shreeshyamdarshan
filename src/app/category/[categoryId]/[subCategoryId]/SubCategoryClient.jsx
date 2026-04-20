"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "../../../../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export default function SubCategoryClient({ category, subCategory, products, categoryId, subCategoryId }) {
  const sectionRefs = useRef({});
  const sliderRef = useRef(null);
  const stickySliderRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high
  const [activeFilters, setActiveFilters] = useState([]); // best-seller, offer, ready-stock
  const [showRefineModal, setShowRefineModal] = useState(false);

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const getFiltered = (group) => {
    let filtered = [...group];

    // Applying Multiple Filters (AND logic)
    if (activeFilters.includes("best-seller")) {
        filtered = filtered.filter(p => p.isBestSeller);
    }
    if (activeFilters.includes("offer")) {
        filtered = filtered.filter(p => p.isOfferProduct);
    }
    if (activeFilters.includes("ready-stock")) {
        filtered = filtered.filter(p => p.isReadyStock);
    }

    // Applying Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      const curY = window.scrollY;
      // Show sticky when scrolling up after hitting 400px
      if (curY > 400 && curY < lastY) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
      setLastY(curY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const timer = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((el) => {
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [products]);

  useEffect(() => {
    if (subCategory?.sections?.length > 0 && !activeSection) {
      setActiveSection(subCategory.sections[0].name);
    }
  }, [subCategory, activeSection]);

  const scrollToSection = (sectionName) => {
    const element = sectionRefs.current[sectionName];
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const sections = subCategory.sections || [];

  const renderSectionSlider = (isStickySlider = false) => {
    const ref = isStickySlider ? stickySliderRef : sliderRef;

    return (
      <div className={`relative group/slider ${isStickySlider ? "bg-white/80 backdrop-blur-xl shadow-2xl py-3 px-2 rounded-[32px] border border-white/20" : "mb-4 lg:mb-8"}`}>
        <div
          ref={ref}
          className="flex gap-4 lg:gap-10 overflow-x-auto py-2 snap-x no-scrollbar scroll-smooth px-4 lg:px-6"
        >
          {sections.map((section, idx) => {
            const isActive = activeSection === section.name;
            return (
              <motion.div
                key={section.name}
                initial={isStickySlider ? {} : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { scrollToSection(section.name); setActiveSection(section.name); }}
                className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer snap-start group"
              >
                <div className={`relative transition-all duration-500 rounded-full overflow-hidden flex items-center justify-center ${isActive ? "scale-110 shadow-xl" : "scale-100 shadow-sm group-hover:scale-105"} ${isStickySlider ? "w-12 h-12 lg:w-16 lg:h-16" : "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"}`}>
                    <img
                      src={section.image || "/hero.png"}
                      className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "scale-110 grayscale-0" : "grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110"}`}
                      alt={section.name}
                    />
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "bg-brand-primary/10" : "bg-black/10 group-hover:bg-black/0"}`} />
                    {isActive && (
                      <motion.div
                        layoutId={isStickySlider ? "active-ring-sticky" : "active-ring"}
                        className="absolute inset-0 border-[3px] border-brand-secondary rounded-full z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                </div>
                <span className={`text-center transition-all duration-300 font-bold uppercase leading-tight tracking-[0.05em] ${isActive ? "text-brand-secondary scale-105" : "text-brand-primary/40 group-hover:text-brand-primary"} ${isStickySlider ? "text-[7px] max-w-[50px]" : "text-[8px] lg:text-[10px] max-w-[70px] lg:max-w-[100px]"}`}>
                  {section.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative">

      {/* Sticky Story Nav */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-[72px] lg:top-24 left-0 w-full z-40 px-4 pointer-events-auto"
          >
            <div className="max-w-4xl mx-auto">
              {renderSectionSlider(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 lg:pt-24 pb-20 container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-2 lg:mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[9px] lg:text-[11px] font-bold tracking-[0.3em] text-brand-primary/30 uppercase mb-2 lg:mb-4 overflow-hidden whitespace-nowrap"
          >
            <Link href="/" className="hover:text-brand-secondary transition-colors">Home</Link>
            <Icon icon="lucide:chevron-right" className="w-3 h-3 text-brand-primary/10" />
            <Link href={`/collections/${category.id}`} className="hover:text-brand-secondary transition-colors">{category.name}</Link>
            <Icon icon="lucide:chevron-right" className="w-3 h-3 text-brand-primary/10" />
            <span className="text-brand-secondary truncate">{subCategory.name}</span>
          </motion.div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="max-w-[60%] lg:max-w-2xl">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl lg:text-5xl font-serif font-black text-brand-primary uppercase tracking-tighter leading-none mb-1"
                >
                  {subCategory.name}
                </motion.h1>
                {/* <p className="text-[8px] lg:text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Curated Collection</p> */}
            </div>

            {/* Unified Refine Control */}
            <div className="flex items-center gap-2 lg:gap-4 relative">
                <button
                         onClick={() => setShowRefineModal(!showRefineModal)}
                         className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-8 py-2.5 lg:py-3.5 border border-brand-primary/70 rounded-2xl transition-all text-[10px] lg:text-xs font-black uppercase tracking-widest active:scale-95 cursor-pointer ${
                            (activeFilters.length > 0 || sortBy !== "newest")
                            ? "bg-brand-primary text-white shadow-brand-primary/20"
                            : "bg-brand-accent/30 text-brand-primary hover:bg-brand-accent/50"
                         }`}
                >
                    <Icon icon="icon-park-twotone:filter" className={`w-4 h-4 lg:w-5 lg:h-5 ${(activeFilters.length > 0 || sortBy !== "newest") ? "text-brand-secondary" : "text-brand-primary/70"}`} />
                    <span className="hidden lg:inline text-nowrap">Filter & Sort</span>
                    {(activeFilters.length > 0) && (
                        <span className="bg-brand-secondary text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] lg:ml-1">
                            {activeFilters.length}
                        </span>
                    )}
                </button>

                {/* Unified Refine Modal */}
                <AnimatePresence>
                    {showRefineModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
                                onClick={() => setShowRefineModal(false)}
                            />
                            <motion.div
                                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] p-4 z-[120] overflow-hidden"
                            >
                                {/* Sorting Section */}
                                <div className="mb-6">
                                    <div className="px-4 py-2 mb-2 border-b border-brand-primary/5">
                                        <span className="text-[11px] sm:text-xs font-black text-brand-primary/70 uppercase tracking-[0.2em]">Sort By</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {[
                                            { id: "newest", label: "Newest First", icon: "solar:clock-circle-bold" },
                                            { id: "price-low", label: "Price: Low to High", icon: "solar:sort-from-bottom-to-top-bold" },
                                            { id: "price-high", label: "Price: High to Low", icon: "solar:sort-from-top-to-bottom-bold" },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setSortBy(option.id)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                    sortBy === option.id ? "bg-brand-primary text-white shadow-md" : "text-brand-primary/70 hover:bg-brand-primary/5"
                                                }`}
                                            >
                                                <Icon icon={option.icon} className={`w-4 h-4 ${sortBy === option.id ? "text-brand-secondary" : "text-brand-primary/50"}`} />
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Filtering Section */}
                                <div>
                                    <div className="px-4 py-2 mb-2 border-b border-brand-primary/5">
                                        <span className="text-[11px] sm:text-xs font-black text-brand-primary/70 uppercase tracking-[0.2em]">Filter By</span>
                                    </div>
                                    <div className="space-y-1">
                                        {[
                                            { id: "best-seller", label: "Best Sellers", icon: "solar:star-bold-duotone" },
                                            { id: "offer", label: "Discounted Items", icon: "solar:tag-bold-duotone" },
                                            { id: "ready-stock", label: "Ready Stock", icon: "solar:box-bold-duotone" },
                                        ].map((filter) => (
                                            <button
                                                key={filter.id}
                                                onClick={(e) => { e.stopPropagation(); toggleFilter(filter.id); }}
                                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                    activeFilters.includes(filter.id) ? "bg-brand-primary/5 text-brand-primary border-brand-primary/10" : "text-brand-primary/70 hover:bg-brand-primary/5"
                                                } border border-transparent`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon icon={filter.icon} className={`w-4 h-4 ${activeFilters.includes(filter.id) ? "text-brand-secondary" : "opacity-30"}`} />
                                                    {filter.label}
                                                </div>
                                                {activeFilters.includes(filter.id) && (
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-brand-secondary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                {(activeFilters.length > 0 || sortBy !== "newest") && (
                                    <div className="mt-4 pt-4 border-t border-brand-primary/5 flex items-center justify-between px-2">
                                        <button
                                            onClick={() => { setActiveFilters([]); setSortBy("newest"); }}
                                            className="text-[8px] font-black text-brand-secondary uppercase tracking-[0.2em] hover:underline"
                                        >
                                            Reset All
                                        </button>
                                        <button
                                            onClick={() => setShowRefineModal(false)}
                                            className="bg-brand-primary text-white px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Top Story View Section */}
        {sections.length > 0 && renderSectionSlider(false)}

        {/* Product Sections */}
        <div className="space-y-16 lg:space-y-24">
          {products.length === 0 ? (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="py-32 lg:py-32 flex flex-col items-center justify-center text-center px-6"
             >
                <div className="relative mb-8">
                   <div className="absolute inset-0 bg-brand-secondary/5 blur-[80px] rounded-full scale-150" />
                   <Icon icon="solar:box-minimalistic-line-duotone" className="h-20 w-20 lg:h-32 lg:w-32 text-brand-primary/10 relative z-10" />
                </div>
                <h3 className="text-xl lg:text-3xl font-serif font-bold text-brand-primary uppercase tracking-[0.1em] mb-4">No Products Available</h3>
                <p className="text-[10px] lg:text-xs font-bold text-brand-primary/30 uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                   We are currently updating this collection with new divine excellence. Please check back soon.
                </p>
                <Link href="/" className="mt-8 px-10 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-secondary transition-all shadow-xl active:scale-95">
                   Back to Home
                </Link>
             </motion.div>
          ) : sections.length > 0 ? (
            sections.map((section) => {
              const sectionProducts = getFiltered(products.filter((p) => !p.innerSubId || p.innerSubId === section.dbId));
              return (
                <section key={section.name} id={section.name} ref={(el) => (sectionRefs.current[section.name] = el)} className="scroll-mt-48">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl lg:text-3xl font-serif font-bold text-brand-primary uppercase tracking-tight">{section.name}</h2>
                    <div className="h-px flex-grow bg-brand-primary/10" />
                    <span className="text-[9px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">{sectionProducts.length} items</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
                    {sectionProducts.length > 0 ? (
                      sectionProducts.map((product, pidx) => (
                        <motion.div
                          key={`${section.name}-${product.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: pidx % 4 * 0.1 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-4 bg-brand-accent/30 rounded-[32px] border border-dashed border-brand-primary/10 flex flex-col items-center justify-center text-center px-6 transition-all hover:bg-brand-accent/40">
                         <Icon icon="solar:box-minimalistic-line-duotone" className="h-6 w-6 lg:w-10 lg:h-10 text-brand-primary/10 mb-4" />
                         <h3 className="text-sm font-serif font-bold text-brand-primary/30 uppercase tracking-widest">No Products Found</h3>
                         {/* <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em] mt-1">We'll update this section soon</p> */}
                      </div>
                    )}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
              {getFiltered(products).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx % 4 * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
