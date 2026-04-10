"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: [],
  saved: [],
  addToCart: () => {},
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

  useEffect(() => {
    const hasSession = document.cookie.split(';').some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
    setIsAuthenticated(hasSession);
    
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

    // Fetch from backend if authenticated to sync
    if (hasSession) {
      fetchSavedFromBackend();
    }
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

  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem('ssd_cart', JSON.stringify(cart));
      localStorage.setItem('ssd_saved', JSON.stringify(saved));
    }
  }, [cart, saved]);

  const addToCart = (product, quantity = 1, variantName = null, variantPrice = null) => {
    setCart(prev => {
      const priceToUse = variantPrice !== null ? parseFloat(variantPrice) : product.price;
      const existing = prev.find(item => item.id === product.id && item.variantName === variantName);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.variantName === variantName) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, price: priceToUse, variantName }];
    });
  };

  const removeFromCart = (id, variantName = null) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.variantName === variantName)));
  };

  const updateQuantity = (id, variantName, quantity) => {
    if (quantity < 1) return removeFromCart(id, variantName);
    setCart(prev => prev.map(item => (item.id === id && item.variantName === variantName) ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

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
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      saved, toggleSave, isProductSaved, isAuthenticated, isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
