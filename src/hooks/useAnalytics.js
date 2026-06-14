import { useCallback } from "react";
import { event } from "@/lib/analytics";

export function useAnalytics() {
  const trackEvent = useCallback((action, params) => {
    event(action, params);
  }, []);

  const trackProductView = useCallback((product) => {
    if (!product) return;
    trackEvent("product_viewed", {
      item_id: product.id,
      item_name: product.name,
      price: product.offerPrice || product.price,
      currency: "INR",
      category: product.category || "Unknown",
      sub_category: product.subCategory || "Unknown",
      inner_category: product.innerCategory || null
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((product, quantity, variantName) => {
    if (!product) return;
    trackEvent("add_to_cart", {
      item_id: product.id,
      item_name: product.name,
      price: product.offerPrice || product.price,
      quantity: quantity,
      variant: variantName || "Default",
      currency: "INR",
      category: product.category || "Unknown",
      sub_category: product.subCategory || "Unknown"
    });
  }, [trackEvent]);

  const trackCheckoutInitiated = useCallback((cart, cartTotal) => {
    if (!cart || cart.length === 0) return;
    trackEvent("checkout_initiated", {
      value: cartTotal,
      currency: "INR",
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variantName || "Default"
      }))
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackProductView,
    trackAddToCart,
    trackCheckoutInitiated
  };
}
