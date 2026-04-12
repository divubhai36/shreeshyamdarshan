"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const CartContext = createContext({
  cart: [],
  saved: [],
  addToCart: () => {},
  addMultipleToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleSave: () => {},
  isProductSaved: () => false,
  cartTotal: 0,
  cartCount: 0,
  isAuthenticated: false,
  isLoading: true
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = React.useRef(true);
  const isCartFetched = React.useRef(false);
  const pathname = usePathname();

  // Re-check authentication and fetch data
  useEffect(() => {
    const hasSession = document.cookie.split(';').some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
    setIsAuthenticated(hasSession);
    
    if (hasSession && !isCartFetched.current) {
      // Force fetch from backend on first load/login
      fetchSavedFromBackend();
      fetchCartFromBackend();
      isCartFetched.current = true;
    }
  }, [pathname]);

  useEffect(() => {
    // Initial load from storage
    const savedCart = localStorage.getItem('ssd_cart');
    const savedWishlist = localStorage.getItem('ssd_saved');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedWishlist) {
      try {
        setSaved(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    
    isInitialLoad.current = false;
    setIsLoading(false);
  }, []);

  const fetchSavedFromBackend = async () => {
    try {
      const res = await fetch('/api/user/saved');
      const data = await res.json();
      if (data.success) {
        setSaved(data.saved);
      }
    } catch (err) {
      console.error("Error fetching saved products:", err);
    }
  };

  const fetchCartFromBackend = async () => {
    try {
      const res = await fetch('/api/user/cart');
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart from backend:", err);
    }
  };

  const syncCartItem = async (productId, quantity, variantName, price, originalPrice, action) => {
    if (!isAuthenticated) return;
    try {
      await fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, variantName, price, originalPrice, action })
      });
    } catch (err) {
      console.error("Error syncing cart item:", err);
    }
  };

  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem('ssd_cart', JSON.stringify(cart));
      localStorage.setItem('ssd_saved', JSON.stringify(saved));
    }
  }, [cart, saved]);

  const addToCart = (product, quantity = 1, variantName = null, variantPrice = null, originalPrice = null) => {
    const existing = cart.find(item => item.id === product.id && item.variantName === variantName);
    const finalQty = existing ? existing.quantity + quantity : quantity;
    
    const priceToUse = (variantPrice !== null && variantPrice !== undefined) 
      ? parseFloat(variantPrice) 
      : (product.price || 0);
    
    const oldPrice = (originalPrice !== null && originalPrice !== undefined)
      ? parseFloat(originalPrice)
      : (product.mrp || product.price || 0);

    setCart(prev => {
      if (existing) {
        return prev.map(item => (item.id === product.id && item.variantName === variantName) ? { ...item, quantity: finalQty } : item);
      }
      return [...prev, { ...product, quantity: finalQty, price: priceToUse, originalPrice: oldPrice, variantName }];
    });
    
    // Sync with DB
    if (isAuthenticated) {
      syncCartItem(product.id, finalQty, variantName, priceToUse, oldPrice);
    }
  };

  const addMultipleToCart = (items) => {
    // items: Array of { product, quantity, variantName, variantPrice, originalPrice }
    setCart(prev => {
      let nextCart = [...prev];
      items.forEach(({ product, quantity, variantName, variantPrice, originalPrice }) => {
        const priceToUse = variantPrice ?? product.price ?? 0;
        const oldPrice = originalPrice ?? product.mrp ?? product.price ?? 0;
        
        const existingIdx = nextCart.findIndex(item => item.id === product.id && item.variantName === variantName);
        if (existingIdx > -1) {
          nextCart[existingIdx] = { 
            ...nextCart[existingIdx], 
            quantity: nextCart[existingIdx].quantity + quantity 
          };
        } else {
          nextCart.push({ ...product, quantity, price: priceToUse, originalPrice: oldPrice, variantName });
        }
      });
      return nextCart;
    });

    if (isAuthenticated) {
      // Sync each to DB - For high performance we could add a bulk API endpoint
      // but individual calls are safer for current architecture. 
      // Actually, let's just loop them for now as it's a small number of variants.
      items.forEach(async (item) => {
        // Need to find the final quantity after increment
        // It's safer to just sync the whole cart or use a bulk endpoint.
        // I will implement a bulk sync in the API.
      });
      
      // Let's use a specialized bulk sync
      syncBulkItems(items);
    }
  };

  const syncBulkItems = async (items) => {
    if (!isAuthenticated) return;
    try {
      await fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: "BULK_ADD", 
          items: items.map(it => ({
            productId: it.product.id,
            quantity: it.quantity, // This is the increment
            variantName: it.variantName,
            price: it.variantPrice,
            originalPrice: it.originalPrice
          }))
        })
      });
    } catch (err) {
      console.error("Error bulk syncing cart:", err);
    }
  };

  const removeFromCart = (id, variantName = null) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.variantName === variantName)));
    if (isAuthenticated) {
      syncCartItem(id, 0, variantName, 0, 0);
    }
  };

  const updateQuantity = (id, variantName, quantity) => {
    if (quantity < 1) return removeFromCart(id, variantName);
    let itemPrice = 0;
    let itemOriginalPrice = 0;
    setCart(prev => prev.map(item => {
      if (item.id === id && item.variantName === variantName) {
        itemPrice = item.price;
        itemOriginalPrice = item.originalPrice;
        return { ...item, quantity };
      }
      return item;
    }));
    if (isAuthenticated) {
      syncCartItem(id, quantity, variantName, itemPrice, itemOriginalPrice);
    }
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated) {
      syncCartItem(null, 0, null, 0, 0, "CLEAR_CART");
    }
  };

  const toggleSave = async (product) => {
    // Optimistic update
    const isSaved = saved.some(item => item.id === product.id);
    if (isSaved) {
      setSaved(prev => prev.filter(item => item.id !== product.id));
    } else {
      setSaved(prev => [product, ...prev]);
    }

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await fetch('/api/user/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (err) {
        console.error("Error syncing saved product:", err);
      }
    }
  };

  const isProductSaved = (id) => saved.some(item => item.id === id);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalCartTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, cartTotal, originalCartTotal, cartCount,
      saved, toggleSave, isProductSaved, isAuthenticated, isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
