"use client";
import { useState } from "react";
import AdminSidebar from "./Sidebar";
import { Icon } from "@iconify/react";

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen text-brand-primary overflow-x-hidden text-left relative">
      <AdminSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <div className="flex-1 ml-0 lg:ml-72 w-full max-w-[100vw] text-left flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-brand-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <h1 className="text-lg font-serif font-bold tracking-widest leading-tight uppercase">
            <span className="text-brand-secondary">Shree</span> Shyam Darshan
          </h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white/10 rounded-lg">
            <Icon icon="solar:hamburger-menu-bold-duotone" className="w-6 h-6 text-brand-secondary" />
          </button>
        </div>

        <div className="p-4 lg:p-10 flex-1">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
