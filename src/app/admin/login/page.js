"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const res = await resp.json();
      
      if (resp.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        console.error("🚨 Login Failed:", res.error);
        alert(`Login failed: ${res.error}`);
        setLoading(false);
      }
    } catch (e) {
      alert("Network or Server error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/95 backdrop-blur-md p-4 text-left shadow-2xl">
      <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-2xl w-full max-w-md text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Icon icon="solar:crown-minimalistic-bold" className="w-40 h-40 text-brand-primary" />
        </div>

        <h1 className="text-3xl font-bold font-serif text-brand-primary mb-2 text-center">Admin Portal</h1>
        <p className="text-xs uppercase tracking-widest text-brand-secondary font-bold text-center mb-8">Secure Access Only</p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-10">
          <div>
              <label className="text-[10px] font-bold text-brand-primary/50 uppercase tracking-widest pl-2 mb-1 block">Admin Email</label>
              <input suppressHydrationWarning type="email" placeholder="example@shreeshyamdarshan.com" className="w-full p-4 border border-brand-primary/20 rounded-2xl focus:border-brand-secondary outline-none transition-colors" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
              <label className="text-[10px] font-bold text-brand-primary/50 uppercase tracking-widest pl-2 mb-1 block">Password</label>
              <input suppressHydrationWarning type="password" placeholder="••••••••" className="w-full p-4 border border-brand-primary/20 rounded-2xl focus:border-brand-secondary outline-none transition-colors" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button suppressHydrationWarning disabled={loading} type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-brand-secondary to-[#d4af37] text-white font-bold rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex justify-center disabled:opacity-50">
            {loading ? <Icon icon="line-md:loading-loop" className="w-6 h-6" /> : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
