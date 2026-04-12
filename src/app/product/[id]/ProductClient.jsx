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
import { toast } from "react-hot-toast";
import { roundToTwo } from "@/lib/utils";

export default function ProductClient({ product, navCategory, subCategory, innerSubCategory, relatedProducts }) {
  const { addToCart, addMultipleToCart, toggleSave, isProductSaved, isAuthenticated } = useCart();
  const saved = isProductSaved(product.id);

  // State Management
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [variantQuantities, setVariantQuantities] = useState({}); // { variantName: quantity }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  // Handle single product quantity (if no variants)
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) {
      setVariantQuantities({ [product.name]: 0 });
    } else {
      const initial = {};
      product.variants.forEach(v => initial[v.name] = 0);
      setVariantQuantities(initial);
    }
  }, [product]);

  const handleAddToCartConfirm = () => {
    const unitMultiplier = product.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
    const itemsToAdd = [];

    Object.entries(variantQuantities).forEach(([vName, qty]) => {
      const numQty = parseInt(qty) || 0;
      if (numQty > 0) {
        const actualQty = numQty * unitMultiplier;
        const basePrice = product.isOfferProduct ? product.offerPrice : product.price;

        // Find variant price if it exists
        const variantObj = product.variants?.find(v => v.name === vName);
        const rawItemPrice = variantObj ? variantObj.price : basePrice;

        // Apply discount to variant price if offer product
        const finalItemPrice = product.isOfferProduct
          ? roundToTwo(rawItemPrice * (1 - (product.discountPercent || 0) / 100))
          : roundToTwo(rawItemPrice);

        itemsToAdd.push({
          product,
          quantity: actualQty,
          variantName: vName === product.name ? null : vName,
          variantPrice: finalItemPrice,
          originalPrice: variantObj?.price || product.price
        });
      }
    });

    if (itemsToAdd.length > 0) {
      addMultipleToCart(itemsToAdd);
      toast.success(`${itemsToAdd.length} items added to cart successfully`);
      setIsCartModalOpen(false);
      // Reset quantities
      const reset = {};
      Object.keys(variantQuantities).forEach(k => reset[k] = 0);
      setVariantQuantities(reset);
    }
  };




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
    const discount = product.isOfferProduct ? (product.discountPercent || 0) : 0;
    const finalPrice = product.isOfferProduct ? product.offerPrice : product.price;

    const totalQty = Object.values(variantQuantities).reduce((a, b) => a + (parseInt(b) || 0), 0);
    const unitText = product.unit?.toUpperCase() === "DOZEN" ? "Dozens" : "Pieces";

    const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Inquiry from Website:\n------------------\n*Product:* ${product.name}\n*Price:* ₹${finalPrice}\n*Order Unit:* ${product.unit}\n------------------\nPlease help me with the details.`;
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
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
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
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start">
              <div className="space-y-6 lg:sticky lg:top-24">
                <div
                  className="relative aspect-square overflow-hidden rounded-3xl md:rounded-4xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] bg-white border border-brand-primary/5"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={productImages[activeImageIdx]}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Final Perfected Diagonal Sash */}
                  {product.isBestSeller && (
                    <div className="absolute top-[-10px] md:top-0 right-[-25px] md:right-[-10px] w-32 h-40 z-20 pointer-events-none">
                      <div className="bg-linear-to-r from-red-600 to-rose-700 text-white text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] py-1 md:py-2 w-[160%] absolute top-10 -right-10 rotate-45 shadow-[0_5px_20px_rgba(220,38,38,0.5)] border-y border-white/10 flex justify-center items-center">
                        Best Seller
                      </div>
                    </div>
                  )}

                </div>

                {productImages.length > 1 && (
                  <div className="flex items-center justify-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 mx-auto w-full">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative cursor-pointer shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border transition-all duration-300 ease-in-out hover:border-brand-primary/50 ${activeImageIdx === idx
                          ? "border-brand-primary shadow-md scale-105"
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

                  <div className="flex justify-between items-start gap-4 mb-6 lg:mb-8 text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight tracking-tight text-left capitalize grow">
                      {product.name}
                    </h1>
                    {isAuthenticated && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="shrink-0"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleSave(product)}
                          className={`transition-all duration-300 relative ${saved ? "text-rose-500" : "text-brand-primary hover:scale-95"
                            }`}
                        >
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
                              className={`w-8 h-8 lg:w-10 lg:h-10 ${saved
                                ? "drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                                : ""
                                }`}
                            />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-2 lg:mb-10 text-left">
                    <div className="min-w-[200px] lg:min-w-[180px]">
                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-1">
                        <div className="flex items-baseline gap-3">
                          <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${product.isOfferProduct ? 'text-red-600' : 'text-brand-primary'}`}>
                            ₹{product.isOfferProduct ? product.offerPrice : product.price}
                          </span>
                          {(product.mrp && product.mrp > (product.isOfferProduct ? product.offerPrice : product.price)) && (
                            <span className="text-[12px] lg:text-[18px] font-bold text-brand-primary/30 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>

                        {(product.mrp && product.mrp > (product.isOfferProduct ? product.offerPrice : product.price)) && (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[8px] lg:text-[12px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                              Save ₹{Math.round(parseFloat(product.mrp) - (product.isOfferProduct ? product.offerPrice : product.price))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="hidden lg:block h-8 w-px bg-brand-primary/10"></div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-[10px] lg:text-[13px] font-bold text-brand-secondary uppercase tracking-[0.2em] mt-1 italic">
                        Our prices are lowest because we are India's largest manufacturer
                      </span>
                    </div>
                  </div>
                  <div className="lg:hidden flex flex-col text-left border-t border-brand-primary/10 mb-4">
                    <span className="text-[10px] lg:text-[13px] font-bold text-brand-secondary uppercase tracking-[0.2em] mt-2 italic">
                      Our prices are lowest because we are India's largest manufacturer
                    </span>
                  </div>


                  <div className="mb-6 text-left">
                    <p className="text-brand-primary/60 text-[14px] lg:text-[16px] leading-relaxed font-serif italic mb-4">
                      "{product.description} This piece is a testimony to our
                      generations of craftsmanship. Individually tailored with soul,
                      using only the finest threads for true divinity."
                    </p>

                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-5 text-left">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[9px] font-black text-brand-primary/30 uppercase tracking-[0.3em] whitespace-nowrap">Inventory & Pricing</span>
                          <div className="h-px grow bg-brand-primary/5"></div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {product.variants.map((v, i) => {
                            const originalP = parseFloat(v.price || 0);
                            const discountedPrice = product.isOfferProduct
                              ? roundToTwo(originalP * (1 - (product.discountPercent || 0) / 100))
                              : roundToTwo(originalP);
                            const hasDiscount = product.isOfferProduct && originalP > discountedPrice;

                            return (
                              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-brand-primary/15 hover:border-brand-secondary/30 transition-all group">
                                <span className="text-[12px] font-black text-brand-primary/40 uppercase tracking-widest">{v.name}</span>
                                <div className="w-px h-3 bg-brand-primary/10"></div>
                                <div className="flex items-center gap-2">
                                  {hasDiscount && (
                                    <span className="text-[14px] font-bold text-brand-primary/20 line-through">₹{originalP.toLocaleString()}</span>
                                  )}
                                  <span className="text-[14px] font-bold text-brand-secondary">₹{discountedPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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

                    {/* Wholesaler Description */}
                    {isAuthenticated && product.wholesalerDescription && (
                      <div className="my-8 p-6 bg-brand-secondary/5 rounded-3xl border border-brand-secondary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-all">
                          <Icon icon="solar:medal-star-bold" className="w-12 h-12 text-brand-secondary" />
                        </div>
                        <h4 className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <Icon icon="solar:crown-bold" className="w-4 h-4" />
                          Wholesaler Exclusive info
                        </h4>
                        <p className="text-brand-primary/80 text-[13px] font-serif leading-relaxed italic">
                          {product.wholesalerDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Purchase Section */}
                  {isAuthenticated === true && product.allowToBuy !== false && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <button
                        onClick={() => setIsCartModalOpen(true)}
                        className="grow bg-brand-primary text-white py-5 px-8 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs lg:text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-brand-secondary transition-all active:scale-[0.98] group"
                      >
                        <Icon icon="solar:cart-large-bold" className="w-5 h-5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  )}

                  {/* Unauthorized Guest Section */}
                  {isAuthenticated === false && (
                    <div className="mb-8 p-6 bg-brand-primary/5 rounded-[32px] border border-brand-primary/10 text-center group hover:bg-brand-primary/[0.07] transition-all">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon icon="solar:lock-keyhole-minimalistic-bold" className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] lg:text-[13px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-2">Wholesaler Exclusive</p>
                      <p className="text-[12px] lg:text-[15px] text-brand-primary/40 font-serif italic mb-6">Log in to view wholesale details, select variants, and place orders.</p>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[10px] lg:text-[12px] font-black uppercase tracking-widest text-brand-secondary hover:underline"
                      >
                        Become Authorized Wholesaler <Icon icon="lucide:arrow-right" className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-white text-brand-primary border border-brand-primary/10 py-5 px-8 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs lg:text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:border-brand-primary/20 transition-all active:scale-[0.98] group"
                  >
                    <Icon icon="logos:whatsapp-icon" className="w-6 h-6" />
                    <span>Inquiry On Whatsapp</span>
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
          {isCartModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-brand-primary/95 flex items-center justify-center p-4 backdrop-blur-3xl"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-8 pb-4 border-b border-brand-primary/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-brand-primary">Select Quantities</h3>
                    <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em] mt-1">
                      Order in {product.unit?.toUpperCase() === "DOZEN" ? "Dozen" : "Piece"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary hover:bg-brand-primary/10 transition-all"
                  >
                    <Icon icon="lucide:x" className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-8 pt-6 overflow-y-auto no-scrollbar grow">
                  <div className="space-y-4">
                    {(product.variants && product.variants.length > 0 ? product.variants : [{ name: product.name, price: product.price }]).map((v, i) => {
                      const qty = variantQuantities[v.name] || 0;
                      const unitMultiplier = product.unit?.toUpperCase() === "DOZEN" ? 12 : 1;

                      const originalP = parseFloat(v.price || 0);
                      const basePrice = product.isOfferProduct
                        ? (originalP * (1 - (product.discountPercent || 0) / 100))
                        : originalP;

                      const hasDiscount = product.isOfferProduct && originalP > basePrice;

                      return (
                        <div key={i} className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-4 p-4 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/5 hover:bg-brand-primary/[0.04] transition-all">
                          {/* Left: Info */}
                          <div className="w-full text-left">
                            <p className="font-bold text-brand-primary text-lg">{v.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {hasDiscount && (
                                <span className="text-sm text-brand-primary/60 line-through">₹{originalP.toLocaleString()}</span>
                              )}
                              <p className="text-sm text-brand-primary font-bold">₹{basePrice.toLocaleString()} / pc</p>
                            </div>
                          </div>

                          {/* Center: Quantity */}
                          <div className="flex flex-col items-center w-full">
                            <span className="text-[10px] sm:text-xs font-bold text-brand-primary/30 uppercase tracking-widest mb-1.5">Qty ({product.unit?.toUpperCase() === "DOZEN" ? "Dozen" : "Piece"})</span>
                            <input
                              type="number"
                              min="0"
                              value={qty === 0 ? "" : qty}
                              onChange={(e) => setVariantQuantities({
                                ...variantQuantities,
                                [v.name]: e.target.value === "" ? 0 : parseInt(e.target.value)
                              })}
                              placeholder="0"
                              className="w-16 h-12 bg-white rounded-xl border border-brand-primary/10 text-center font-bold text-brand-primary focus:border-brand-secondary outline-none transition-all px-0"
                            />
                          </div>

                          {/* Right: Total */}
                          <div className="w-full flex flex-col items-end">
                            <p className="text-[10px] sm:text-xs font-bold text-brand-primary/30 uppercase tracking-widest mb-1.5">Total Value</p>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center justify-end gap-2">
                                {product.isOfferProduct && qty > 0 && (
                                  <span className="text-sm font-bold text-brand-primary/20 line-through">₹{(qty * unitMultiplier * v.price).toLocaleString()}</span>
                                )}
                                <p className="font-bold text-brand-primary text-xl tracking-tight">₹{(qty * unitMultiplier * basePrice).toLocaleString()}</p>
                              </div>
                              {product.unit?.toUpperCase() === "DOZEN" && qty > 0 && (
                                <p className="text-[10px] text-brand-secondary font-bold">({qty * 12} pcs)</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 sm:p-8 pt-4 border-t border-brand-primary/5 bg-brand-primary/[0.02]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                    <div className="w-full sm:w-auto">
                      <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">Total Order Amount</p>
                      <div className="flex flex-col">
                        <p className="text-2xl sm:text-3xl font-bold text-brand-primary">
                          ₹{Object.entries(variantQuantities).reduce((acc, [vName, qty]) => {
                            const v = (product.variants || []).find(v => v.name === vName) || { price: product.price };
                            const basePrice = product.isOfferProduct
                              ? (v.price * (1 - (product.discountPercent || 0) / 100))
                              : v.price;
                            const multiplier = product.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
                            return acc + (qty * multiplier * basePrice);
                          }, 0).toLocaleString()}
                          {product.isOfferProduct && Object.values(variantQuantities).some(q => q > 0) && (
                            <span className="text-base sm:text-lg font-bold text-brand-primary/50 line-through mb-1 ml-2">
                              ₹{Object.entries(variantQuantities).reduce((acc, [vName, qty]) => {
                                const v = (product.variants || []).find(v => v.name === vName) || { price: product.price };
                                const multiplier = product.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
                                return acc + (qty * multiplier * v.price);
                              }, 0).toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleAddToCartConfirm}
                      disabled={Object.values(variantQuantities).every(q => !q || q <= 0)}
                      className="w-full sm:w-auto bg-brand-primary text-white py-4 sm:py-5 px-10 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-xl hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

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
