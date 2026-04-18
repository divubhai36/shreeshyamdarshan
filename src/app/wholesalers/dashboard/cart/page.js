"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { roundToTwo } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart = [], addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, originalCartTotal, cartCount } = useCart();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [successTotals, setSuccessTotals] = useState({ total: 0, originalTotal: 0 });

  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        id: item.id,
        name: item.name,
        category: item.category,
        image: item.image || (item.images && item.images[0]),
        unit: item.unit || "PIECE",
        variantsInCart: [], // Tracking only what's currently in cart
        allAvailableVariants: (item.variants || []), // All variants from product definition
        totalQtyInCart: 0,
        totalPrice: 0,
        originalTotalPrice: 0,
        // Also keep product prices in case a variant doesn't have its own
        basePrice: item.price,
        baseMrp: item.originalPrice || item.price
      };
    }
    acc[item.id].variantsInCart.push(item);
    acc[item.id].totalQtyInCart += item.quantity;
    acc[item.id].totalPrice = roundToTwo(acc[item.id].totalPrice + (item.price * item.quantity));
    acc[item.id].originalTotalPrice = roundToTwo(acc[item.id].originalTotalPrice + ((item.originalPrice || item.price) * item.quantity));
    return acc;
  }, {});

  const groupedItems = Object.values(groupedCart);

  // Helper to format quantity based on unit
  const formatQty = (qty, unit) => {
    if (unit?.toUpperCase() === "DOZEN") {
      const dozens = Math.floor(qty / 12);
      const remaining = qty % 12;
      if (remaining === 0) return `${dozens} Dozen`;
      return `${dozens} Doz, ${remaining} Pcs`;
    }
    return `${qty} Piece`;
  };

  const checkoutMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/user/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccessTotals({ total: cartTotal, originalTotal: originalCartTotal });
        setLastOrderDetails(data.order);
        setIsSuccess(true);

        // TRIGGER WHATSAPP MESSAGE
        const phone = "917383699199";
        const itemsList = cart.map(item => {
          const unitLabel = item.unit?.toUpperCase() === "DOZEN" ? "Doz" : "Pcs";
          return `- *[${item.productId || 'N/A'}]* ${item.name}${item.variantName ? ' (' + item.variantName + ')' : ''}: ${item.quantity} ${unitLabel} x ₹${item.price.toLocaleString()}`;
        }).join('\n');
        const text = `Hi, *Shree Shyam Darshan Team*\n\nNew Wholesale Order Placed!\n*Order ID:* #${data.order.orderNumber}\n*Total Value:* ₹${cartTotal.toLocaleString()}\n\n*Product List:*\n${itemsList}\n\n*Wholesaler Details:* ${data.order.wholesaler?.name || 'Authorized Partner'}\n------------------\nPlease authorize and prepare this inventory for dispatch.`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");

        clearCart();
        toast.success("Order Registered Successfully!");
      } else {
        toast.error(data.error || "Failed to place order");
      }
    },
    onError: () => {
      toast.error("Connection failed. Please try again.");
    }
  });

  useEffect(() => {
    const isLogged = document.cookie.split(';').some(c => c.trim().startsWith('ssd_wholesale_logged=true'));
    if (!isLogged && !localStorage.getItem('ssd_user')) {
      router.push('/login?callbackUrl=/wholesalers/dashboard/cart');
      return;
    }
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    checkoutMutation.mutate({
      items: cart,
      totalAmount: cartTotal
    });
  };

  const isProcessing = checkoutMutation.isPending;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-4 pt-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-md w-full rounded-[40px] sm:rounded-[48px] p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-brand-primary/5 relative overflow-hidden my-8"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-400" />

          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Icon icon="solar:check-circle-bold" className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-primary mb-3">Order Placed Successfully</h1>
          <p className="text-sm text-brand-primary/60 mb-8 px-2">Your order has been placed successfully.</p>

          <div className="bg-[#fcfbf7] rounded-3xl p-6 mb-8 text-left border border-brand-primary/5">
            <div className="mb-4 pb-4 border-b border-brand-primary/5">
              <p className="text-[9px] uppercase font-black text-brand-primary/30 tracking-[0.2em] mb-2">Order Reference</p>
              <p className="text-lg font-bold text-brand-primary break-all">#{lastOrderDetails?.orderNumber}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-brand-primary/30 tracking-[0.2em] mb-1">Total Order Value</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-brand-primary tracking-tight">₹{(lastOrderDetails?.totalAmount || 0).toLocaleString()}</p>
                {successTotals.originalTotal > successTotals.total && (
                  <div className="flex flex-col">
                    <p className="text-[7px] sm:text-[9px] font-black text-green-600 uppercase tracking-[0.15em] whitespace-nowrap bg-green-50 px-2 py-0.5 rounded-full border border-green-100 italic">
                      Saved ₹{(successTotals.originalTotal - successTotals.total).toLocaleString()}
                    </p>
                    <span className="text-xs sm:text-base font-bold text-brand-primary/20 line-through decoration-brand-primary/30 leading-none mt-0.5">₹{successTotals.originalTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => router.push('/wholesalers/dashboard/orders')}
              className="w-full bg-brand-primary text-white py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-brand-secondary transition-all"
            >
              Track Fulfillment
            </button>
            <button
              onClick={() => router.push('/wholesalers/dashboard')}
              className="w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 hover:text-brand-primary transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] selection:bg-brand-secondary/20">
      <main className="container mx-auto px-4 lg:px-8 pt-20 sm:pt-24 lg:pt-36 pb-24 sm:pb-32 max-w-4xl">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <button onClick={() => router.push('/wholesalers/dashboard')} className="flex items-center gap-2 text-brand-primary/40 hover:text-brand-primary transition-colors mb-3 group">
              <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]">Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-primary">Shopping Cart</h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-brand-secondary tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1">B2B Wholesaler Choice</p>
          </div>

          <div className="flex bg-white px-4 py-2 rounded-2xl border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] items-center gap-3 w-fit sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {groupedItems.length}
            </div>
            <div>
              <p className="text-[7px] sm:text-[8px] font-bold text-brand-primary/30 uppercase tracking-widest">Products</p>
              <p className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-tight">In Cart</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-20 text-center border border-brand-primary/5 shadow-xl">
            <div className="w-16 h-16 sm:w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="solar:cart-large-2-linear" className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary/20" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary mb-3">Your registry is empty</h2>
            <p className="text-xs sm:text-sm text-brand-primary/40 mb-8 max-w-sm mx-auto">Discover our latest divine collections and curate your wholesale order.</p>
            <button onClick={() => router.push('/wholesalers/dashboard/collection/ready-stock')} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-primary text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-xl">
              Explore Ready Stock
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Grouped Cart Items List */}
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {groupedItems.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white p-4 rounded-[24px] sm:rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)] transition-all flex items-center gap-4 sm:gap-6 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-16 h-20 sm:w-24 sm:h-28 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-brand-accent border border-brand-primary/5 relative z-10">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                    </div>

                    <div className="grow relative z-10 min-w-0">
                      <p className="text-[8px] sm:text-[9px] font-bold text-brand-secondary uppercase tracking-widest mb-0.5 sm:mb-1">{product.category}</p>
                      <h3 className="text-base sm:text-xlg sm:text-xl font-serif font-bold text-brand-primary leading-tight group-hover:text-brand-secondary transition-colors truncate">{product.name}</h3>

                      <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                        <span className="text-[7px] sm:text-[9px] font-bold text-brand-primary/60 bg-brand-primary/5 px-2 py-0.5 sm:py-1 rounded-lg uppercase tracking-widest">
                          {product.variantsInCart.length} Active Designs
                        </span>
                        <span className="text-[7px] sm:text-[9px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 sm:py-1 rounded-lg uppercase tracking-widest italic">
                          {formatQty(product.totalQtyInCart, product.unit)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 relative z-10">
                      <p className="text-[8px] sm:text-[9px] font-bold text-brand-primary/30 uppercase tracking-widest mb-0.5 italic hidden sm:block">Valuation</p>
                      <div className="flex items-end gap-1">
                        {product.originalTotalPrice > product.totalPrice && (
                          <span className="text-sm sm:text-lg font-bold text-brand-primary/20 line-through decoration-brand-primary/30">₹{(product.originalTotalPrice || 0).toLocaleString()}</span>
                        )}
                        <p className="text-lg sm:text-2xl font-bold text-brand-primary tracking-tight">₹{(product.totalPrice || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Premium Summary Bar */}
            <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="container mx-auto max-w-lg bg-white p-4 sm:p-4 rounded-[28px] sm:rounded-4xl border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] flex items-center justify-between gap-4 pointer-events-auto backdrop-blur-md"
              >
                <div className="flex items-center gap-3 sm:gap-6 border-r border-brand-primary/5 pr-4 sm:pr-8 min-w-0">
                  <div className="hidden sm:block">
                    <p className="text-[7px] sm:text-[8px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1 sm:mb-1.5">Units</p>
                    <p className="text-lg sm:text-xl font-bold text-brand-primary">{cartCount}</p>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-[8px] sm:text-[10px] font-bold text-brand-primary/80 uppercase tracking-widest mb-1 sm:mb-1.5 opacity-60">Total Amount</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xl sm:text-3xl font-bold text-brand-primary tracking-tight">₹{(cartTotal || 0).toLocaleString()}</p>
                      {originalCartTotal > cartTotal && (
                        <div className="flex flex-row gap-1 items-center">
                          <span className="text-xs sm:text-lg font-bold text-brand-primary/20 line-through decoration-brand-primary/30 leading-none">₹{originalCartTotal.toLocaleString()}</span>
                          <p className="text-[7px] sm:text-[9px] font-black text-green-600 uppercase tracking-[0.15em] mt-0.5 whitespace-nowrap bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            Saved ₹{(originalCartTotal - cartTotal).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="shrink-0 sm:px-8 px-5 py-4 sm:py-5 bg-brand-secondary text-white font-bold rounded-2xl sm:rounded-3xl uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 group disabled:opacity-50 disabled:grayscale cursor-pointer"
                >
                  {isProcessing ? (
                    <Icon icon="line-md:loading-loop" className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Icon icon="material-symbols:shopping-cart-checkout-rounded" className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                  )}
                  <span className="inline">{isProcessing ? "Processing..." : "Checkout"}</span>
                </button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Variant Management Popup */}
        <AnimatePresence>
          {selectedProduct && (() => {
            // Find the "live" version of the selected product from our grouped items 
            // This ensures the UI updates instantly when context changes
            const liveProduct = groupedItems.find(p => p.id === selectedProduct.id) || {
              ...selectedProduct,
              variantsInCart: [],
              totalPrice: 0,
              originalTotalPrice: 0,
              totalQtyInCart: 0
            };

            return (
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProduct(null)}
                  className="absolute inset-0 bg-brand-primary/80 backdrop-blur-md"
                />

                <motion.div
                  initial={{ y: '100%', sm: { y: 20, scale: 0.9, opacity: 0 } }}
                  animate={{ y: 0, sm: { y: 0, scale: 1, opacity: 1 } }}
                  exit={{ y: '100%', sm: { y: 20, scale: 0.9, opacity: 0 } }}
                  className="bg-white w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-brand-primary/5"
                >
                  {/* Popup Header */}
                  <div className="p-6 sm:p-10 bg-brand-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex gap-4 sm:gap-6 items-center">
                        <div className="w-14 h-18 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl shrink-0">
                          <img src={liveProduct.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-bold text-brand-secondary uppercase tracking-[0.3em] mb-1.5 italic">Inventory</p>
                          <h2 className="text-lg sm:text-3xl font-serif font-bold text-white leading-tight truncate max-w-[180px] sm:max-w-none">{liveProduct.name}</h2>
                          <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 sm:mt-2">Ordering in {liveProduct.unit?.toUpperCase() === "DOZEN" ? "Dozens (12 Pcs)" : "Pieces"}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                      >
                        <Icon icon="lucide:x" className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Variant List */}
                  <div className="p-2 sm:p-4 max-h-[60vh] sm:max-h-[50vh] overflow-y-auto no-scrollbar bg-[#f8f7f3]">
                    <div className="space-y-2">
                      {/* Map over ALL available variants using LIVE data */}
                      {(liveProduct.allAvailableVariants.length > 0 ? liveProduct.allAvailableVariants : [{ name: 'Base' }]).map((availableV, idx) => {
                        const vName = availableV.name || null;
                        
                        // Find if this variant is already in the live cart
                        const inCart = liveProduct.variantsInCart.find(item => 
                          vName === 'Base' ? !item.variantName : item.variantName === vName
                        );

                        const currentQty = inCart ? inCart.quantity : 0;
                        const vPrice = inCart ? inCart.price : (availableV.price || liveProduct.basePrice);
                        const vMrp = inCart ? (inCart.originalPrice || inCart.price) : (availableV.price || liveProduct.baseMrp);

                        return (
                          <div key={idx} className={`bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border ${currentQty > 0 ? 'border-brand-secondary/20 shadow-sm' : 'border-brand-primary/5 opacity-60'} flex items-center justify-between gap-3 sm:gap-6 group hover:border-brand-secondary/30 transition-all`}>
                            {/* Info Section */}
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-brand-primary text-xs sm:text-lg uppercase tracking-wider truncate">{vName === 'Base' ? 'Base Design' : vName}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {vMrp > vPrice && (
                                    <span className="text-[8px] sm:text-xs font-bold text-brand-primary/20 line-through">₹{(vMrp || 0).toLocaleString()}</span>
                                  )}
                                  <p className="text-[9px] sm:text-sm text-brand-secondary font-black tracking-widest uppercase">₹{(vPrice || 0).toLocaleString()}<span className="text-[8px] opacity-20 ml-0.5">/pc</span></p>
                                </div>
                            </div>

                            {/* Stepper Center Section */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="flex items-center gap-1.5 sm:gap-3 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-brand-primary/5 shadow-inner">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const step = liveProduct.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
                                    const newQty = Math.max(0, currentQty - step);
                                    
                                    if (newQty === 0 && currentQty > 0) {
                                      removeFromCart(liveProduct.id, vName === 'Base' ? null : vName);
                                    } else if (newQty > 0) {
                                      updateQuantity(liveProduct.id, vName === 'Base' ? null : vName, newQty);
                                    }
                                  }}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-brand-primary/5 shadow-sm flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                >
                                  <Icon icon="lucide:minus" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                
                                <input
                                  type="number"
                                  min="0"
                                  value={liveProduct.unit?.toUpperCase() === "DOZEN" ? (currentQty / 12 || "") : (currentQty || "")}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                                    const multiplier = liveProduct.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
                                    const newQty = isNaN(val) ? 0 : val * multiplier;
                                    
                                    if (newQty === 0 && currentQty > 0) {
                                      removeFromCart(liveProduct.id, vName === 'Base' ? null : vName);
                                    } else if (newQty > 0) {
                                      if (currentQty === 0) {
                                        const prodToAdd = {
                                          id: liveProduct.id,
                                          name: liveProduct.name,
                                          category: liveProduct.category,
                                          image: liveProduct.image,
                                          unit: liveProduct.unit,
                                        };
                                        addToCart(prodToAdd, newQty, vName === 'Base' ? null : vName, vPrice, vMrp);
                                      } else {
                                        updateQuantity(liveProduct.id, vName === 'Base' ? null : vName, newQty);
                                      }
                                    }
                                  }}
                                  className="w-8 sm:w-12 text-center font-bold font-serif text-sm sm:text-lg text-brand-primary bg-transparent border-none outline-none p-0 appearance-none"
                                  placeholder="0"
                                />

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const step = liveProduct.unit?.toUpperCase() === "DOZEN" ? 12 : 1;
                                    const newQty = currentQty + step;
                                    
                                    if (currentQty === 0) {
                                      const prodToAdd = {
                                        id: liveProduct.id,
                                        name: liveProduct.name,
                                        category: liveProduct.category,
                                        image: liveProduct.image,
                                        unit: liveProduct.unit,
                                      };
                                      addToCart(prodToAdd, step, vName === 'Base' ? null : vName, vPrice, vMrp);
                                    } else {
                                      updateQuantity(liveProduct.id, vName === 'Base' ? null : vName, newQty);
                                    }
                                  }}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-brand-primary/5 shadow-sm flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                >
                                  <Icon icon="lucide:plus" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                              {liveProduct.unit?.toUpperCase() === "DOZEN" && currentQty > 0 && (
                                <p className="text-[7px] text-brand-secondary font-black uppercase mt-1">({currentQty} Pcs)</p>
                              )}
                            </div>

                            {/* Valuation Section */}
                            <div className="text-right min-w-[70px] sm:min-w-[120px] border-l border-brand-primary/5 pl-3 sm:pl-6">
                              <p className="text-[7px] sm:text-[9px] font-black text-brand-primary/20 uppercase tracking-[0.15em] mb-0.5 italic">Value</p>
                              <div className="flex flex-col items-end">
                                {(vMrp * currentQty > vPrice * currentQty) && (
                                  <span className="text-[8px] sm:text-base font-bold text-brand-primary/10 line-through leading-none mb-0.5">₹{(vMrp * currentQty).toLocaleString()}</span>
                                )}
                                <p className={`font-bold text-sm sm:text-2xl tracking-tighter leading-none ${currentQty > 0 ? 'text-brand-primary' : 'text-brand-primary/10'}`}>₹{(vPrice * currentQty).toLocaleString()}</p>
                              </div>
                            </div>

                            {currentQty > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(liveProduct.id, vName === 'Base' ? null : vName);
                                }}
                                className="p-2 sm:p-2 text-brand-primary/10 hover:text-red-500 transition-colors shrink-0"
                              >
                                <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popup Footer */}
                  <div className="p-6 sm:p-10 border-t border-brand-primary/5 flex flex-col xs:flex-row items-center justify-between bg-white gap-4 relative z-10">
                    <div className="text-center xs:text-left w-full xs:w-auto">
                      <p className="text-xs font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-1">Subtotal Valuation</p>
                      <div className="flex items-end justify-center xs:justify-start gap-2">
                         <p className="text-2xl sm:text-4xl font-bold text-brand-primary tracking-tight">₹{(liveProduct.totalPrice || 0).toLocaleString()}</p>
                        {liveProduct.originalTotalPrice > liveProduct.totalPrice && (
                          <span className="text-sm sm:text-xl font-bold text-brand-primary/20 line-through decoration-brand-primary/30 mb-1">₹{(liveProduct.originalTotalPrice || 0).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full xs:w-auto px-10 py-4 sm:py-5 bg-brand-primary text-white font-bold rounded-2xl sm:rounded-[20px] uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-brand-secondary transition-all"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </main>

      {/* Background Decorative Blur */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] sm:w-[50%] aspect-square bg-brand-secondary/5 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] sm:w-[40%] aspect-square bg-brand-primary/5 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>
    </div>
  );
}
