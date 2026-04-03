"use client";
import { CartProvider } from "@/context/CartContext";
import LeadPopup from "./LeadPopup";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <LeadPopup />
      {children}
    </CartProvider>
  );
}
