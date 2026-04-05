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

  const getFiltered = (group) => {
    return [...group].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      const curY = window.scrollY;
      if (curY > 500 && curY < lastY) {
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
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollSlider = (direction, isStickySlider = false) => {
    const ref = isStickySlider ? stickySliderRef : sliderRef;
    if (ref.current) {
      const scrollAmount = window.innerWidth * 0.4;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const sections = subCategory.sections || [];

  const renderSectionSlider = (isStickySlider = false) => {
    const ref = isStickySlider ? stickySliderRef : sliderRef;

    return (
      <div className={`relative group/slider ${isStickySlider ? "bg-white/80 backdrop-blur-md shadow-lg py-4 px-3 rounded-b-3xl border-b border-brand-primary/5" : "lg:px-8 mb-4 lg:mb-10 text-left"}`}>
        <button onClick={() => scrollSlider("left", isStickySlider)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all hidden md:flex">
          <Icon icon="lucide:chevron-left" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <button onClick={() => scrollSlider("right", isStickySlider)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all hidden md:flex">
          <Icon icon="lucide:chevron-right" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <div ref={ref} className="flex gap-4 lg:gap-10 overflow-x-auto py-2 snap-x no-scrollbar scroll-smooth px-6 lg:px-12 text-left">
          {sections.map((section, idx) => {
            const isActive = activeSection === section.name;
            return (
              <motion.div key={section.name} initial={isStickySlider ? {} : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.02 }} onClick={() => { scrollToSection(section.name); setActiveSection(section.name); }} className="flex-shrink-0 flex flex-col items-center gap-2 lg:gap-3 cursor-pointer snap-start group text-left">
                <div className={`text-white text-lg lg:text-2xl font-bold font-serif flex items-center justify-center rounded-full overflow-hidden border-2 transition-all shadow-md ${isActive ? "border-brand-secondary ring-4 ring-brand-secondary/20 scale-110" : "border-white ring-2 ring-brand-primary/5 group-hover:ring-brand-secondary"} bg-brand-primary ${isStickySlider ? "w-14 h-14 lg:w-20 lg:h-20" : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"}`}>
                  {section.name.charAt(0).toUpperCase()}
                </div>
                <span className={`font-bold tracking-widest text-center uppercase transition-all leading-tight ${isActive ? "text-brand-secondary scale-105" : "text-brand-primary/60 group-hover:text-brand-secondary"} ${isStickySlider ? "text-[6px] lg:text-[8px] max-w-[50px] lg:max-w-[70px]" : "text-[7px] lg:text-[10px] max-w-[70px] lg:max-w-[100px]"}`}>
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
    <div className="min-h-screen bg-brand-accent/30 relative text-left">

      <AnimatePresence>
        {showSticky && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-16 lg:top-20 left-0 w-full z-40 px-0 md:px-8 lg:px-12 pointer-events-auto text-left">
            <div className="max-w-7xl mx-auto text-left">
              {renderSectionSlider(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 lg:pt-24 pb-10 container mx-auto px-4 lg:px-8 max-w-7xl text-left">
        <div className="flex items-center gap-2 text-[7px] lg:text-[9px] font-bold tracking-widest text-brand-primary/30 uppercase mb-2 lg:mb-4 overflow-hidden whitespace-nowrap text-left">
          <Link href="/" className="hover:text-brand-secondary transition-colors text-left">Home</Link>
          <span className="text-brand-primary/10">/</span>
          <Link href={`/collections/${category.id}`} className="hover:text-brand-secondary transition-colors text-brand-primary/40 text-left">{category.name}</Link>
          <span className="text-brand-primary/10">/</span>
          <span className="text-brand-secondary truncate text-left">{subCategory.name}</span>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-primary mb-4 lg:mb-6 uppercase text-left">
          {subCategory.name}
        </motion.h1>


        {sections.length > 0 && renderSectionSlider(false)}

        <div className="space-y-6 lg:space-y-12 text-left">
          {sections.length > 0 ? (
            sections.map((section) => {
              const sectionProducts = getFiltered(products.filter((p) => !p.innerSubId || p.innerSubId === section.dbId));
              return (
                <section key={section.name} id={section.name} ref={(el) => (sectionRefs.current[section.name] = el)} className="scroll-mt-24 text-left">
                  <div className="flex items-center gap-4 mb-4 lg:mb-6 text-left">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-brand-primary shrink-0 uppercase tracking-widest text-left">{section.name}</h2>
                    <div className="h-[1px] flex-grow bg-brand-primary/5"></div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10 text-left">
                    {sectionProducts.length > 0 ? (
                      sectionProducts.map((product) => (
                        <div key={`${section.name}-${product.id}`} className="h-full text-left">
                          <ProductCard product={product} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 lg:py-16 bg-white/50 rounded-3xl border border-dashed border-brand-primary/10 flex items-center justify-center text-left">
                        <p className="text-brand-primary/30 text-[10px] lg:text-xs font-serif italic text-left">No masterpieces matching your criteria in {section.name}...</p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })
          ) : (
            <section className="mt-8 lg:mt-16 text-left">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10 text-left">
                {getFiltered(products).length > 0 ? (
                  getFiltered(products).map((product) => (
                    <div key={product.id} className="h-full text-left">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-left">
                    <p className="text-sm font-serif text-brand-primary/30 italic mb-8 uppercase tracking-widest text-center text-left">No masterpieces matching your criteria.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

    </div>
  );
}
