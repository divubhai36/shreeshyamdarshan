"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";


function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const res = await resp.json();

      if (resp.ok) {
        // Store user for persistent UI check
        localStorage.setItem('ssd_user', JSON.stringify(res.user));

        router.push(searchParams.get("callbackUrl") || "/wholesalers/dashboard");
        router.refresh();
      } else {
        toast.error(`Authentication failed: ${res.error}`);
        setLoading(false);
      }
    } catch (e) {
      toast.error("Network or Server error");
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-brand-primary p-4 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full" />

      <div className="bg-white rounded-[32px] lg:rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative border border-white/10">

        {/* Branding Sidebar */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-[#0f2a20] to-brand-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] scale-150 rotate-12 opacity-20" />
            </div>

            <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight tracking-widest uppercase">
                    Shree Shyam <br/>
                    <span className="text-brand-secondary">Darshan</span>
                </h2>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-8">Wholesale Concept Portal</p>
                <div className="h-1 w-20 bg-brand-secondary rounded-full" />
            </div>

            <div className="relative z-10">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Secured B2B Gateway</p>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary">
                        <Icon icon="solar:shop-bold-duotone" className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary">
                        <Icon icon="solar:hand-stars-bold-duotone" className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* Login Form */}
        <div className="p-6 lg:p-16 flex flex-col justify-center text-left bg-white">
          <div className="mb-8 lg:mb-10">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-brand-primary mb-2 uppercase tracking-wide">Wholesaler Login</h1>
            <p className="text-xs lg:text-sm text-brand-primary/40 font-medium">Authorized wholesalers access ONLY</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 relative z-10">
            <div className="space-y-2">
                <label className="text-[9px] lg:text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest pl-2 block">WhatsApp IqD</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:phone-bold-duotone" className="w-5 lg:w-6 h-5 lg:h-6" />
                  </div>
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    className="w-full p-4 lg:p-5 pl-12 lg:pl-14 bg-brand-primary/2 border border-transparent rounded-2xl lg:rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-bold text-brand-primary placeholder:text-brand-primary/20 text-sm lg:text-base"
                    value={phone}
                    onChange={e=>setPhone(e.target.value)}
                    required
                  />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] lg:text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest pl-2 block">Access Code</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:key-minimalistic-bold-duotone" className="w-5 lg:w-6 h-5 lg:h-6" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Private Code"
                    className="w-full p-4 lg:p-5 pl-12 lg:pl-14 pr-12 bg-brand-primary/2 border border-transparent rounded-2xl lg:rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-bold text-brand-primary placeholder:text-brand-primary/20 text-sm lg:text-base"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-secondary transition-colors p-2 rounded-lg">
                    <Icon icon={showPassword ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"} className="w-5 lg:w-6 h-5 lg:h-6" />
                  </button>
                </div>
                <div className="flex justify-end pr-2">
                   <button 
                    type="button" 
                    onClick={() => {
                        if (!phone) return toast.error("Please enter your WhatsApp Number first");
                        const whatsappNum = "917383699199";
                        const text = `Hi, *Shree Shyam Darshan Team*\n\nI forgot my access code for the Wholesale Portal.\nMy WhatsApp Number: ${phone}\n\nPlease help me reset it.`;
                        window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, "_blank");
                    }} 
                    className="text-[9px] font-bold text-brand-secondary hover:text-brand-primary uppercase tracking-widest transition-colors outline-none"
                   >
                     Forgot Access Code?
                   </button>
                </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 lg:py-5 mt-2 lg:mt-4 bg-linear-to-r from-brand-secondary to-[#d4af37] text-white font-bold rounded-2xl lg:rounded-[24px] uppercase tracking-widest text-[10px] lg:text-[11px] shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 disabled:opacity-50"
            >
              {loading ? <Icon icon="line-md:loading-loop" className="w-5 lg:w-6 h-5 lg:h-6" /> : "Authorize Member Access"}
            </button>
          </form>

          <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-brand-primary/5 text-center">
            <p className="text-[9px] lg:text-[10px] text-brand-primary/30 font-bold uppercase tracking-widest leading-relaxed">Account not active? Please contact our <br/> Concierge Desk at +91 73836 99199</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UserLogin() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary">
        <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
