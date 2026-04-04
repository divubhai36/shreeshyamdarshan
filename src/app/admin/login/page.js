"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full" />

      <div className="bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative border border-white/10">

        {/* Left Side - Visual Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-brand-primary to-[#0a1a14] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150 rotate-12" />
            </div>

            <div className="relative z-10">
                <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight ">
                    Shree Shyam <br/>
                    <span className="text-brand-secondary">Darshan</span>
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 mb-8">Administrative Portal</p>
                <div className="h-1 w-20 bg-brand-secondary rounded-full" />
            </div>

            <div className="relative z-10">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Secured by AES-256 Protocol</p>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary">
                        <Icon icon="solar:shield-star-bold-duotone" className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary">
                        <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center text-left bg-white">
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-brand-primary mb-2">Welcome Back</h1>
            <p className="text-sm text-brand-primary/40 font-medium">Please authenticate to access the vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.2em] pl-2 block">Identification</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:user-circle-bold-duotone" className="w-6 h-6" />
                  </div>
                  <input
                    suppressHydrationWarning
                    type="email"
                    placeholder="Enter Admin Email"
                    className="w-full p-5 pl-14 bg-black/2 border border-transparent rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-medium"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    required
                  />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.2em] pl-2 block">Security Code</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:password-bold-duotone" className="w-6 h-6" />
                  </div>
                  <input
                    suppressHydrationWarning
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Private Password"
                    className="w-full p-5 pl-14 pr-12 bg-black/2 border border-transparent rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-medium"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-secondary transition-colors p-2 rounded-lg hover:bg-brand-secondary/5">
                    <Icon icon={showPassword ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"} className="w-6 h-6" />
                  </button>
                </div>
            </div>

            <button
              suppressHydrationWarning
              disabled={loading}
              type="submit"
              className="w-full py-5 mt-4 bg-linear-to-r from-brand-secondary to-[#d4af37] text-white font-bold rounded-[24px] uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Icon icon="line-md:loading-loop" className="w-6 h-6" /> : (
                <>
                   <Icon icon="solar:map-arrow-square-bold-duotone" className="w-5 h-5 text-white" />
                   Authenticate Access
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 text-center">
            <p className="text-[10px] text-brand-primary/20 font-bold uppercase tracking-widest">© 2026 Shree Shyam Darshan • International Edition</p>
          </div>
        </div>

      </div>
    </div>
  );
}
