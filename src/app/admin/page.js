"use client";
import React from 'react';
import { Icon } from '@iconify/react';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({ categories: "...", subCategories: "...", products: "...", reviews: "..." });

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.categories !== undefined) {
          setStats(data);
        }
      })
      .catch(err => console.error("Stats fetch error:", err));
  }, []);

  const statItems = [
    { title: "Total Categories", count: stats.categories, icon: "lucide:folder", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Sub Categories", count: stats.subCategories, icon: "lucide:layers", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Products Online", count: stats.products, icon: "lucide:shopping-bag", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Reviews", count: stats.reviews, icon: "lucide:star", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto text-left">
      <div className="mb-10 text-left">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary text-left mb-2">Systems Overview</h1>
        <p className="text-xs uppercase tracking-widest text-brand-secondary font-bold text-left">Manage your boutique empire</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {statItems.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-black/5 flex flex-col text-left">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} text-left`}>
              <Icon icon={stat.icon} className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-brand-primary mb-1 text-left">{stat.count}</h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary/40 text-left">{stat.title}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-10 bg-brand-primary text-white p-10 rounded-[32px] relative overflow-hidden shadow-2xl text-left">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <Icon icon="solar:shield-check-bold" className="w-40 h-40" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-4 relative z-10 text-left">Welcome to dynamic management.</h2>
        <p className="text-sm font-medium text-white/70 max-w-lg mb-8 relative z-10 leading-relaxed text-left">
          From this portal, you have absolute control over your digital storefront. Use the sidebar to seamlessly inject, alter, or remove product data. All media uploaded will automatically be heavily compressed via Cloudinary to guarantee elite site performance.
        </p>
        <div className="relative z-10 inline-flex px-4 py-2 rounded-full bg-brand-secondary/20 border border-brand-secondary font-bold text-[10px] text-brand-secondary uppercase tracking-widest">
            System Live & Secure
        </div>
      </div>
    </div>
  );
}
