import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import productData from '../data/products.json';
import navigationData from '../data/navigation.json';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SubCategory() {
  const { categoryId, subCategoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const sectionRefs = useRef({});
  const sliderRef = useRef(null);
  const stickySliderRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const cat = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
    if (cat) {
      setCategory(cat);
      const sub = cat.subCategories.find(s => s.id.toLowerCase() === subCategoryId?.toLowerCase());
      if (sub) {
        setSubCategory(sub);
        const filtered = productData.products.filter(p => {
          const productCat = p.category.toLowerCase();
          const subName = sub.name.toLowerCase();
          const subId = sub.id.toLowerCase().replace(/-/g, ' ');
          return productCat.includes(subName) || productCat.includes(subId);
        });
        setProducts(filtered);
      }
    }
    window.scrollTo(0, 0);
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      const curY = window.scrollY;
      // Show sticky when scrolling UP and after passing some distance
      if (curY > 500 && curY < lastY) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
      setLastY(curY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

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
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const renderSectionSlider = (isStickySlider = false) => {
    const ref = isStickySlider ? stickySliderRef : sliderRef;

    return (
      <div className={`relative group/slider  ${isStickySlider ? 'bg-white/80 backdrop-blur-md shadow-lg py-4 px-3 rounded-b-3xl border-b border-brand-primary/5' : 'lg:px-8 mb-6 lg:mb-10'}`}>
        {/* Slider Buttons */}
        <button
          onClick={() => scrollSlider('left', isStickySlider)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all hidden md:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollSlider('right', isStickySlider)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all hidden md:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={ref}
          className="flex gap-4 lg:gap-8 overflow-x-auto pb-2 snap-x no-scrollbar scroll-smooth px-2 lg:px-6"
        >
          {sections.map((section, idx) => (
            <motion.div
              key={section.name}
              initial={isStickySlider ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => scrollToSection(section.name)}
              className="flex-shrink-0 flex flex-col items-center gap-2 lg:gap-3 cursor-pointer snap-start group"
            >
              <div className={`text-white text-lg lg:text-2xl font-bold font-serif flex items-center justify-center rounded-full overflow-hidden border-2 border-white ring-2 ring-brand-primary/5 group-hover:ring-brand-secondary transition-all shadow-md bg-brand-primary ${isStickySlider ? 'w-14 h-14 lg:w-24 lg:h-24' : 'w-14 h-14 md:w-16 md:h-16 lg:w-24 lg:h-24'}`}>
                {section.name.charAt(0).toUpperCase()}
                {/* <img
                  src={section.image}
                  alt={section.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                /> */}
              </div>
              <span className={`font-bold tracking-widest text-brand-primary/60 text-center uppercase group-hover:text-brand-secondary transition-all leading-tight ${isStickySlider ? 'text-[6px] lg:text-[8px] max-w-[50px] lg:max-w-[70px]' : 'text-[7px] lg:text-[10px] max-w-[70px] lg:max-w-[100px]'}`}>
                {section.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (!category || !subCategory) return <div className="pt-32 text-center text-xs tracking-widest text-brand-primary/40">Loading...</div>;

  const sections = subCategory.sections || [];

  return (
    <div className="min-h-screen bg-brand-accent/30 relative">
      <Header />

      {/* Sticky Section Navigator */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-16 lg:top-20 left-0 w-full z-40 px-0 md:px-8 lg:px-12 pointer-events-auto"
          >
            <div className="max-w-7xl mx-auto">
              {renderSectionSlider(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 lg:pt-24 pb-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[7px] lg:text-[9px] font-bold tracking-widest text-brand-primary/30 uppercase mb-2 lg:mb-4 overflow-hidden whitespace-nowrap">
          <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
          <span className="text-brand-primary/10">/</span>
          <span className="text-brand-primary/40">{category.name}</span>
          <span className="text-brand-primary/10">/</span>
          <span className="text-brand-secondary truncate">{subCategory.name}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-primary mb-4 lg:mb-8 uppercase"
        >
          {subCategory.name}
        </motion.h1>

        {/* Section Navigation Slider */}
        {sections.length > 0 && renderSectionSlider(false)}

        {/* Section Groups */}
        <div className="space-y-6 lg:space-y-12">
          {sections.length > 0 ? (
            sections.map((section) => {
              const sectionProducts = products.filter(p => !p.section || p.section.toUpperCase() === section.name.toUpperCase());
              return (
                <section key={section.name} ref={el => sectionRefs.current[section.name] = el} className="scroll-mt-24">
                  <div className="flex items-center gap-4 mb-4 lg:mb-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-brand-primary shrink-0 uppercase tracking-widest">{section.name}</h2>
                    <div className="h-[1px] flex-grow bg-brand-primary/5"></div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
                    {sectionProducts.length > 0 ? (
                      sectionProducts.map((product) => (
                        <div key={`${section.name}-${product.id}`} className="h-full">
                          <ProductCard product={product} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 lg:py-16 bg-white/50 rounded-3xl border border-dashed border-brand-primary/10 flex items-center justify-center">
                        <p className="text-brand-primary/30 text-[10px] lg:text-xs font-serif italic">New arrivals in {section.name} coming soon...</p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })
          ) : (
            <section className="mt-8 lg:mt-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-sm font-serif text-brand-primary/30 italic mb-8 uppercase tracking-widest">No divinity found.</p>
                    <Link to="/" className="inline-block px-8 py-3 bg-brand-primary text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-xl">
                      Explore Other
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-brand-primary/5 bg-brand-accent/20">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <h2 className="text-base lg:text-xl font-serif font-bold text-brand-primary tracking-widest uppercase mb-4">LADDU GOPAL</h2>
          <p className="text-[8px] lg:text-[10px] text-brand-primary/30 font-bold tracking-widest uppercase">
            © 2026 Laddu Gopal Poshak Outlet • Crafted for Devotion
          </p>
        </div>
      </footer>
    </div>
  );
}
