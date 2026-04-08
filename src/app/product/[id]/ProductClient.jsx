"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductClient({ product, navCategory, subCategory, innerSubCategory, relatedProducts }) {
  const { addToCart, toggleSave, isProductSaved, isAuthenticated } = useCart();
  const saved = isProductSaved(product.id);
  // State Management
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  // Enhanced product images stack
  const productImages = (product.images && product.images.length > 0)
    ? product.images
    : [
      product.image,
      product.image,
      product.image,
      product.image,
      product.image,
    ];

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
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const handleWhatsApp = () => {
    const phone = "917383699199";
    const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Inquiry from Website:\n------------------\n*Product:* ${product.name}\n*Quantity:* ${quantity} pcs\n------------------\nPlease help me with the details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

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
              <Icon
                icon={icon}
                width="20"
                height="20"
                className={`transition-colors ${isOpen
                  ? "text-brand-secondary"
                  : "text-brand-primary/40 group-hover:text-brand-primary"
                  }`}
              />
            </div>
            <span
              className={`text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.2em] transition-colors ${isOpen
                ? "text-brand-primary"
                : "text-brand-primary/50 group-hover:text-brand-primary"
                }`}
            >
              {title}
            </span>
          </div>
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <Icon
              icon="lucide:chevron-down"
              width="16"
              height="16"
              className={`transition-transform duration-500 ${isOpen ? "rotate-180 text-brand-secondary" : "text-brand-primary/20"
                }`}
            />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pb-8 pt-2 px-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Shree Shyam Darshan"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://shreeshyamdarshan.com/product/${product.id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "120"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://shreeshyamdarshan.com/"
              },
              ...(navCategory ? [{
                "@type": "ListItem",
                "position": 2,
                "name": navCategory.name,
                "item": `https://shreeshyamdarshan.com/collections/${navCategory.id}`
              }] : []),
              ...(subCategory ? [{
                "@type": "ListItem",
                "position": 3,
                "name": subCategory.name,
                "item": `https://shreeshyamdarshan.com/category/${navCategory.id}/${subCategory.id}`
              }] : []),
              {
                "@type": "ListItem",
                "position": subCategory ? 4 : (navCategory ? 3 : 2),
                "name": product.name,
                "item": `https://shreeshyamdarshan.com/product/${product.id}`
              }
            ]
          })
        }}
      />
      <div className="min-h-screen bg-brand-accent/30 overflow-x-hidden text-left">
        <main className="grow">
          <div className="container mx-auto px-4 pt-20 lg:pt-28 mb-5 max-w-7xl">
            <div className="flex flex-wrap items-start gap-2 lg:gap-3 text-[10px] mb-4 lg:mb-12 text-brand-primary/20 font-bold uppercase tracking-[0.2em] w-full">
              <Link href="/" className="hover:text-brand-secondary transition-colors shrink-0">
                Home
              </Link>
              <Icon icon="lucide:chevron-right" className="w-3 h-3 mt-px shrink-0" />
              {navCategory && (
                <>
                  <Link href={`/collections/${navCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                    {navCategory.name}
                  </Link>
                  <Icon icon="lucide:chevron-right" className="w-3 h-3 mt-px shrink-0" />
                </>
              )}
              {subCategory && (
                <>
                  <Link href={`/category/${navCategory.id}/${subCategory.id}`} className="hover:text-brand-secondary transition-colors shrink-0">
                    {subCategory.name}
                  </Link>
                  <Icon icon="lucide:chevron-right" className="w-3 h-3 mt-px shrink-0" />
                </>
              )}
              <span className="text-brand-primary/60 truncate">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start">
              <div className="space-y-6 lg:sticky lg:top-24">
                <div className="relative aspect-square overflow-hidden rounded-3xl md:rounded-4xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] bg-white border border-brand-primary/5">
                  <Image
                    src={productImages[activeImageIdx]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 hover:scale-110"
                  />
                  {/* Brand Best Seller Ribbon Sash */}
                  {product.isBestSeller && (
                    <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden z-20 pointer-events-none">
                      <div className="bg-linear-to-r from-red-600 to-rose-700 text-white text-[10px] font-black uppercase tracking-[0.25em] py-2 w-[160%] absolute top-8 -right-16 rotate-45 shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-y border-white/10 flex justify-center text-center">
                        Best Seller
                      </div>
                    </div>
                  )}

                  {/* Cinema Floating Like Button */}
                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-1 right-1 z-30"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleSave(product)}
                        className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-300 relative overflow-hidden ${saved ? "text-rose-500" : "text-white"
                          }`}
                      >
                        {/* ✅ Single element (NO re-mount) */}
                        <motion.div
                          animate={{
                            scale: saved ? [1, 1.25, 1] : 1,
                          }}
                          transition={{
                            duration: 0.25,
                            ease: "easeOut",
                          }}
                        >
                          <Icon
                            icon={saved ? "solar:heart-bold" : "solar:heart-linear"}
                            className={`w-8 h-8 ${saved
                              ? "drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                              : "drop-shadow-[0_0_15px_rgba(26,67,50,0.4)]"
                              }`}
                          />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                {productImages.length > 1 && (
                  <div className="flex items-center justify-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 mx-auto w-full">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative cursor-pointer shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out hover:border-brand-secondary/50 ${activeImageIdx === idx
                          ? "border-brand-secondary shadow-md scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 80px, 120px"
                          className="object-cover rounded-xl"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col pt-0 lg:pl-4">
                <div className="text-left w-full">
                  {/* <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-6 bg-brand-secondary"></div>
                    <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.3em]">
                      {product.category}
                    </span>
                  </div> */}

                  <h1 className="text-3xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-6 lg:mb-8 tracking-tight text-left capitalize">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-6 mb-8 lg:mb-12 text-left">
                    {product.isOfferProduct && product.offerPrice ? (
                      <div className="flex flex-col">
                        <span className="text-3xl lg:text-4xl font-serif font-bold text-red-600">
                          ₹{product.offerPrice}
                        </span>
                        <span className="text-sm font-bold text-brand-primary/40 line-through">
                          ₹{product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary">
                        ₹{product.price}
                      </span>
                    )}
                    <div className="h-8 w-px bg-brand-primary/10"></div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary underline decoration-brand-secondary decoration-2 underline-offset-4">
                        Direct Inquiry
                      </span>
                      <span className="text-[8px] font-bold text-brand-secondary uppercase tracking-[0.2em] mt-1 italic">
                        Best Quality at Direct Factory Price
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 text-left">
                    <p className="text-brand-primary/60 text-[14px] lg:text-[16px] leading-relaxed font-serif italic mb-4">
                      "{product.description} This piece is a testimony to our
                      generations of craftsmanship. Individually tailored with soul,
                      using only the finest threads for true divinity."
                    </p>

                    {((Array.isArray(product.details) && product.details.length > 0) || product.category) && (
                      <div className="grid grid-cols-2 gap-y-8 gap-x-6 py-4 border-y border-brand-primary/5 text-left">
                        <div className="space-y-1 text-left">
                          <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">
                            Category
                          </p>
                          <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">
                            {product.category}
                          </p>
                        </div>
                        <div className="space-y-1 text-left">
                          <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">
                            Sub-category
                          </p>
                          <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">
                            {product.subCategory}
                          </p>
                        </div>
                        {product.innerCategory && (
                          <div className="space-y-1 text-left">
                            <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">
                              Type
                            </p>
                            <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">
                              {product.innerCategory}
                            </p>
                          </div>
                        )}
                        {product.productId && (
                          <div className="space-y-1 text-left">
                            <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">
                              Product ID
                            </p>
                            <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">
                              {product.productId}
                            </p>
                          </div>
                        )}
                        {Array.isArray(product.details) && product.details.map((info, i) => (
                          <div key={i} className="space-y-1 text-left">
                            <p className="text-[9px] font-bold text-brand-primary/20 uppercase tracking-[0.2em]">
                              {info.label}
                            </p>
                            <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.05em]">
                              {info.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-brand-primary text-white py-5 px-8 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs lg:text-sm flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(26,67,50,0.3)] hover:bg-brand-secondary hover:translate-y-[-4px] transition-all active:scale-[0.98] group"
                  >
                    <Icon icon="logos:whatsapp-icon" className="w-6 h-6" />
                    <span>Order On Whatsapp</span>
                  </button>

                  <div className="mt-8 space-y-0 text-left">
                    {product.showSizeGuide && (
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
                                { n: "0", h: '1.75"', d: '4"' },
                                { n: "1", h: '2.20"', d: '6"' },
                                { n: "2", h: '2.75"', d: '6"' },
                                { n: "3", h: '3.15"', d: '8"' },
                                { n: "4", h: '3.40"', d: '8"' },
                                { n: "5", h: '3.80"', d: '10"' },
                                { n: "6", h: '4.40"', d: '12"' },
                              ].map((row, i) => (
                                <tr key={i} className="border-b border-brand-primary/5 last:border-0 hover:bg-brand-secondary/1">
                                  <td className="py-3 pr-4 font-bold text-brand-secondary">{row.n} No.</td>
                                  <td className="py-3 px-4">{row.h}</td>
                                  <td className="py-3 pl-4 font-medium">{row.d}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionItem>
                    )}
                    {product.showWashCare && (
                      <AccordionItem id="wash" title="Wash & Care" icon="lucide:droplets">
                        <div className="space-y-4 px-2 py-4 text-left">
                          {[
                            "Dry clean only recommended.",
                            "Store in a breathable cloth cover.",
                            "Dust off lightly with a soft brush.",
                            "Avoid direct spray of perfumes.",
                            "Air every 3-4 months.",
                          ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start text-left">
                              <span className="w-5 h-5 rounded-full bg-brand-secondary/5 flex items-center justify-center text-brand-secondary font-bold text-[9px] shrink-0">{i + 1}</span>
                              <p className="text-[11px] lg:text-[12px] font-serif text-brand-primary/70 leading-relaxed text-left">{item}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section className="pt-10 lg:pt-20 border-t border-brand-primary/5 px-0">
              <div className="container mx-auto px-4 max-w-7xl text-center">
                <div className="flex flex-col items-center mb-0 lg:mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-0.5 bg-brand-secondary/40"></div>
                    <span className="text-brand-secondary text-[10px] lg:text-xs font-bold uppercase tracking-[0.4em]">Cinematic Quality</span>
                    <div className="w-12 h-0.5 bg-brand-secondary/40"></div>
                  </div>
                  <h2 className="text-4xl lg:text-7xl font-serif font-bold text-brand-primary uppercase leading-tight tracking-tighter">
                    Divine <span className="italic font-normal text-brand-secondary">Details</span>
                  </h2>
                  <p className="text-[10px] lg:text-xs text-brand-primary/40 font-bold uppercase tracking-[0.3em] mt-8 max-w-md mx-auto leading-relaxed">
                    Experience our craft through the lens of devotion. Each thread tells a story of heritage and love.
                  </p>
                </div>

                <div className="story-slider-wrapper relative -mx-4 group">
                  <Slider
                    {...{
                      dots: false,
                      infinite: true,
                      speed: 800,
                      slidesToScroll: 1,
                      autoplay: true,
                      autoplaySpeed: 3000,
                      arrows: false,

                      // Desktop first
                      slidesToShow: 5,

                      responsive: [
                        {
                          breakpoint: 1280, // below 1280px
                          settings: {
                            slidesToShow: 4,
                          },
                        },
                        {
                          breakpoint: 1024, // below 1024px
                          settings: {
                            slidesToShow: 3,
                          },
                        },
                        {
                          breakpoint: 768, // below 768px
                          settings: {
                            slidesToShow: 2.5,
                          },
                        },
                        {
                          breakpoint: 480, // small mobile
                          settings: {
                            slidesToShow: 2.2,
                          },
                        },
                      ],
                    }}
                    className="story-slider"
                  >
                    {[{ url: "https://res.cloudinary.com/dg4hyioqu/video/upload/v1775244607/lv_0_20250325174749_cdcicc.mp4", title: "Handwork" }, { url: "https://res.cloudinary.com/dg4hyioqu/video/upload/v1775244604/lv_0_20250426151713_exrd5i.mp4", title: "Fabric Shine" }, { url: "https://res.cloudinary.com/dg4hyioqu/video/upload/v1775244599/lv_0_20250411143949_iwsj9d.mp4" },].map((video, idx) => (
                      <div key={idx} className="px-2 md:px-4 py-8 pb-10">
                        <motion.div whileHover={{ y: -10 }} onClick={() => setActiveVideo(video.url)} className="group relative aspect-9/16 overflow-hidden rounded-[24px] lg:rounded-[48px] shadow-2xl cursor-pointer bg-brand-primary/5">
                          <video src={video.url} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-linear-to-t from-brand-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-8">
                            <h3 className="text-xl lg:text-xl font-serif text-white">Watch Story</h3>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </section>

            {relatedProducts.length > 0 && (
              <div className="pt-12 lg:pt-16">
                <div className="flex flex-col items-center mb-5 lg:mb-10 text-center">
                  <div className="text-brand-secondary font-bold text-[8px] lg:text-xs tracking-[0.4em] uppercase mb-3">You May Also Like</div>
                  <h2 className="text-2xl lg:text-4xl font-serif font-bold text-brand-primary uppercase">Elite <span className="italic font-normal">Masterpieces</span></h2>
                </div>
                <div className="related-products-slider -mx-4">
                  <Slider {...relatedSliderSettings}>
                    {relatedProducts.map((p) => (
                      <div key={p.id} className="px-2 md:px-4 pb-8 lg:pb-16 pt-6">
                        <Link href={`/product/${p.id}`} className="block group">
                          <div className="relative aspect-square rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-white border border-brand-primary/5">
                            <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute bottom-4 left-4 right-4 z-10 transition-all duration-1000">
                              <div className="bg-white/95 backdrop-blur-md p-4 lg:p-5 rounded-3xl border border-white/20 shadow-xl group-hover:bg-white/10 group-hover:text-white">
                                <p className="text-[11px] lg:text-xs font-serif font-bold truncate">{p.name}</p>
                                <p className="text-[10px] lg:text-[11px] font-bold text-brand-secondary mt-1 group-hover:text-white">₹{p.price}</p>
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

            <div className="flex flex-wrap gap-x-4 gap-y-3 pt-2 lg:pt-0 mt-0 lg:mt-10 ">
              {subCategory && (
                <Link href={`/category/${navCategory.id}/${subCategory.id}`} className="px-6 py-3 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-3">
                  <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" /> Back to {subCategory.name}
                </Link>
              )}
              {navCategory && (
                <Link href={`/collections/${navCategory.id}`} className="px-6 py-3 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-3">
                  <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" /> Back to {navCategory.name}
                </Link>
              )}
            </div>
          </div>
        </main>

        <AnimatePresence>
          {activeVideo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl" onClick={() => setActiveVideo(null)}>
              <button onClick={() => setActiveVideo(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white z-20"><Icon icon="lucide:x" className="w-6 h-6" /></button>
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-[450px] aspect-9/16 rounded-[40px] overflow-hidden">
                <video src={activeVideo} autoPlay controls playsInline className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
