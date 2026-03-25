import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Menu, ChevronRight } from 'lucide-react';
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
        <div className="container mx-auto px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between max-w-7xl">
          
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-brand-primary">
            <Menu size={24} />
          </button>

          {/* Logo (Centered on mobile) */}
          <Link to="/" className="flex flex-col items-center group scale-[0.85] lg:scale-100 mx-auto lg:mx-0 lg:order-first">
            <h1 className="text-lg lg:text-xl font-serif font-bold text-brand-primary tracking-[0.1em] lg:tracking-[0.2em] uppercase group-hover:text-brand-secondary transition-colors">
              LADDU <span className="text-brand-secondary">GOPAL</span>
            </h1>
            <p className="text-[7px] tracking-[0.2em] font-medium text-brand-primary/40 uppercase">
              Divine Outlet
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-4 text-[9px] uppercase tracking-widest font-bold text-brand-primary/70">
            <Link to="/" className="px-2 py-2 hover:text-brand-secondary transition-colors">Home</Link>
            {navigationData.map((cat) => (
              <div 
                key={cat.id}
                className="relative group h-20 flex items-center"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className={`flex items-center gap-1 px-2 py-2 transition-colors duration-300 ${activeCategory === cat.id ? 'text-brand-secondary' : 'hover:text-brand-secondary'}`}>
                  {cat.name}
                  <ChevronDown size={10} className={`transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeCategory === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl border-t-2 border-brand-secondary overflow-hidden"
                    >
                      <div className="py-2 max-h-[70vh] overflow-y-auto no-scrollbar">
                        {cat.subCategories.map((sub) => (
                          <Link
                            key={sub.name}
                            to={`/category/${cat.id}/${sub.id}`}
                            className="block px-6 py-3 text-[10px] font-bold tracking-widest text-brand-primary/80 hover:bg-brand-accent/50 hover:text-brand-secondary transition-all"
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
          </nav>

          {/* Right Search Button */}
          <div className="flex items-center space-x-1 lg:space-x-4 text-brand-primary lg:order-last">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-brand-secondary transition-colors">
              <Search size={22} strokeWidth={1.5} />
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
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif font-bold text-brand-primary tracking-widest uppercase">LADDU GOPAL</Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-brand-accent rounded-full text-brand-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto py-4">
                <Link to="/" className="block px-8 py-4 text-[10px] font-bold tracking-widest text-brand-primary active:bg-brand-accent uppercase">HOME</Link>
                {navigationData.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-50">
                    <button onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)} className="w-full px-8 py-5 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] text-brand-primary uppercase">
                      {cat.name}
                      <ChevronRight size={16} className={`transition-transform ${expandedMobileCat === cat.id ? 'rotate-90 text-brand-secondary' : 'text-brand-primary/20'}`} />
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
              </div>
              <div className="p-8 bg-brand-primary text-white text-center">
                 <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-brand-secondary mb-2">Visit Our Outlet</p>
                 <p className="text-sm font-serif italic text-white/60">"Divine Elegance for Every Occasion"</p>
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
              <X size={32} strokeWidth={1} />
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
