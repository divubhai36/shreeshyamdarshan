"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roundToTwo } from '@/lib/utils';

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
  originalCartTotal: 0,
  cartCount: 0,
  productCount: 0,
  isAuthenticated: false,
  isLoading: true
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Check Auth
  useEffect(() => {
    const hasSession = document.cookie.split(';').some((item) => item.trim().startsWith('ssd_wholesale_logged=true'));
    setIsAuthenticated(hasSession);
  }, [pathname]);

  // Initial local storage load
  useEffect(() => {
    const savedCart = localStorage.getItem('ssd_cart');
    const savedWishlist = localStorage.getItem('ssd_saved');
    if (savedCart) try { setCart(JSON.parse(savedCart)); } catch (e) {}
    if (savedWishlist) try { setSaved(JSON.parse(savedWishlist)); } catch (e) {}
    setIsReady(true);
  }, []);

  // Server Queries
  const { data: serverSaved } = useQuery({
    queryKey: ['user-saved'],
    queryFn: async () => {
      const res = await fetch('/api/user/saved');
      const data = await res.json();
      return data.success ? data.saved : [];
    },
    enabled: isAuthenticated,
  });

  const { data: serverCart } = useQuery({
    queryKey: ['user-cart'],
    queryFn: async () => {
      const res = await fetch('/api/user/cart');
      const data = await res.json();
      return data.success ? data.cart : [];
    },
    enabled: isAuthenticated,
  });

  // Sync server data to local state when it arrives
  useEffect(() => {
    if (isAuthenticated && serverSaved) setSaved(serverSaved);
  }, [serverSaved, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && serverCart) setCart(serverCart);
  }, [serverCart, isAuthenticated]);

  // Handle local storage persistence
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('ssd_cart', JSON.stringify(cart));
      localStorage.setItem('ssd_saved', JSON.stringify(saved));
    }
  }, [cart, saved, isReady]);

  // Mutations
  const cartMutation = useMutation({
    mutationFn: async ({ productId, quantity, variantName, price, originalPrice, action }) => {
      if (!isAuthenticated) return;
      return fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, variantName, price, originalPrice, action })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cart'] });
    }
  });

  const savedMutation = useMutation({
    mutationFn: async ({ productId, variantName }) => {
      if (!isAuthenticated) return;
      return fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantName })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-saved'] });
    }
  });

  const addToCart = React.useCallback((product, quantity = 1, variantName = null, variantPrice = null, originalPrice = null) => {
    const existing = cart.find(item => item.id === product.id && item.variantName === variantName);
    const finalQty = existing ? existing.quantity + quantity : quantity;
    
    const priceToUse = roundToTwo(variantPrice ?? product.price ?? 0);
    const oldPrice = roundToTwo(originalPrice ?? product.mrp ?? product.price ?? 0);

    setCart(prev => {
      if (existing) {
        return prev.map(item => (item.id === product.id && item.variantName === variantName) ? { ...item, quantity: finalQty } : item);
      }
      return [...prev, { ...product, quantity: finalQty, price: priceToUse, originalPrice: oldPrice, variantName }];
    });
    
    if (isAuthenticated) {
      cartMutation.mutate({ productId: product.id, quantity: finalQty, variantName, price: priceToUse, originalPrice: oldPrice });
    }
  }, [cart, isAuthenticated, cartMutation]);

  const addMultipleToCart = React.useCallback((items) => {
    setCart(prev => {
      let nextCart = [...prev];
      items.forEach(({ product, quantity, variantName, variantPrice, originalPrice }) => {
        const priceToUse = roundToTwo(variantPrice ?? product.price ?? 0);
        const oldPrice = roundToTwo(originalPrice ?? product.mrp ?? product.price ?? 0);
        const existingIdx = nextCart.findIndex(item => item.id === product.id && item.variantName === variantName);
        if (existingIdx > -1) {
          nextCart[existingIdx] = { ...nextCart[existingIdx], quantity: nextCart[existingIdx].quantity + quantity };
        } else {
          nextCart.push({ ...product, quantity, price: priceToUse, originalPrice: oldPrice, variantName });
        }
      });
      return nextCart;
    });

    if (isAuthenticated) {
      items.forEach(item => {
        cartMutation.mutate({ 
          productId: item.product.id, 
          quantity: item.quantity, 
          variantName: item.variantName, 
          price: item.variantPrice || item.product.price, 
          originalPrice: item.originalPrice || item.product.mrp || item.product.price 
        });
      });
    }
  }, [isAuthenticated, cartMutation]);

  const removeFromCart = React.useCallback((id, variantName = null) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.variantName === variantName)));
    if (isAuthenticated) cartMutation.mutate({ productId: id, quantity: 0, variantName, price: 0, originalPrice: 0 });
  }, [isAuthenticated, cartMutation]);

  const updateQuantity = React.useCallback((id, variantName, quantity) => {
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
    if (isAuthenticated) cartMutation.mutate({ productId: id, quantity, variantName, price: itemPrice, originalPrice: itemOriginalPrice });
  }, [isAuthenticated, cartMutation, removeFromCart]);

  const clearCart = React.useCallback(() => {
    setCart([]);
    if (isAuthenticated) cartMutation.mutate({ productId: null, quantity: 0, variantName: null, price: 0, originalPrice: 0, action: "CLEAR_CART" });
  }, [isAuthenticated, cartMutation]);

  const toggleSave = React.useCallback((product, variantName = null) => {
    const vName = variantName || product.variantName || null;
    const isSaved = saved.some(item => item.id === product.id && item.variantName === vName);
    if (isSaved) {
      setSaved(prev => prev.filter(item => !(item.id === product.id && item.variantName === vName)));
    } else {
      setSaved(prev => [{ ...product, variantName: vName }, ...prev]);
    }

    if (isAuthenticated) {
      savedMutation.mutate({ productId: product.id, variantName: vName });
    }
  }, [saved, isAuthenticated, savedMutation]);

  const isProductSaved = React.useCallback((id, variantName = null) => 
    saved.some(item => item.id === id && (variantName ? item.variantName === variantName : true)),
    [saved]
  );

  const cartTotal = React.useMemo(() => roundToTwo(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)), [cart]);
  const originalCartTotal = React.useMemo(() => roundToTwo(cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0)), [cart]);
  const cartCount = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const productCount = React.useMemo(() => new Set(cart.map(item => item.id)).size, [cart]);

  const value = React.useMemo(() => ({ 
    cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, cartTotal, originalCartTotal, cartCount, productCount,
    saved, toggleSave, isProductSaved, isAuthenticated, isLoading: !isReady 
  }), [
    cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, cartTotal, originalCartTotal, cartCount, productCount,
    saved, toggleSave, isProductSaved, isAuthenticated, isReady
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
