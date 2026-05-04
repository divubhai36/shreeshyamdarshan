"use client";
import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

// ── helpers ──────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);
const fmtCurrency = (n) =>
  '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n ?? 0);

const STATUS_MAP = {
  PENDING:    { label: 'Pending',    color: 'text-amber-600',  bg: 'bg-amber-500/10',  icon: 'solar:clock-circle-bold' },
  APPROVED:   { label: 'Approved',   color: 'text-blue-600',   bg: 'bg-blue-500/10',   icon: 'solar:check-circle-bold' },
  DISPATCHED: { label: 'Dispatched', color: 'text-purple-600', bg: 'bg-purple-500/10', icon: 'solar:delivery-bold' },
  COMPLETED:  { label: 'Completed',  color: 'text-emerald-600',bg: 'bg-emerald-500/10',icon: 'solar:check-read-bold' },
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-500',    bg: 'bg-red-500/10',    icon: 'solar:close-circle-bold' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── sub-components ───────────────────────────────────────────
function StatCard({ title, value, icon, color, bg, href, sub }) {
  const inner = (
    <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon icon={icon} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-3xl font-bold text-brand-primary">{value}</p>
        <p className="text-[10px] uppercase font-bold tracking-widest text-brand-primary/40 mt-0.5">{title}</p>
        {sub && <p className="text-[10px] font-medium text-brand-primary/30 mt-1">{sub}</p>}
      </div>
      {href && (
        <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest group-hover:text-brand-secondary transition-colors">
          Manage <Icon icon="lucide:arrow-right" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function QuickAction({ icon, label, href, color, bg }) {
  return (
    <Link href={href}
      className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-black/5 bg-white hover:shadow-md transition-all duration-300 group`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon icon={icon} className="w-5 h-5" />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/60 group-hover:text-brand-primary transition-colors text-center">{label}</span>
    </Link>
  );
}

// ── page ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [time, setTime] = React.useState(null);

  // Live clock — initialize only on client to avoid hydration mismatch
  React.useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch stats
  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { if (!d.error) setStats(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const skeletonClass = "animate-pulse bg-brand-primary/5 rounded-2xl";

  const statItems = stats ? [
    { title: "Total Products",    value: fmt(stats.products),           icon: "solar:bag-bold-duotone",                          color: "text-emerald-600", bg: "bg-emerald-500/10", href: "/admin/products" },
    { title: "Active Wholesalers",   value: fmt(stats.activeWholesalers), icon: "solar:users-group-rounded-bold-duotone",          color: "text-blue-600",    bg: "bg-blue-500/10",    href: "/admin/wholesalers", sub: `${fmt(stats.totalWholesalers)} total` },
    { title: "Discount Products", value: fmt(stats.offerProducts),     icon: "solar:tag-price-bold-duotone",                    color: "text-orange-500",  bg: "bg-orange-500/10",  href: "/admin/products",    sub: "" },
    { title: "Ready Stock",       value: fmt(stats.readyStockProducts), icon: "solar:box-minimalistic-bold-duotone",             color: "text-cyan-600",    bg: "bg-cyan-500/10",    href: "/admin/products",    sub: "Available for quick dispatch" },
    { title: "Pending Reviews",   value: fmt(stats.reviews),           icon: "solar:star-fall-bold-duotone",                    color: "text-rose-500",    bg: "bg-rose-500/10",    href: "/admin/reviews" },
    { title: "Categories",        value: fmt(stats.categories),        icon: "solar:folder-2-bold-duotone",                     color: "text-indigo-600",  bg: "bg-indigo-500/10",  href: "/admin/categories",  sub: `${fmt(stats.subCategories)} sub-categories` },
  ] : [];

  const quickActions = [
    { icon: "solar:add-square-bold-duotone",      label: "New Product",     href: "/admin/products",         color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { icon: "solar:user-plus-bold-duotone",       label: "Add Wholesaler",     href: "/admin/wholesalers",      color: "text-blue-600",    bg: "bg-blue-500/10" },
    { icon: "solar:folder-with-files-bold-duotone", label: "Add Category",  href: "/admin/categories",       color: "text-indigo-600",  bg: "bg-indigo-500/10" },
    { icon: "solar:bill-list-bold-duotone",       label: "View Orders",     href: "/admin/orders",           color: "text-amber-600",   bg: "bg-amber-500/10" },
    { icon: "solar:chat-line-bold-duotone",       label: "Inquiries",       href: "/admin/inquiries",        color: "text-cyan-600",    bg: "bg-cyan-500/10" },
    { icon: "solar:star-fall-bold-duotone",       label: "Reviews",         href: "/admin/reviews",          color: "text-rose-500",    bg: "bg-rose-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto sm:mx-6 space-y-8 pb-10">

      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary">Admin Portal</h1>
          <p className="text-[11px] uppercase tracking-widest text-brand-secondary font-bold mt-1">Shree Shyam Darshan — Admin Portal</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-2xl font-mono font-bold text-brand-primary tabular-nums">
            {time ? time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '──:──:──'}
          </p>
          <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">
            {time ? time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) : '─────────'}
          </p>
        </div>
      </div>

      {/* ── Order Pipeline Banner ─────────────────────────── */}
      {!loading && stats && (
        <div className="relative overflow-hidden rounded-[28px] bg-brand-primary text-white p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Icon icon="solar:bill-list-bold" className="absolute -right-8 -top-8 w-64 h-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
            {[
              { label: 'Pending',    val: stats.pendingOrders,    color: 'bg-amber-400',   desc: 'Awaiting approval' },
              { label: 'Dispatched', val: stats.dispatchedOrders, color: 'bg-purple-400',  desc: 'In transit' },
              { label: 'Completed',  val: stats.completedOrders,  color: 'bg-emerald-400', desc: 'Successfully delivered' },
            ].map((item, i) => (
              <div key={item.label} className={i > 0 ? 'border-l border-white/10 pl-8' : ''}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{item.label}</p>
                </div>
                <p className="text-4xl font-bold font-serif">{fmt(item.val)}</p>
                <p className="text-[10px] text-white/40 font-medium mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && <div className={`${skeletonClass} h-44`} />}

      {/* ── Stat Cards ───────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className={`${skeletonClass} h-36`} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statItems.map((s) => <StatCard key={s.title} {...s} value={loading ? '…' : s.value} />)}
        </div>
      )}

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(a => <QuickAction key={a.label} {...a} />)}
        </div>
      </div>

      {/* ── Two Column: Recent Orders + New Wholesalers ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-brand-primary text-lg">Recent Orders</h2>
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">Last 5 orders placed</p>
            </div>
            <Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary hover:underline flex items-center gap-1">
              View All <Icon icon="lucide:arrow-right" className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className={`${skeletonClass} w-10 h-10 rounded-full`} />
                  <div className="flex-1 space-y-1.5">
                    <div className={`${skeletonClass} h-3 w-2/3`} />
                    <div className={`${skeletonClass} h-2 w-1/3`} />
                  </div>
                </div>
              ))
            ) : stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map(order => {
                const s = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                return (
                  <Link key={order.id} href="/admin/orders" className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
                      <Icon icon={s.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-brand-primary truncate">{order.wholesalerName}</p>
                      <p className="text-[10px] text-brand-primary/40 font-medium">#{order.orderNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-brand-primary">{fmtCurrency(order.totalAmount)}</p>
                      <p className="text-[9px] text-brand-primary/30 font-bold uppercase tracking-wider">{timeAgo(order.createdAt)}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Icon icon="solar:bill-list-broken" className="w-10 h-10 text-brand-primary/10 mx-auto mb-3" />
                <p className="text-[11px] font-bold text-brand-primary/30 uppercase tracking-wider">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Wholesalers */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-brand-primary text-lg">New Wholesalers</h2>
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/30">Recently joined wholesalers</p>
            </div>
            <Link href="/admin/wholesalers" className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary hover:underline flex items-center gap-1">
              View All <Icon icon="lucide:arrow-right" className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className={`${skeletonClass} w-10 h-10 rounded-full`} />
                  <div className="flex-1 space-y-1.5">
                    <div className={`${skeletonClass} h-3 w-2/3`} />
                    <div className={`${skeletonClass} h-2 w-1/3`} />
                  </div>
                </div>
              ))
            ) : stats?.recentWholesalers?.length > 0 ? (
              stats.recentWholesalers.map(w => (
                <Link key={w.id} href="/admin/wholesalers" className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0 text-brand-primary font-bold text-sm uppercase">
                    {(w.companyName || w.name || '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-brand-primary truncate">{w.companyName || w.name}</p>
                    <p className="text-[10px] text-brand-primary/40 font-medium">{w.phone}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${w.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
                      {w.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-[9px] text-brand-primary/30 font-bold uppercase tracking-wider mt-1">{timeAgo(w.createdAt)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <Icon icon="solar:users-group-rounded-broken" className="w-10 h-10 text-brand-primary/10 mx-auto mb-3" />
                <p className="text-[11px] font-bold text-brand-primary/30 uppercase tracking-wider">No Wholesaler yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Attention Needed Banner ──────────────────────────── */}
      {!loading && stats && (stats.pendingOrders > 0 || stats.reviews > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Icon icon="solar:bell-bing-bold-duotone" className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-800 text-sm mb-1">Attention Required</p>
              <p className="text-[11px] text-amber-700/70 font-medium">
                {[
                  stats.pendingOrders > 0 && `${stats.pendingOrders} order${stats.pendingOrders > 1 ? 's' : ''} waiting for approval`,
                  stats.reviews > 0 && `${stats.reviews} review${stats.reviews > 1 ? 's' : ''} pending moderation`,
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {stats.pendingOrders > 0 && (
                <Link href="/admin/orders" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors">
                  Orders
                </Link>
              )}
              {stats.reviews > 0 && (
                <Link href="/admin/reviews" className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-50 transition-colors">
                  Reviews
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer Info ──────────────────────────────────────── */}
      <div className="text-center pt-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/20">
          Shree Shyam Darshan · Admin Portal · All systems operational
        </p>
      </div>
    </div>
  );
}
