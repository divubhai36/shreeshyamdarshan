import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import productData from '../data/products.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import navigationData from '../data/navigation.json';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductDetails() {
  const { id } = useParams();
  const product = productData.products.find(p => p.id === parseInt(id));

  // State Management
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl bg-brand-accent text-brand-primary">
      Product not found.
    </div>
  );

  // Enhanced product images stack (Repeat main image + dummy for variety)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  // Resolve Category and SubCategory from navigationData
  const navCategory = navigationData.find(c =>
    c.subCategories.some(sub =>
      sub.name.toLowerCase() === product.category.toLowerCase() ||
      sub.id.toLowerCase() === product.category.toLowerCase()
    )
  );

  const subCategory = navCategory?.subCategories.find(sub =>
    sub.name.toLowerCase() === product.category.toLowerCase() ||
    sub.id.toLowerCase() === product.category.toLowerCase()
  );

  // Filter masterpieces from same category
  const relatedProducts = productData.products.filter(p =>
    p.id !== product.id &&
    (p.category === product.category || (navCategory && p.category === navCategory.id))
  ).slice(0, 10);

  const relatedSliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3.5 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };

  const handleWhatsApp = () => {
    const phone = "917383699199";
    const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Inquiry from Website:\n------------------\n*Product:* ${product.name}\n*Quantity:* ${quantity} pcs\n------------------\nPlease help me with the details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Accordion Item Component
  const AccordionItem = ({ id, title, icon, children }) => {
    const isOpen = activeAccordion === id;
    return (
      <div className="border-b border-brand-primary/20">
        <button
          onClick={() => setActiveAccordion(isOpen ? null : id)}
          className="w-full py-6 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon icon={icon} width="20" height="20" className={`transition-colors ${isOpen ? 'text-brand-secondary' : 'text-brand-primary/40 group-hover:text-brand-primary'}`} />
            </div>
            <span className={`text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.2em] transition-colors ${isOpen ? 'text-brand-primary' : 'text-brand-primary/50 group-hover:text-brand-primary'}`}>
              {title}
            </span>
          </div>
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <Icon icon="lucide:chevron-down" width="16" height="16" className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-secondary' : 'text-brand-primary/20'}`} />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pb-8 pt-2 px-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-accent relative w-full flex flex-col text-left overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 pt-20 lg:pt-28 mb-5 max-w-7xl">
          {/* Modern Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-[10px] items-start mb-4 lg:mb-12 text-brand-primary/20 font-bold uppercase tracking-[0.2em] w-full">
            <Link to="/" className="hover:text-brand-secondary transition-colors shrink-0">Home</Link>
            <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
            {navCategory && (
              <>
                <Link to={`/collections/${navCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                  {navCategory.name}
                </Link>
                <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
              </>
            )}
            {subCategory && (
              <>
                <Link to={`/category/${navCategory.id}/${subCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                  {subCategory.name}
                </Link>
                <Icon icon="lucide:chevron-right" className="w-2.5 h-2.5 opacity-30 mt-[1px] shrink-0" />
              </>
            )}
            <span className="text-brand-primary/60 truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start">
            {/* Left: Gallery (6/12 cols) */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <motion.div
                key={activeImageIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] bg-white border border-brand-primary/5"
              >
                <img
                  src={productImages[activeImageIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute top-5 left-5 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-bold uppercase tracking-[0.3em] text-white shadow-sm">
                  Best Seller
                </div>
              </motion.div>

              {/* Thumbnail Reel (Larger) */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`shrink-0 w-18 h-16 md:w-24 md:h-32 rounded-2xl overflow-hidden border-2 p-1 transition-all duration-500 ${activeImageIdx === idx ? 'border-brand-secondary shadow-lg -translate-y-1' : 'border-transparent opacity-80 grayscale-[20%]'
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right: Info (6/12 cols) */}
            <div className="flex flex-col pt-0 lg:pl-4">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-left w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-6 bg-brand-secondary"></div>
                  <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.3em]">{product.category}</span>
                </div>

                <h1 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-6 lg:mb-8 tracking-tight text-left">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6 mb-8 lg:mb-12 text-left">
                  <span className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary">₹{product.price}</span>
                  <div className="h-8 w-px bg-brand-primary/10"></div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Direct Inquiry</span>
                    <span className="text-[8px] font-medium text-brand-primary/30 uppercase tracking-[0.2em]">Crafted to Order</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 text-left">
                  <p className="text-brand-primary/60 text-[14px] lg:text-[16px] leading-relaxed font-serif italic mb-4">
                    "{product.description} This piece is a testimony to our generations of craftsmanship. Individually tailored with soul, using only the finest threads for true divinity."
                  </p>

                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6 py-4 border-y border-brand-primary/5 text-left">
                    {[
                      { label: 'Fabric', value: product.material || 'Premium Art Silk' },
                      { label: 'Embroidery', value: 'Traditional Zardosi' },
                      { label: 'Colour', value: product.color || 'Vibrant Festive' },
                      { label: 'Included', value: 'Full Poshak Set' }
                    ].map((info, i) => (
                      <div key={i} className="space-y-1 text-left">
                        <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">{info.label}</p>
                        <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Box - Old Version */}
                <button
                  onClick={handleWhatsApp}
                  className="bg-brand-primary text-white py-4 lg:py-5 px-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs lg:text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-brand-secondary hover:translate-y-[-4px] transition-all active:scale-[0.98] group shrink-0"
                >
                  <Icon icon="logos:whatsapp-icon" className="w-6 h-6 lg:w-6 lg:h-6" /> For inquiry Contact on Whatsapp
                </button>

                {/* Integrated Accordions */}
                <div className="mt-8 space-y-0 text-left">
                  <AccordionItem id="size" title="Size Guide" icon="lucide:ruler">
                    <div className="bg-white/50 p-6 rounded-2xl border border-brand-primary/5 mt-0 overflow-x-auto">
                      <table className="w-full text-left text-[10px] lg:text-[12px]">
                        <thead>
                          <tr className="border-b border-brand-primary/10">
                            <th className="py-3 pr-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">No.</th>
                            <th className="py-3 px-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Height</th>
                            <th className="py-3 pl-4 font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Dress</th>
                          </tr>
                        </thead>
                        <tbody className="text-brand-primary/80">
                          {[
                            { n: '0', h: '1.75"', d: '4"' },
                            { n: '1', h: '2.20"', d: '6"' },
                            { n: '2', h: '2.75"', d: '6"' },
                            { n: '3', h: '3.15"', d: '8"' },
                            { n: '4', h: '3.40"', d: '8"' },
                            { n: '5', h: '3.80"', d: '10"' },
                            { n: '6', h: '4.40"', d: '12"' }
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-brand-primary/5 last:border-0 hover:bg-brand-secondary/[0.01]">
                              <td className="py-3 pr-4 font-bold text-brand-secondary">{row.n} No.</td>
                              <td className="py-3 px-4">{row.h}</td>
                              <td className="py-3 pl-4 font-medium">{row.d}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionItem>

                  <AccordionItem id="wash" title="Wash & Care" icon="lucide:droplets">
                    <div className="space-y-4 px-2 py-4 text-left">
                      {[
                        'Dry clean only recommended.',
                        'Store in a breathable cloth cover.',
                        'Dust off lightly with a soft brush.',
                        'Avoid direct spray of perfumes.',
                        'Air every 3-4 months.'
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start text-left">
                          <span className="w-5 h-5 rounded-full bg-brand-secondary/5 flex items-center justify-center text-brand-secondary font-bold text-[9px] shrink-0">{i + 1}</span>
                          <p className="text-[11px] lg:text-[12px] font-serif text-brand-primary/70 leading-relaxed text-left">{item}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                </div>
              </motion.div>
            </div>
          </div>

          {/* VIDEO SECTION - Full Width Impression */}
          <section className="mt-0 lg:mt-32 pt-8 lg:pt-16 border-t border-brand-primary/5">
            <div className="container mx-auto px-0 max-w-7xl">
              <div className="flex flex-col items-center mb-5 lg:mb-20 text-center">
                <h2 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary uppercase text-center leading-tight">Details That <span className="italic font-normal text-brand-secondary">Matter</span></h2>
                <div className="w-20 lg:w-32 h-[1px] bg-brand-primary/10 mt-4"></div>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:gap-10">
                {[
                  { id: 1, url: "/videos/products/lv_0_20250325174749.mp4", title: "Intricate Handwork" },
                  { id: 2, url: "/videos/products/lv_0_20250411143949.mp4", title: "Fabric Shine" },
                  { id: 3, url: "/videos/products/lv_0_20250426151713.mp4", title: "Product Detail" }
                ].map((video, idx) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveVideo(video.url)}
                    className="group relative aspect-[9/16] overflow-hidden rounded-2xl lg:rounded-[40px] shadow-2xl cursor-pointer bg-brand-primary/5"
                  >
                    <video
                      src={video.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Icon icon="solar:play-bold" className="w-4 h-4 lg:w-6 lg:h-6 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 lg:bottom-10 left-0 right-0 text-center px-2 lg:px-4">
                      <p className="hidden md:block text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{video.title}</p>
                      <h3 className="text-[10px] md:text-xl font-serif text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 whitespace-nowrap overflow-hidden text-ellipsis">Watch Story</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Premium Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-0 lg:mt-32 pt-12 lg:pt-16  border-t border-brand-primary/5">
              <div className="flex flex-col items-center mb-5 lg:mb-16 text-center">
                <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3">You May Also Like</div>
                <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary uppercase">Elite <span className="italic font-normal">Masterpieces</span></h2>
                <div className="w-16 h-[1px] bg-brand-primary/10 mt-4 md:mt-8"></div>
              </div>

              <div className="related-products-slider -mx-4">
                <Slider {...relatedSliderSettings}>
                  {relatedProducts.map((p) => (
                    <div key={p.id} className="px-2 md:px-4 pb-6 lg:pb-12">
                      <Link to={`/product/${p.id}`} className="block group">
                        <div className="relative aspect-[3/4] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-white border border-brand-primary/5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent transition-all duration-700 group-hover:opacity-0" />
                          <div className="absolute bottom-4 left-4 right-4 z-10 transition-all duration-500 opacity-100 translate-y-0">
                            <div className="bg-white/95 backdrop-blur-md p-4 lg:p-5 rounded-3xl border border-white/20 shadow-xl transition-all duration-700 group-hover:bg-white/10 group-hover:backdrop-blur-2xl group-hover:border-white/40">
                              <p className="text-[11px] lg:text-xs font-serif font-bold text-brand-primary truncate group-hover:text-white transition-colors duration-500">{p.name}</p>
                              <p className="text-[10px] lg:text-[11px] font-bold text-brand-secondary mt-1 group-hover:text-white transition-colors duration-500">₹{p.price}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
          {/* Back Buttons */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 pt-2 lg:pt-10 mt-0 lg:mt-10 border-t border-brand-primary/5 text-left">
            {subCategory && (
              <Link
                to={`/category/${navCategory.id}/${subCategory.id}`}
                className="px-6 py-3 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-3 group"
              >
                <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                Back to {subCategory.name}
              </Link>
            )}
            {subCategory && (
              <Link
                to={`/collections/${navCategory.id}`}
                className="px-6 py-3 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-3 group"
              >
                <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                Back to {navCategory.name}
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideo(null);
              }}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-brand-secondary transition-colors flex items-center justify-center text-white z-20 border border-white/10 shadow-2xl"
            >
              <Icon icon="lucide:x" className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[450px] aspect-[9/16] max-h-[90vh] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}