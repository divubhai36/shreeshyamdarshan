import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import productData from '../data/products.json';
import navigationData from '../data/navigation.json';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveCategory(null);
  }, [location]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = searchQuery.length > 2
    ? productData.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-brand-primary/5">
        <div className="container mx-auto px-4 lg:px-4 h-16 lg:h-20 flex items-center justify-between max-w-7xl">

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-primary">
            <Icon icon="lucide:menu" className="w-6 h-6" />
          </button>

          {/* Logo (Centered on mobile) */}
          <Link to="/" className="flex flex-col items-center group scale-[0.85] lg:scale-100 mx-auto lg:mx-0 lg:order-first">
            <h1 className="text-lg lg:text-xl font-serif font-bold text-brand-primary tracking-[0.05em] lg:tracking-[0.1em] uppercase group-hover:text-brand-secondary transition-colors">
              SHREE SHYAM <span className="text-brand-secondary">DARSHAN</span>
            </h1>
            <p className="text-[7px] tracking-[0.2em] font-medium text-brand-primary/40 uppercase">
              laddu gopal poshak and shringar
            </p>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-2 text-[9px] uppercase tracking-widest font-bold text-brand-primary/70">
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
                                    to={`/collections/${cat.id}`}
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
                                   className={`grid gap-x-8 gap-y-1 ${
                                     cat.subCategories.length > 20 ? 'grid-cols-4' : 
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
                                           to={`/category/${cat.id}/${sub.id}`}
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
            <Link to="/contact-us" className="px-3 py-2 hover:text-brand-secondary transition-colors relative group">
              Contact us
              <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Right Search Button */}
          <div className="flex items-center space-x-1 lg:space-x-4 text-brand-primary lg:order-last">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-brand-secondary transition-colors">
              <Icon icon="lucide:search" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[110] shadow-2xl flex flex-col" >
              <div className="p-5 border-b flex items-center justify-between">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif font-bold text-brand-primary tracking-widest uppercase">SHREE SHYAM <span className="text-brand-secondary">DARSHAN</span>
                </Link>

                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-brand-accent rounded-full text-brand-primary">
                  <Icon icon="lucide:x" className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto py-4">
                {/* <Link to="/" className="block px-8 py-4 text-[10px] font-bold tracking-widest text-brand-primary active:bg-brand-accent uppercase">HOME</Link> */}
                {navigationData.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-50">
                    <button onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)} className="w-full px-8 py-5 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] text-brand-primary uppercase">
                       {cat.name}
                       <Icon icon="lucide:chevron-right" className={`w-4 h-4 transition-transform ${expandedMobileCat === cat.id ? 'rotate-90 text-brand-secondary' : 'text-brand-primary/20'}`} />
                    </button>
                    <AnimatePresence>
                      {expandedMobileCat === cat.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-brand-accent/30" >
                          {cat.subCategories.map((sub) => (
                            <Link key={sub.name} to={`/category/${cat.id}/${sub.id}`} className="block px-12 py-4 text-[11px] font-medium text-brand-primary/70 active:text-brand-secondary active:bg-brand-accent uppercase tracking-widest" >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-50 mb-10">
                  <Link to="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-4 text-[11px] font-bold tracking-[0.2em] text-brand-primary uppercase hover:text-brand-secondary transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="p-8 bg-brand-primary text-white text-center text-left">
                <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-brand-secondary mb-2 text-left">Visit Our Outlet</p>
                <p className="text-sm font-serif italic text-white/60 text-left">"Divine Elegance for Every Occasion"</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-brand-primary/95 z-[200] flex flex-col items-center p-6 pt-20" >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-6 right-6 text-white hover:text-brand-secondary transition-colors" >
               <Icon icon="lucide:x" className="w-8 h-8" />
            </button>
            <div className="w-full max-w-2xl px-4">
              <input autoFocus type="text" placeholder="Search divinity..." className="w-full bg-transparent border-b-2 border-white/20 text-white text-3xl font-serif py-3 focus:outline-none focus:border-brand-secondary mb-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {searchResults.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} onClick={() => setIsSearchOpen(false)} className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10" >
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white text-sm font-bold">{p.name}</h4>
                      <p className="text-brand-secondary text-[10px] font-bold">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
