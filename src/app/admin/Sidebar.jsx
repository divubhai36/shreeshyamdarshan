"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const links = [
    { name: "Dashboard", path: "/admin", icon: "solar:widget-add-bold-duotone" },
    { name: "Categories", path: "/admin/categories", icon: "solar:folder-2-bold-duotone" },
    { name: "Sub-Categories", path: "/admin/subcategories", icon: "solar:layers-bold-duotone" },
    { name: "Inner Categories", path: "/admin/inner-subcategories", icon: "solar:box-bold-duotone" },
    { name: "Products", path: "/admin/products", icon: "solar:bag-bold-duotone" },
    { name: "Settings", path: "/admin/settings", icon: "solar:settings-minimalistic-bold-duotone" },
    { name: "Return to Site", path: "/", icon: "solar:globus-bold-duotone" },
  ];

  return (
    <div className="w-72 bg-brand-primary text-white h-screen fixed top-0 left-0 p-6 flex flex-col z-50 border-r border-white/5 shadow-2xl">
      <div className="px-4 py-8 mb-4">
        <h1 className="text-2xl font-serif font-bold text-white tracking-widest leading-tight uppercase">
            <span className="text-brand-secondary">Shree</span> Shyam <br/>
            Darshan
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mt-2">Administrative Portal</p>
      </div>

      <div className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.path || (link.name !== "Dashboard" && link.name !== "Return to Site" && pathname.includes(link.path));
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-[11px] tracking-widest uppercase relative overflow-hidden ${
                isActive
                  ? "bg-white/10 text-brand-secondary shadow-lg border border-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              )}
              <Icon icon={link.icon} className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-secondary" : "opacity-70"}`} />
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 mt-auto">
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 font-bold text-[11px] uppercase tracking-widest"
        >
          <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
            <Icon icon="solar:logout-3-bold-duotone" className="w-5 h-5" />
          </div>
          Logout Session
        </button>
      </div>
    </div>
  );
}
