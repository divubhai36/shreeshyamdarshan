"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const links = [
    { name: "Dashboard", path: "/admin", icon: "lucide:layout-dashboard" },
    { name: "Categories", path: "/admin/categories", icon: "lucide:folder" },
    { name: "Sub-Categories", path: "/admin/subcategories", icon: "lucide:layers" },
    { name: "Inner Categories", path: "/admin/inner-subcategories", icon: "lucide:boxes" },
    { name: "Products", path: "/admin/products", icon: "lucide:shopping-bag" },
    { name: "Return to Site", path: "/", icon: "lucide:globe" },
  ];

  return (
    <div className="w-64 bg-brand-primary text-white h-screen fixed top-0 left-0 p-5 flex flex-col z-50 text-left">
      <div className="text-2xl font-serif font-black mb-10 text-brand-secondary text-left mt-2">
        Admin Panel
      </div>

      <div className="flex-1 space-y-2 text-left">
        {links.map((link) => {
          const isActive = pathname === link.path || (link.name !== "Dashboard" && link.name !== "Return to Site" && pathname.includes(link.path));
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-xs tracking-wider uppercase text-left ${
                isActive
                  ? "bg-brand-secondary text-white shadow-lg"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon icon={link.icon} className="w-5 h-5 mb-0.5" />
              {link.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-xs uppercase text-left mt-auto"
      >
        <Icon icon="lucide:log-out" className="w-5 h-5 mb-0.5" />
        Logout
      </button>
    </div>
  );
}
